import { Controller } from '@nestjs/common';
import { TicketsService } from './tickets.service.ts';
import { Ticket } from './entities/ticket.entity.ts';
import { CreateTicketDto } from './dtos/create-ticket.dto.ts';
import { UpdateTicketDto } from './dtos/update-ticket.dto.ts';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}
    
    async findAll(): Promise<Ticket[]> {
        return await this.ticketsService.findAll();
    }

    async findById(id: number): Promise<Ticket> {
        return await this.ticketsService.findById(id);
    }

    async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
        return this.ticketsService.create(createTicketDto);
    }

    async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
        return await this.ticketsService.update(id, updateTicketDto);
    }

    async delete(id: number): Promise<void> {
        return await this.ticketsService.delete(id)
    }
}
