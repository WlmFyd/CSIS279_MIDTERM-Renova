import { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { getUsers } from '../apis/users';
import type { User } from '../types/models';
import DashboardPage from '../pages/Dashboard.tsx';
import BuildingsPage from '../pages/Buildings.tsx';
import TicketsPage from '../pages/Tickets.tsx';
import TicketDetailsPage from '../pages/TicketDetails.tsx';
import UsersPage from '../pages/Users.tsx';
import { apiError } from './renova-ui';
import '../styles/renova.css';

type Page = 'dashboard' | 'buildings' | 'tickets' | 'users' | 'ticketDetails';

/** Drop <RenovaShell /> into your existing App.tsx. No router needed. */
export default function RenovaShell() {
  const [page, setPage] = useState<Page>('dashboard');
  const [ticketId, setTicketId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [demoUserId, setDemoUserId] = useState<number>(0);
  const [userError, setUserError] = useState('');

  const refreshUsers = useCallback(async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
      setDemoUserId(current => response.data.some(user => user.id === current) ? current : (response.data[0]?.id ?? 0));
      setUserError('');
    } catch (error) { setUserError(apiError(error)); }
  }, []);

  useEffect(() => { void refreshUsers(); }, [refreshUsers]);

  function openTicket(id: number) { setTicketId(id); setPage('ticketDetails'); }
  const navItems: { key: Exclude<Page, 'ticketDetails'>; label: string }[] = [
    { key: 'dashboard', label: 'Overview' }, { key: 'buildings', label: 'Buildings' },
    { key: 'tickets', label: 'Tickets' }, { key: 'users', label: 'Users' }
  ];

  return <div className="renova-app">
    <Container fluid className="px-0">
      <Row className="g-0 min-vh-100">
        <Col lg="auto" className="renova-sidebar p-3">
          <div className="renova-brand mb-4"><span className="renova-brand-mark">R</span><span>Renova<small>Maintenance workspace</small></span></div>
          <nav className="d-flex flex-row flex-lg-column gap-1 flex-wrap" aria-label="Main navigation">
            {navItems.map(item => <button key={item.key} type="button" className={`renova-nav-item ${page === item.key || (page === 'ticketDetails' && item.key === 'tickets') ? 'active' : ''}`} onClick={() => setPage(item.key)}>{item.label}</button>)}
          </nav>
        </Col>
        <Col className="min-width-0">
          <header className="renova-topbar d-flex flex-wrap align-items-center justify-content-between gap-2 px-4 py-3">
            <div className="fw-semibold">Maintenance management</div>
            <div className="d-flex align-items-center gap-2">
              <Form.Label className="small text-secondary mb-0" htmlFor="renova-demo-user">Acting as</Form.Label>
              <Form.Select id="renova-demo-user" size="sm" aria-label="Demo user" value={demoUserId} onChange={event => setDemoUserId(Number(event.target.value))} style={{ maxWidth: 225 }}>
                {users.length === 0 ? <option value={0}>No users</option> : users.map(user => <option key={user.id} value={user.id}>{user.name} (#{user.id})</option>)}
              </Form.Select>
              <Button size="sm" variant="outline-secondary" onClick={() => void refreshUsers()} title="Refresh users">↻</Button>
            </div>
          </header>
          <main className="renova-main p-3 p-md-4">
            {userError && <Alert variant="warning">Unable to load demo users: {userError}</Alert>}
            {page === 'dashboard' && <DashboardPage onNavigate={setPage} onOpenTicket={openTicket}/>}
            {page === 'buildings' && <BuildingsPage demoUserId={demoUserId}/>}
            {page === 'tickets' && <TicketsPage demoUserId={demoUserId} onOpenTicket={openTicket}/>}
            {page === 'users' && <UsersPage onUsersChanged={refreshUsers}/>}
            {page === 'ticketDetails' && ticketId !== null && <TicketDetailsPage ticketId={ticketId} demoUserId={demoUserId} onBack={() => setPage('tickets')} onDeleted={() => setPage('tickets')}/>}
          </main>
        </Col>
      </Row>
    </Container>
  </div>;
}
