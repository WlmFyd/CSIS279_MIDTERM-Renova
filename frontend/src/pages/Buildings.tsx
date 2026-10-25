import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { createBuilding, deleteBuilding, getBuildings, joinBuilding, leaveBuilding, updateBuilding } from '../apis/buildings';
import type { Building } from '../types/models';
import type { CreateBuildingPayload } from '../types/payloads';
import { apiError, ConfirmDialog, displayLabel, Empty, Loading, PageHeading, RequestNotice } from '../components/renova-ui';

export default function BuildingsPage({ demoUserId }: { demoUserId: number }) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<Building | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('residential');

  const load = useCallback(async () => {
    try { setBuildings((await getBuildings()).data); setError(''); }
    catch (err) { setError(apiError(err)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => buildings.filter(b => `${b.name} ${b.type}`.toLowerCase().includes(search.toLowerCase())), [buildings, search]);

  function openCreate() { setEditing(null); setName(''); setType('residential'); setShowForm(true); }
  function openEdit(building: Building) { setEditing(building.id); setName(building.name); setType(building.type); setShowForm(true); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setSuccess('');
    try {
      const payload: CreateBuildingPayload = { name: name.trim(), type: type as CreateBuildingPayload['type'] };
      if (editing === null) await createBuilding(payload); else await updateBuilding(editing, payload);
      setShowForm(false); setSuccess(editing === null ? 'Building created.' : 'Building updated.');
      await load();
    } catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  async function membership(buildingId: number, action: 'join' | 'leave') {
    if (!demoUserId) { setError('Create or select a demo user first.'); return; }
    setBusy(true); setError(''); setSuccess('');
    try {
      // Uses your existing APIs exactly as supplied.
      if (action === 'join') await joinBuilding(buildingId, demoUserId);
      else await leaveBuilding(buildingId, demoUserId);
      setSuccess(`User #${demoUserId} ${action === 'join' ? 'joined' : 'left'} building #${buildingId}.`);
      await load();
    } catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true); setError(''); setSuccess('');
    try { await deleteBuilding(toDelete.id); setSuccess('Building deleted.'); setToDelete(null); await load(); }
    catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  return <>
    <PageHeading title="Buildings" subtitle="Manage locations and their memberships." action={<Button onClick={openCreate}>+ New building</Button>}/>
    <RequestNotice error={error} success={success} onDismiss={() => { setError(''); setSuccess(''); }}/>
    <Card className="renova-card">
      <Card.Body>
        <Form.Control className="mb-3" placeholder="Search buildings..." aria-label="Search buildings" value={search} onChange={event => setSearch(event.target.value)}/>
        {loading ? <Loading/> : visible.length === 0 ? <Empty text="No buildings found."/> :
          <div className="table-responsive"><Table hover className="align-middle mb-0 renova-table">
            <thead><tr><th>Building</th><th>Type</th><th>Membership</th><th className="text-end">Actions</th></tr></thead>
            <tbody>{visible.map(building => <tr key={building.id}>
              <td><div className="fw-semibold">{building.name}</div><small className="text-secondary">Building #{building.id}</small></td>
              <td>{displayLabel(building.type)}</td>
              <td><div className="d-flex flex-wrap gap-1">
                <Button size="sm" variant="outline-success" disabled={busy || !demoUserId} onClick={() => void membership(building.id, 'join')}>Join</Button>
                <Button size="sm" variant="outline-secondary" disabled={busy || !demoUserId} onClick={() => void membership(building.id, 'leave')}>Leave</Button>
              </div></td>
              <td className="text-end text-nowrap">
                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEdit(building)}>Edit</Button>
                <Button size="sm" variant="outline-danger" onClick={() => setToDelete(building)}>Delete</Button>
              </td>
            </tr>)}</tbody>
          </Table></div>}
      </Card.Body>
    </Card>

    <Modal show={showForm} onHide={() => !busy && setShowForm(false)} centered>
      <Form onSubmit={event => void submit(event)}>
        <Modal.Header closeButton><Modal.Title className="fs-5">{editing === null ? 'New building' : 'Edit building'}</Modal.Title></Modal.Header>
        <Modal.Body><Row className="g-3">
          <Col xs={12}><Form.Group><Form.Label>Name</Form.Label><Form.Control required value={name} onChange={event => setName(event.target.value)} placeholder="e.g. North Campus"/></Form.Group></Col>
          <Col xs={12}><Form.Group><Form.Label>Building type</Form.Label><Form.Select value={type} onChange={event => setType(event.target.value)}>
            <option value="residential">Residential</option><option value="institutional">Institutional</option><option value="other">Other</option>
          </Form.Select><Form.Text muted>Adjust options here if your BuildingType enum differs.</Form.Text></Form.Group></Col>
        </Row></Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" onClick={() => setShowForm(false)} disabled={busy}>Cancel</Button><Button type="submit" disabled={busy || !name.trim()}>{busy ? 'Saving...' : 'Save building'}</Button></Modal.Footer>
      </Form>
    </Modal>
    <ConfirmDialog show={toDelete !== null} title="Delete building?" message={`Delete ${toDelete?.name ?? 'this building'}? This may affect associated tickets.`} busy={busy} onCancel={() => setToDelete(null)} onConfirm={() => void confirmDelete()}/>
  </>;
}
