import {
  IsString, IsNotEmpty, IsOptional, IsBoolean,
  IsInt, IsNumber, MaxLength, ValidateNested, IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO con cho location (GeoJSON Point)
class GeoPointDto {
  @IsString()
  @IsIn(['Point'])
  type!: 'Point';

  // [longitude, latitude] – đúng chuẩn GeoJSON
  @IsNumber({}, { each: true })
  coordinates!: [number, number];
}

export class CreatePlaceDto {
  @IsString()
  @IsNotEmpty({ message: 'Tên địa điểm không được để trống' })
  @MaxLength(255)
  name!: string;

  @IsString()
  @IsNotEmpty({ message: 'Slug không được để trống' })
  @MaxLength(255)
  slug!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ không được để trống' })
  @MaxLength(255)
  address!: string;

  @IsString()
  @IsNotEmpty({ message: 'Quận/huyện không được để trống' })
  @MaxLength(100)
  district!: string;

  // location optional – gửi dạng GeoJSON Point
  @IsOptional()
  @ValidateNested()
  @Type(() => GeoPointDto)
  location!: GeoPointDto;

  @IsOptional()
  @IsString()
  coverUrl!: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous!: boolean;

  // categoryId là số nguyên, optional
  @IsOptional()
  @IsInt({ message: 'categoryId phải là số nguyên' })
  categoryId!: number;  
}