import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { TicketUrgency } from "../enums/ticket-urgency.enums.ts";
import { TicketStatus } from "../enums/ticket-status.enums.ts";
import { Building } from "../../buildings/entities/building.entity.ts";
import { Comment } from "../../comments/entities/comment.entity.ts";
import { User } from "../../users/entities/user.entity.ts";

@Entity('tickets')
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
    fromUser: Relation<User>;

    @ManyToOne(()=>Building, (building)=>building.tickets)
    forBuilding: Relation<Building>;

    @OneToMany(()=>Comment, (comment)=>comment.ticket)
    comments: Relation<Comment[]>;
}
