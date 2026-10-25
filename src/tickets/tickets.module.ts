import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service.js';
import { TicketsController } from './tickets.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity.ts';
import { User } from '../users/entities/user.entity.ts';
import { Building } from '../buildings/entities/building.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, User, Building])],
  providers: [TicketsService],
  controllers: [TicketsController],
  exports: [TicketsService]
})
export class TicketsModule {}
