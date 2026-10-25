import { PartialType } from "@nestjs/mapped-types";
import { CreateBuildingDto } from "./create-building.dto.ts";

export class UpdateBuildingDto extends PartialType(CreateBuildingDto) {}
