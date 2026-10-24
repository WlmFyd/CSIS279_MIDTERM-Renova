import { Controller } from '@nestjs/common';
import { BuildingService } from './building.service.ts';
import { Building } from './entities/building.entity.ts';
import { CreateBuildingDto } from './dtos/create-building.dto.ts';
import { UpdateBuildingDto } from './dtos/update-building.dto.ts';

@Controller('building')
export class BuildingController {
    constructor(private readonly buildingsService: BuildingService) {}

    async findAll(): Promise<Building[]> {
        return await this.buildingsService.findAll();
    }

    async findById(id: number): Promise<Building> {
        return await this.buildingsService.findById(id);
    }

    async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
        return this.buildingsService.create(createBuildingDto);
    }

    async update(id: number, updateBuildingDto: UpdateBuildingDto): Promise<Building> {
        return await this.buildingsService.update(id, updateBuildingDto);
    }

    async delete(id: number): Promise<void> {
        return await this.buildingsService.delete(id);
    }
}
