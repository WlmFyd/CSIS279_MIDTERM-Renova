import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TicketUrgency } from "../enums/ticket-urgency.enums.ts";
import { TicketStatus } from "../enums/ticket-status.enums.ts";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({
        type: 'enum',
        enum: TicketUrgency,
        default: TicketUrgency.MEDIUM
     })
    urgency: TicketUrgency;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.PENDING
    })
    status: TicketStatus;
}
