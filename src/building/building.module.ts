import { Module } from '@nestjs/common';
import { BuildingService } from './building.service.js';
import { BuildingController } from './building.controller.js';

@Module({
  providers: [BuildingService],
  controllers: [BuildingController]
})
export class BuildingModule {}
