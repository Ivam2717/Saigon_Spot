import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Place } from '../places/entities/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tag,Place])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TypeOrmModule], 
})
export class TagsModule {}