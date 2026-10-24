import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BuildingType } from "../enums/building-type.enum.ts";

export class CreateBuildingDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsEnum(BuildingType)
    type: BuildingType;
}
