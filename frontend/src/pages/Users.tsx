import { useCallback, useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card, Col, Form, Modal, Row, Table } from 'react-bootstrap';
import { createUser, deleteUser, getUsers, updateUser } from '../apis/users';
import type { User } from '../types/models';
import type { CreateUserPayload, UpdateUserPayload } from '../types/payloads';
import { apiError, ConfirmDialog, displayLabel, Empty, Loading, PageHeading, RequestNotice } from '../components/renova-ui';

export default function UsersPage({ onUsersChanged }: { onUsersChanged: () => Promise<void> }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const load = useCallback(async () => {
    try { setUsers((await getUsers()).data); setError(''); }
    catch (err) { setError(apiError(err)); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const visible = useMemo(() => users.filter(user => `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())), [users, search]);

  function openCreate() { setEditing(null); setName(''); setEmail(''); setPassword(''); setShowForm(true); }
  function openEdit(user: User) { setEditing(user.id); setName(user.name); setEmail(user.email); setPassword(''); setShowForm(true); }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setSuccess('');
    try {
      if (editing === null) {
        const data: CreateUserPayload = { name: name.trim(), email: email.trim(), password };
        await createUser(data);
      } else {
        const data: UpdateUserPayload = { name: name.trim(), email: email.trim() };
        if (password) data.password = password;
        await updateUser(editing, data);
      }
      setShowForm(false); setSuccess(editing === null ? 'User created.' : 'User updated.');
      await load(); await onUsersChanged();
    } catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusy(true); setError(''); setSuccess('');
    try { await deleteUser(toDelete.id); setToDelete(null); setSuccess('User deleted.'); await load(); await onUsersChanged(); }
    catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  return <>
    <PageHeading title="Users" subtitle="Manage accounts used by the maintenance platform." action={<Button onClick={openCreate}>+ New user</Button>}/>
    <RequestNotice error={error} success={success} onDismiss={() => { setError(''); setSuccess(''); }}/>
    <Card className="renova-card"><Card.Body>
      <Form.Control className="mb-3" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search users..." aria-label="Search users"/>
      {loading ? <Loading/> : visible.length === 0 ? <Empty text="No users found."/> : <div className="table-responsive">
        <Table hover className="align-middle mb-0 renova-table"><thead><tr><th>Name</th><th>Email</th><th>Type</th><th className="text-end">Actions</th></tr></thead>
          <tbody>{visible.map(user => <tr key={user.id}>
            <td><div className="fw-semibold">{user.name}</div><small className="text-secondary">#{user.id}</small></td>
            <td>{user.email}</td><td>{displayLabel(user.type)}</td>
            <td className="text-end text-nowrap"><Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEdit(user)}>Edit</Button><Button size="sm" variant="outline-danger" onClick={() => setToDelete(user)}>Delete</Button></td>
          </tr>)}</tbody>
        </Table></div>}
    </Card.Body></Card>

    <Modal show={showForm} onHide={() => !busy && setShowForm(false)} centered>
      <Form onSubmit={event => void submit(event)}>
        <Modal.Header closeButton><Modal.Title className="fs-5">{editing === null ? 'Create user' : 'Edit user'}</Modal.Title></Modal.Header>
        <Modal.Body><Row className="g-3">
          <Col xs={12}><Form.Group><Form.Label>Name</Form.Label><Form.Control minLength={3} required value={name} onChange={event => setName(event.target.value)}/></Form.Group></Col>
          <Col xs={12}><Form.Group><Form.Label>Email</Form.Label><Form.Control required type="email" value={email} onChange={event => setEmail(event.target.value)}/></Form.Group></Col>
          <Col xs={12}><Form.Group><Form.Label>{editing === null ? 'Password' : 'New password (optional)'}</Form.Label><Form.Control type="password" minLength={8} required={editing === null} value={password} onChange={event => setPassword(event.target.value)}/></Form.Group></Col>
        </Row></Modal.Body>
        <Modal.Footer><Button variant="outline-secondary" disabled={busy} onClick={() => setShowForm(false)}>Cancel</Button><Button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save user'}</Button></Modal.Footer>
      </Form>
    </Modal>
    <ConfirmDialog show={toDelete !== null} title="Delete user?" message={`Delete ${toDelete?.name ?? 'this user'}? Related tickets or comments may prevent deletion.`} busy={busy} onCancel={() => setToDelete(null)} onConfirm={() => void confirmDelete()}/>
  </>;
}
