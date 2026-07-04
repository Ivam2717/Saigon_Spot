import { IsArray,IsNotEmpty,ArrayNotEmpty,IsInt } from "class-validator";
import { Type } from "class-transformer";
export class ManagePlaceTagsDto{
    @IsArray()
    @ArrayNotEmpty({message: 'Danh sách tagIds không được rông'})
    @IsInt({ each: true, message: 'Mỗi tagId phải là số nguyên'})
    @Type(()=> Number)
    tagIds!: number[];
}