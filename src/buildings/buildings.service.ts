import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity.ts';
import { Repository } from 'typeorm';
import { CreateBuildingDto } from './dtos/create-building.dto.ts';
import { UpdateBuildingDto } from './dtos/update-building.dto.ts';

@Injectable()
export class BuildingsService {
    constructor(
        @InjectRepository(Building)
        private readonly buildingRepo: Repository<Building>
    ) {}

    async findAll(): Promise<Building[]> {
        return await this.buildingRepo.find();
    }

    async findById(id: number): Promise<Building> {
        const building = await this.buildingRepo.findOneBy({ id });
        if (!building) throw new NotFoundException(`Building of id ${id} not found`);
        return building;
    }

    async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
        const building = this.buildingRepo.create(createBuildingDto);
        return this.buildingRepo.save(building);
    }

    async update(id: number, updateBuildingDto: UpdateBuildingDto): Promise<Building> {
        const building = await this.buildingRepo.preload({ id, ...updateBuildingDto });
        if (!building) throw new NotFoundException(`Building of id ${id} not found`);
        return this.buildingRepo.save(building);
    }

    async delete(id: number): Promise<void> {
        const result = await this.buildingRepo.delete(id);
        if (result.affected===0) throw new NotFoundException(`Building of id ${id} not found`);
    }
}
