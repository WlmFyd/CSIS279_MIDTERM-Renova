import type { ReactNode } from 'react';
import axios from 'axios';
import { Alert, Badge, Button, Modal, Spinner } from 'react-bootstrap';
import type { Ticket } from '../types/models';

export function apiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message: unknown = error.response?.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');
    return error.message;
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred.';
}

export function displayLabel(value: unknown): string {
  return String(value ?? 'Unknown').replaceAll('_', ' ').replace(/\b\w/g, char => char.toUpperCase());
}

export function relationId(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (value !== null && typeof value === 'object' && 'id' in value && typeof value.id === 'number') return value.id;
  return undefined;
}

export function ticketBuildingId(ticket: Ticket): number | undefined {
  const t = ticket as Ticket & { forBuilding?: unknown; forBuildingId?: number; buildingId?: number };
  return relationId(t.forBuilding) ?? t.forBuildingId ?? t.buildingId;
}

export function ticketAuthorName(ticket: Ticket): string {
  const t = ticket as Ticket & { fromUser?: unknown; fromUserId?: number };
  const author = t.fromUser;
  if (author !== null && typeof author === 'object' && 'name' in author && typeof author.name === 'string') return author.name;
  const id = relationId(author) ?? t.fromUserId;
  return id ? `User #${id}` : 'Not loaded';
}

export function PageHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
    <div><h2 className="h3 fw-bold mb-1">{title}</h2><p className="text-secondary mb-0">{subtitle}</p></div>
    {action}
  </div>;
}

export function RequestNotice({ error, success, onDismiss }: { error?: string; success?: string; onDismiss?: () => void }) {
  return <>
    {error && <Alert variant="danger" dismissible={!!onDismiss} onClose={onDismiss}>{error}</Alert>}
    {success && <Alert variant="success" dismissible={!!onDismiss} onClose={onDismiss}>{success}</Alert>}
  </>;
}

export function Loading() {
  return <div className="py-5 text-center text-secondary"><Spinner animation="border" size="sm" className="me-2"/>Loading...</div>;
}

export function Empty({ text }: { text: string }) {
  return <div className="text-secondary text-center py-5">{text}</div>;
}

export function StatusTag({ value, urgency = false }: { value: string; urgency?: boolean }) {
  const v = value.toLowerCase();
  const color = urgency
    ? ({ low: 'secondary', medium: 'info', high: 'warning', critical: 'danger' } as Record<string, string>)[v] ?? 'secondary'
    : ({ pending: 'warning', in_progress: 'primary', resolved: 'success', rejected: 'secondary' } as Record<string, string>)[v] ?? 'secondary';
  return <Badge bg={color} className="fw-medium py-2 px-2">{displayLabel(value)}</Badge>;
}

export function ConfirmDialog({ show, title, message, busy, onCancel, onConfirm }: {
  show: boolean; title: string; message: string; busy: boolean; onCancel: () => void; onConfirm: () => void;
}) {
  return <Modal show={show} onHide={onCancel} centered>
    <Modal.Header closeButton><Modal.Title className="fs-5">{title}</Modal.Title></Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="outline-secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
      <Button variant="danger" onClick={onConfirm} disabled={busy}>{busy ? 'Working...' : 'Delete'}</Button>
    </Modal.Footer>
  </Modal>;
}
