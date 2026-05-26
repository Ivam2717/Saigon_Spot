import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên category không được để trống' })
  @MaxLength(100)
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug không được để trống' })
  @MaxLength(100)
  slug!: string;
}