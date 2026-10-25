import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CommentsService } from './comments.service.ts';
import { Comment } from './entities/comment.entity.ts';
import { CreateCommentDto } from './dtos/create-comment.dto.ts';
import { UpdateCommentDto } from './dtos/update-comment.dto.ts';

@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @Get()
    async findAll(): Promise<Comment[]> {
        return await this.commentsService.findAll();
    }
    
    @Get('for-ticket/:id')
    async findForTicket(@Param('id', ParseIntPipe) id: number): Promise<Comment[]> {
        return await this.commentsService.findForTicket(id);
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<Comment> {
        return await this.commentsService.findById(id);
    }

    @Post()
    async create(
        @Body() createCommentDto: CreateCommentDto,
        @Body('tId', ParseIntPipe) tId: number,
        @Body('uId', ParseIntPipe) uId: number
    ): Promise<Comment> {
        return this.commentsService.create(createCommentDto, tId, uId);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateCommentDto: UpdateCommentDto): Promise<Comment> {
        return await this.commentsService.update(id, updateCommentDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.commentsService.delete(id);
    }
}
