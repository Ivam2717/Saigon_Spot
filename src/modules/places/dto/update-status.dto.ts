import { IsEnum } from "class-validator";
import { PlaceStatus } from "../entities/place.entity";
export class UpdateStatusDto{ 
    @IsEnum(PlaceStatus,{
        message:'Status phải là pending, approved hoặc rejected',
    })
    status!: PlaceStatus;
}