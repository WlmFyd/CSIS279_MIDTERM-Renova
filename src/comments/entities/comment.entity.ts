import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "../../tickets/entities/ticket.entity.ts";
import { User } from "../../users/entities/user.entity.ts";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    text: string;

    // relations
    @ManyToOne(()=>User, (user)=>user.comments)
    fromUser: User;

    @ManyToOne(()=>Ticket, (ticket)=>ticket.comments)
    ticket: Ticket;
}
