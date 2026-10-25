import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, type Relation } from "typeorm";
import { BuildingType } from "../enums/building-type.enum.ts";
import { User } from "../../users/entities/user.entity.ts";
import { Ticket } from "../../tickets/entities/ticket.entity.ts";

@Entity('buildings')
export class Building {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: BuildingType,
        default: BuildingType.RESIDENTIAL
    })
    type: BuildingType;
    
    // relations
    @ManyToMany(()=>User, (user)=>user.in)
    members: Relation<User[]>;

    @ManyToMany(()=>User)
    @JoinTable({ name: "building_managers" })
    managers: Relation<User[]>;

    @OneToMany(()=>Ticket, (ticket)=>ticket.forBuilding)
    tickets: Relation<Ticket[]>;
}
