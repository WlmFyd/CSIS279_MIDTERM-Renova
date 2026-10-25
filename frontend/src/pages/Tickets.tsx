import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { getBuildings } from '../apis/buildings';
import { createTicket, getTickets } from '../apis/tickets';
import type { Building, Ticket } from '../types/models';
import type { CreateTicketPayload } from '../types/payloads';
import { apiError, Empty, Loading, PageHeading, RequestNotice, StatusTag, ticketBuildingId } from '../components/renova-ui';

export default function TicketsPage({ demoUserId, onOpenTicket }: { demoUserId: number; onOpenTicket: (ticketId: number) => void }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [buildingFilter, setBuildingFilter] = useState('all');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [buildingId, setBuildingId] = useState<number>(0);
  const [urgency, setUrgency] = useState('medium');
  const [allowComments, setAllowComments] = useState(true);

  const load = useCallback(async () => {
    try {
      const [ticketResponse, buildingResponse] = await Promise.all([getTickets(), getBuildings()]);
      setTickets(ticketResponse.data); setBuildings(buildingResponse.data); setError('');
      setBuildingId(id => id || buildingResponse.data[0]?.id || 0);
    } catch (err) { setError(apiError(err)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const visible = useMemo(() => tickets.filter(ticket => {
    const text = `${ticket.title} ${ticket.desc} ${ticket.id}`.toLowerCase();
    const building = ticketBuildingId(ticket);
    return text.includes(search.toLowerCase()) && (statusFilter === 'all' || ticket.status === statusFilter) && (buildingFilter === 'all' || String(building) === buildingFilter);
  }), [tickets, search, statusFilter, buildingFilter]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setSuccess(''); setBusy(true);
    try {
      const payload: CreateTicketPayload = {
        title: title.trim(), desc: desc.trim(), bId: buildingId,
        urgency: urgency as CreateTicketPayload['urgency'], allowComments
      };
      // Extra runtime field supports a temporary demo controller accepting @Body('userId').
      // It doesn't require changing your current API helper's TypeScript signature.
      const requestBody = { ...payload, uId: demoUserId };
      await createTicket(requestBody);
      setSuccess('Ticket submitted successfully.'); setShowCreate(false);
      setTitle(''); setDesc(''); setUrgency('medium'); setAllowComments(true);
      await load();
    } catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  return <>
    <PageHeading title="Tickets" subtitle="Create, filter, and review maintenance requests." action={<Button onClick={() => setShowCreate(true)}>+ New ticket</Button>}/>
    <RequestNotice error={error} success={success} onDismiss={() => { setError(''); setSuccess(''); }}/>
    <Card className="renova-card"><Card.Body>
      <Row className="g-2 mb-3">
        <Col md={6}><Form.Control aria-label="Search tickets" placeholder="Search tickets..." value={search} onChange={event => setSearch(event.target.value)}/></Col>
        <Col sm={6} md={3}><Form.Select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} aria-label="Filter ticket status">
          <option value="all">All statuses</option><option value="pending">Pending</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="rejected">Rejected</option>
        </Form.Select></Col>
        <Col sm={6} md={3}><Form.Select value={buildingFilter} onChange={event => setBuildingFilter(event.target.value)} aria-label="Filter ticket building">
          <option value="all">All buildings</option>{buildings.map(building => <option key={building.id} value={building.id}>{building.name}</option>)}
        </Form.Select></Col>
      </Row>
      {loading ? <Loading/> : visible.length === 0 ? <Empty text="No tickets match your filters."/> :
        <div className="table-responsive"><Table hover className="align-middle mb-0 renova-table">
          <thead><tr><th>Issue</th><th>Building</th><th>Urgency</th><th>Status</th><th></th></tr></thead>
          <tbody>{visible.map(ticket => <tr key={ticket.id}>
            <td><div className="fw-semibold">{ticket.title}</div><div className="small text-secondary renova-truncate">#{ticket.id} · {ticket.desc}</div></td>
            <td>{buildings.find(b => b.id === ticketBuildingId(ticket))?.name ?? 'Not loaded'}</td>
            <td><StatusTag value={ticket.urgency} urgency/></td><td><StatusTag value={ticket.status}/></td>
            <td className="text-end"><Button size="sm" variant="outline-primary" onClick={() => onOpenTicket(ticket.id)}>Details</Button></td>
          </tr>)}</tbody>
        </Table></div>}
    </Card.Body></Card>

    <Modal show={showCreate} onHide={() => !busy && setShowCreate(false)} centered size="lg">
      <Form onSubmit={event => void submit(event)}>
        <Modal.Header closeButton><Modal.Title className="fs-5">Create maintenance ticket</Modal.Title></Modal.Header>
        <Modal.Body><Row className="g-3">
          <Col xs={12}><Form.Group><Form.Label>Title</Form.Label><Form.Control required value={title} onChange={event => setTitle(event.target.value)} placeholder="e.g. Broken elevator"/></Form.Group></Col>
          <Col xs={12}><Form.Group><Form.Label>Description</Form.Label><Form.Control required as="textarea" rows={4} value={desc} onChange={event => setDesc(event.target.value)} placeholder="Describe the issue clearly"/></Form.Group></Col>
          <Col md={7}><Form.Group><Form.Label>Building</Form.Label><Form.Select required value={buildingId || ''} onChange={event => setBuildingId(Number(event.target.value))}>
            <option value="" disabled>Select a building</option>{buildings.map(building => <option key={building.id} value={building.id}>{building.name}</option>)}
          </Form.Select></Form.Group></Col>
          <Col md={5}><Form.Group><Form.Label>Urgency</Form.Label><Form.Select value={urgency} onChange={event => setUrgency(event.target.value)}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
          </Form.Select></Form.Group></Col>
          <Col xs={12}><Form.Check type="switch" label="Allow comments on this ticket" checked={allowComments} onChange={event => setAllowComments(event.target.checked)}/></Col>
          <Col xs={12}><div className="small text-secondary">Submitting as demo user #{demoUserId || 'not selected'}.</div></Col>
        </Row></Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" disabled={busy} onClick={() => setShowCreate(false)}>Cancel</Button><Button type="submit" disabled={busy || !demoUserId || !buildingId || !title.trim() || !desc.trim()}>{busy ? 'Submitting...' : 'Create ticket'}</Button></Modal.Footer>
      </Form>
    </Modal>
  </>;
}
