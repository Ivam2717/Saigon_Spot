import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { Category } from './modules/categories/entities/category.entity';
import { Tag } from './modules/tags/entities/tag.entity';
import { Place } from './modules/places/entities/place.entity';
import { Review } from './modules/reviews/entities/review.entity';
import { PlaceImage } from './modules/place-images/entities/place-image.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { PlacesModule } from './modules/places/places.module';
import { PlaceImagesModule } from './modules/place-images/place-images.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { TagsModule } from './modules/tags/tags.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Cực kỳ quan trọng, cho phép dùng biến env toàn cục
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Category, Tag, Place, Review, PlaceImage],
        synchronize: true, // Chỉ để true khi dev
      }),
    }),
    CategoriesModule,
    PlacesModule,
    PlaceImagesModule,
    ReviewsModule,
    TagsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}