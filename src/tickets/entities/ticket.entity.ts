import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TicketUrgency } from "../enums/ticket-urgency.enums.ts";
import { TicketStatus } from "../enums/ticket-status.enums.ts";
import { Building } from "../../building/entities/building.entity.ts";
import { Comment } from "../../comments/entities/comment.entity.ts";
import { User } from "../../users/entities/user.entity.ts";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    desc: string;

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

    @Column({ default: true })
    allowComments: boolean;

    // relations
    @ManyToOne(()=>User, (user)=>user.tickets)
    fromUser: User;

    @ManyToOne(()=>Building, (building)=>building.tickets)
    forBuilding: Building;

    @OneToMany(()=>Comment, (comment)=>comment.ticket)
    comments: Comment[];
}
