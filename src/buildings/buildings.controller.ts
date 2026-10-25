import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { BuildingsService } from './buildings.service.ts';
import { Building } from './entities/building.entity.ts';
import { CreateBuildingDto } from './dtos/create-building.dto.ts';
import { UpdateBuildingDto } from './dtos/update-building.dto.ts';

@Controller('buildings')
export class BuildingsController {
    constructor(private readonly buildingsService: BuildingsService) {}

    @Get()
    async findAll(): Promise<Building[]> {
        return await this.buildingsService.findAll();
    }

    @Get(':id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<Building> {
        return await this.buildingsService.findById(id);
    }

    @Post()
    async create(@Body() createBuildingDto: CreateBuildingDto): Promise<Building> {
        return this.buildingsService.create(createBuildingDto);
    }

    @Put(':id')
    async update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateBuildingDto: UpdateBuildingDto
    ): Promise<Building> {
        return await this.buildingsService.update(id, updateBuildingDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return await this.buildingsService.delete(id);
    }
}
