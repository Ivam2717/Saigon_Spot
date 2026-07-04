import { IsString,IsNotEmpty,MaxLength } from "class-validator";
export class CreateTagDto{
    @IsString()
    @IsNotEmpty({message: 'Tên tag không được để trống'})
    @MaxLength(100)
    name!: string;
}