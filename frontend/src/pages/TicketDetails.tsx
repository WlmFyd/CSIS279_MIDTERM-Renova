import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { getCommentsFromTicket, createComment, updateComment, deleteComment } from '../apis/comments';
import { changeTicketProperty, deleteTicket, getTicketById } from '../apis/tickets';
import type { Comment, Ticket } from '../types/models';
import { apiError, ConfirmDialog, Empty, Loading, PageHeading, RequestNotice, StatusTag, ticketAuthorName } from '../components/renova-ui';

// function commentAuthor(comment: Comment): string {
//   const c = comment as Comment & { fromUser?: unknown; fromUserId?: number };
//   const author = c.fromUser;
//   if (author !== null && typeof author === 'object' && 'name' in author && typeof author.name === 'string') return author.name;
//   return `User #${relationId(author) ?? c.fromUserId ?? '?'}`;
// }

function commentAuthor(comment: Comment): string {
    return comment.fromUser?.name ?? "Unknown User";
}

export default function TicketDetailsPage({ ticketId, demoUserId, onBack, onDeleted }: {
  ticketId: number; demoUserId: number; onBack: () => void; onDeleted: () => void;
}) {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [text, setText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [deleteCommentId, setDeleteCommentId] = useState<number | null>(null);
  const [showDeleteTicket, setShowDeleteTicket] = useState(false);

  const load = useCallback(async () => {
    try {
      const [t, c] = await Promise.all([getTicketById(ticketId), getCommentsFromTicket(ticketId)]);
      setTicket(t.data); setComments(c.data); setError('');
    } catch (err) { setError(apiError(err)); }
    finally { setLoading(false); }
  }, [ticketId]);
  useEffect(() => { void load(); }, [load]);

  async function changeProperty(data: { status?: Ticket['status']; urgency?: Ticket['urgency']; allowComments?: boolean }) {
    setBusy(true); 
    setError(''); 
    setSuccess('');
    try { await changeTicketProperty(ticketId, data); await load(); setSuccess('Ticket updated.'); }
    catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); 
    if (!text.trim()) return;
    setBusy(true); 
    setError(''); 
    setSuccess('');
    try { await createComment({ text: text.trim(), tId: ticketId }, demoUserId); setText(''); await load(); setSuccess('Comment posted.'); }
    catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  async function saveComment(id: number) {
    setBusy(true); setError(''); setSuccess('');
    try { await updateComment(id, { text: editingText.trim() }); setEditingCommentId(null); await load(); setSuccess('Comment updated.'); }
    catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  async function confirmDeleteComment() {
    if (deleteCommentId === null) return;
    setBusy(true); 
    setError(''); 
    setSuccess('');
    try { await deleteComment(deleteCommentId); setDeleteCommentId(null); await load(); setSuccess('Comment deleted.'); }
    catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  async function confirmDeleteTicket() {
    setBusy(true); 
    setError('');
    try { await deleteTicket(ticketId); setShowDeleteTicket(false); onDeleted(); }
    catch (err) { setError(apiError(err)); }
    finally { setBusy(false); }
  }

  if (loading) return <Loading/>;
  if (!ticket) return <><Button variant="link" onClick={onBack}>← Back to tickets</Button><RequestNotice error={error || 'Ticket not found.'}/></>;

  return <>
    <Button variant="link" className="ps-0 mb-2" onClick={onBack}>← Back to tickets</Button>
    <PageHeading title={ticket.title} subtitle={`Ticket #${ticket.id} · Submitted by ${ticketAuthorName(ticket)}`} action={<Button variant="outline-danger" onClick={() => setShowDeleteTicket(true)}>Delete ticket</Button>}/>
    <RequestNotice error={error} success={success} onDismiss={() => { setError(''); setSuccess(''); }}/>
    <Row className="g-3">
      <Col lg={8}>
        <Card className="renova-card mb-3"><Card.Body>
          <h3 className="h6 fw-bold mb-3">Description</h3><p className="renova-description mb-0">{ticket.desc}</p>
        </Card.Body></Card>
        <Card className="renova-card"><Card.Header className="bg-white fw-semibold">Comments ({comments.length})</Card.Header>
          <Card.Body>
            {comments.length === 0 ? <Empty text="No comments yet."/> : <Stack gap={3} className="mb-4">
              {comments.map(comment => <div className="renova-comment" key={comment.id}>
                <div className="d-flex justify-content-between align-items-center gap-2 mb-2"><strong className="small">{commentAuthor(comment)}</strong><small className="text-secondary">#{comment.id}</small></div>
                {editingCommentId === comment.id ? <>
                  <Form.Control as="textarea" rows={2} value={editingText} onChange={event => setEditingText(event.target.value)}/>
                  <div className="mt-2 d-flex gap-2"><Button size="sm" disabled={busy || editingText.trim().length < 5} onClick={() => void saveComment(comment.id)}>Save</Button><Button size="sm" variant="outline-secondary" onClick={() => setEditingCommentId(null)}>Cancel</Button></div>
                </> : <><p className="mb-2 renova-description">{comment.text}</p><div className="d-flex gap-2">
                  <Button size="sm" variant="link" className="p-0" onClick={() => { setEditingCommentId(comment.id); setEditingText(comment.text); }}>Edit</Button>
                  <Button size="sm" variant="link" className="p-0 text-danger" onClick={() => setDeleteCommentId(comment.id)}>Delete</Button>
                </div></>}
              </div>)}
            </Stack>}
            {ticket.allowComments ? <Form onSubmit={event => void submitComment(event)}>
              <Form.Label className="fw-semibold small">Add a comment</Form.Label>
              <Form.Control as="textarea" rows={3} minLength={5} required value={text} onChange={event => setText(event.target.value)} placeholder="Write an update..."/>
              <Button className="mt-2" type="submit" disabled={busy || !demoUserId || text.trim().length < 5}>{busy ? 'Posting...' : 'Post comment'}</Button>
            </Form> : <p className="text-secondary small mb-0">Comments are disabled on this ticket.</p>}
          </Card.Body>
        </Card>
      </Col>
      <Col lg={4}>
        <Card className="renova-card"><Card.Body>
          <h3 className="h6 fw-bold mb-3">Ticket controls</h3>
          <div className="mb-3"><div className="small text-secondary mb-2">Current status <StatusTag value={ticket.status}/></div>
            <Form.Select aria-label="Change ticket status" value={ticket.status} disabled={busy} onChange={event => void changeProperty({ status: event.target.value as Ticket['status'] })}>
              <option value="pending">Pending</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option><option value="rejected">Rejected</option>
            </Form.Select></div>
          <div className="mb-3"><div className="small text-secondary mb-2">Urgency <StatusTag value={ticket.urgency} urgency/></div>
            <Form.Select aria-label="Change ticket urgency" value={ticket.urgency} disabled={busy} onChange={event => void changeProperty({ urgency: event.target.value as Ticket['urgency'] })}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </Form.Select></div>
          <Form.Check type="switch" label="Allow comments" disabled={busy} checked={ticket.allowComments} onChange={event => void changeProperty({ allowComments: event.target.checked })}/>
          <div className="small text-secondary mt-3">Demo mode: manager/admin permissions are not enforced in this UI.</div>
        </Card.Body></Card>
      </Col>
    </Row>
    <ConfirmDialog show={deleteCommentId !== null} title="Delete comment?" message="This comment will be permanently deleted." busy={busy} onCancel={() => setDeleteCommentId(null)} onConfirm={() => void confirmDeleteComment()}/>
    <ConfirmDialog show={showDeleteTicket} title="Delete ticket?" message="This will permanently delete the ticket (subject to backend relationship rules)." busy={busy} onCancel={() => setShowDeleteTicket(false)} onConfirm={() => void confirmDeleteTicket()}/>
  </>;
}
