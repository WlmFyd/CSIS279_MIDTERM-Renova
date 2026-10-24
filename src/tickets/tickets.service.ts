import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity.ts';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dtos/create-ticket.dto.ts';
import { UpdateTicketDto } from './dtos/update-ticket.dto.ts';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private readonly ticketRepo: Repository<Ticket>
    ) {}

    async findAll(): Promise<Ticket[]> {
        return await this.ticketRepo.find();
    }

    async findById(id: number): Promise<Ticket> {
        const ticket = await this.ticketRepo.findOneBy({ id })
        if (!ticket) throw new NotFoundException(`Ticket of id ${id} not found`)
        return ticket
    }

    async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
        const ticket = this.ticketRepo.create(createTicketDto);
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
}
