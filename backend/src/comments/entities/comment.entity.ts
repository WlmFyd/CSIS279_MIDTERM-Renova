import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { Ticket } from "../../tickets/entities/ticket.entity.ts";
import { User } from "../../users/entities/user.entity.ts";

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    text: string;

    // relations
    @ManyToOne(()=>User, (user)=>user.comments)
    fromUser: Relation<User>;

    @ManyToOne(()=>Ticket, (ticket)=>ticket.comments)
    ticket: Relation<Ticket>;
}
