import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Place } from '../places/entities/place.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Place])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService], 
})
export class ReviewsModule {}