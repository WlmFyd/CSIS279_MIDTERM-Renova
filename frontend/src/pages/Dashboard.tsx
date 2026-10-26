import { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Table } from 'react-bootstrap';
import { getBuildings } from '../apis/buildings';
import { getTickets } from '../apis/tickets';
import { getUsers } from '../apis/users';
import type { Building, Ticket, User } from '../types/models';
import { apiError, Empty, Loading, PageHeading, RequestNotice, StatusTag, ticketBuildingId } from '../components/renova-ui';

type NextPage = 'dashboard' | 'buildings' | 'tickets' | 'users' | 'ticketDetails';

export default function DashboardPage({ onNavigate, onOpenTicket }: { onNavigate: (page: NextPage) => void; onOpenTicket: (id: number) => void }) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([getBuildings(), getTickets(), getUsers()])
      .then(([b, t, u]) => { if (!cancelled) { setBuildings(b.data); setTickets(t.data); setUsers(u.data); } })
      .catch(err => { if (!cancelled) setError(apiError(err)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const openTickets = tickets.filter(ticket => ticket.status !== 'resolved' && ticket.status !== 'rejected').length;
  const resolved = tickets.filter(ticket => ticket.status === 'resolved').length;
  const stats = [
    { label: 'Buildings', value: buildings.length, link: 'buildings' as const },
    { label: 'Open tickets', value: openTickets, link: 'tickets' as const },
    { label: 'Resolved tickets', value: resolved, link: 'tickets' as const },
    { label: 'Users', value: users.length, link: 'users' as const }
  ];
  const recent = [...tickets].sort((a, b) => b.id - a.id).slice(0, 5);

  return <>
    <PageHeading title="Overview" subtitle="A quick look at your buildings and maintenance requests." action={<Button onClick={() => onNavigate('tickets')}>View tickets</Button>}/>
    <RequestNotice error={error}/>
    {loading ? <Loading/> : <>
      <Row className="g-3 mb-4">{stats.map(stat => <Col key={stat.label} sm={6} xl={3}>
        <Card className="renova-card h-100 renova-stat" role="button" onClick={() => onNavigate(stat.link)}>
          <Card.Body>
            <div className="small text-secondary mb-2">{stat.label}</div>
            <div className="display-6 fw-semibold">{stat.value}</div>
          </Card.Body>
        </Card>
      </Col>)}</Row>
      <Card className="renova-card">
        <Card.Header className="bg-white d-flex align-items-center justify-content-between"><strong>Recent tickets</strong><Button variant="link" size="sm" onClick={() => onNavigate('tickets')}>View all</Button></Card.Header>
        <Card.Body className="p-0">
          {recent.length === 0 ? <Empty text="No maintenance requests yet."/> : <div className="table-responsive"><Table hover className="mb-0 align-middle renova-table">
            <thead><tr><th>Ticket</th><th>Building</th><th>Urgency</th><th>Status</th><th></th></tr></thead>
            <tbody>{recent.map(ticket => <tr key={ticket.id}>
              <td><div className="fw-semibold">{ticket.title}</div><small className="text-secondary">#{ticket.id}</small></td>
              <td className="text-secondary">{buildings.find(b => b.id === ticketBuildingId(ticket))?.name ?? '—'}</td>
              <td><StatusTag value={ticket.urgency} urgency/></td>
              <td><StatusTag value={ticket.status}/></td>
              <td className="text-end"><Button size="sm" variant="outline-primary" onClick={() => onOpenTicket(ticket.id)}>Open</Button></td>
            </tr>)}</tbody>
          </Table></div>}
        </Card.Body>
      </Card>
    </>}
  </>;
}
