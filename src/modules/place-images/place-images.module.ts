import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaceImage } from './entities/place-image.entity';
import { PlaceImagesService } from './place-images.service';
import { PlaceImagesController } from './place-images.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlaceImage])],
  controllers: [PlaceImagesController],
  providers: [PlaceImagesService],
  exports: [TypeOrmModule],
})
export class PlaceImagesModule {}