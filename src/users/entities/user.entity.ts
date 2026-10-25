import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { UserType } from "../enums/user-type.enum.ts";
import { Comment } from "../../comments/entities/comment.entity.ts";
import { Building } from "../../buildings/entities/building.entity.ts";
import { Ticket } from "../../tickets/entities/ticket.entity.ts";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.USER
    })
    type: UserType;

    // relations
    @ManyToMany( ()=>Building, (building)=>building.members)
    @JoinTable({ name: "building_members" })
    in: Relation<Building[]>;

    @OneToMany(()=>Ticket, (ticket)=>ticket.fromUser)
    tickets: Relation<Ticket[]>;
    
    @OneToMany(()=>Comment, (comment)=>comment.fromUser)
    comments: Relation<Comment[]>;
}
