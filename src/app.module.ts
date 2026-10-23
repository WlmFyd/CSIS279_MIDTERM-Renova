import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TicketsModule } from './tickets/tickets.module.js';
import { UsersModule } from './users/users.module.js';
import { BuildingModule } from './building/building.module.js';
import { CommentsModule } from './comments/comments.module.js';

@Module({
  imports: [TicketsModule, UsersModule, BuildingModule, CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
