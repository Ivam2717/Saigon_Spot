import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceImage } from './entities/place-image.entity';
import { Place } from '../places/entities/place.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary\'.module';
import { PlaceImagesService } from './place-images.service';
import { PlaceImagesController } from './place-images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceImage,Place]),CloudinaryModule],
  controllers: [PlaceImagesController],
  providers: [PlaceImagesService],
})
export class PlaceImagesModule {}