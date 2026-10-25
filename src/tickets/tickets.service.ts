import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity.ts';
import { Not, Repository } from 'typeorm';
import { CreateTicketDto } from './dtos/create-ticket.dto.ts';
import { UpdateTicketDto } from './dtos/update-ticket.dto.ts';
import { User } from '../users/entities/user.entity.ts';
import { Building } from '../buildings/entities/building.entity.ts';
import { ExceptionHandler } from '@nestjs/core/errors/exception-handler.js';
import { uint8ArrayToHex } from 'typeorm/util/Uint8ArrayUtils.js';
import { TicketStatus } from './enums/ticket-status.enums.ts';
import { TicketUrgency } from './enums/ticket-urgency.enums.ts';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepo: Repository<Ticket>,

        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,

        @InjectRepository(Building)
        private readonly buildingRpo: Repository<Building>
    ) {}

    async findAll(): Promise<Ticket[]> {
        return await this.ticketRepo.find();
    }

    async findById(id: number): Promise<Ticket> {
        const ticket = await this.ticketRepo.findOneBy({ id })
        if (!ticket) throw new NotFoundException(`Ticket of id ${id} not found`)
        return ticket
    }

    async create(createTicketDto: CreateTicketDto, uId: number, bId: number): Promise<Ticket> {
        const user = await this.usersRepo.findOneBy({ id: uId });
        const building = await this.buildingRpo.findOneBy({ id: bId });
        
        if (!user) { throw new NotFoundException(`User ${uId} does not exist`); }
        if (!building) { throw new NotFoundException(`Building ${bId} does not exist`); }

        const ticket = this.ticketRepo.create({
            ...createTicketDto,
            fromUser: user, 
            forBuilding: building
        });
        return this.ticketRepo.save(ticket);
    }

    async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
        const ticket = await this.ticketRepo.preload({ id, ...updateTicketDto })
        if (!ticket) throw new NotFoundException(`Ticket of id ${id} not found`);
        return this.ticketRepo.save(ticket);
    }

    async delete(id: number): Promise<void> {
        const result = await this.ticketRepo.delete(id);
        if (result.affected === 0) throw new NotFoundException(`Ticket of id ${id} not found`)
    }

    // logic
    async changeTicketProperty(
        id: number, 
        options: {
            status?:TicketStatus, 
            allowComments?:boolean, 
            urgency?:TicketUrgency
        }): Promise<Ticket> {
        const ticket = await this.ticketRepo.findOneBy({ id });
        if (!ticket) { throw new NotFoundException(`Ticket ${id} does not exist`); }
        
        Object.assign(ticket, options)

        return this.ticketRepo.save(ticket);
    }
}
