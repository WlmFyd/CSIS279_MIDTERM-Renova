import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity.ts';
import { Comment } from '../comments/entities/comment.entity.ts';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService]
})
export class UsersModule {}
