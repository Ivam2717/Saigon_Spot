import { Injectable, ConflictException, ForbiddenException,NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from "./entities/review.entity";
import { Place } from "../places/entities/place.entity";
import { User } from "../users/entities/user.entity";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
@Injectable()
export class ReviewsService{
    constructor(
        @InjectRepository(Review)
        private reviewRepo: Repository<Review>,

        @InjectRepository(Place)
        private placeRepo: Repository<Place>
    ) {}

    async findByPlace(placeId: string): Promise<Review[]>{
        const place = await this.placeRepo.findOne({where: {id: placeId}});
        if(!place){
            throw new NotFoundException (`Place #${placeId} không tồn tại`)
        }
        return this.reviewRepo.find({
            where:{place:{id:placeId}},
            relations:['user'],
            select:{
                id:true,
                rating:true,
                comment:true,
                isAnonymous:true,
                createdAt:true,
                user:{
                    id: true,
                    fullName: true,
                    avatarUrl:true
                },
            },
            order:{createdAt: 'DESC'}
        });
    }
    async create(
        placeId: string,
        dto: CreateReviewDto,
        userId: string
    ):Promise<Review>{
        const place = await this.placeRepo.findOne({where:{id:placeId}})
        if(!place){
            throw new NotFoundException(`Place #${placeId} không tồn tại`)
        }
        const existing = await this.reviewRepo
            .createQueryBuilder('review')
            .where('review.place_id = :placeId', { placeId })
            .andWhere('review.user_id = :userId', { userId })
            .getOne();

        if (existing) {
        throw new ConflictException('Bạn đã review địa điểm này rồi');
        }
        const review = this.reviewRepo.create({
            rating: dto.rating,
            comment: dto.comment,
            isAnonymous: dto.isAnonymous ?? false,
            place:{id: placeId} as Place,
            user: {id: userId} as User,
        });
        const saved = await this.reviewRepo.save(review);
        return saved;
    }
    async update(
        id: string,
        dto: UpdateReviewDto,
        userId: string
    ):Promise<Review>{
        const review = await this.reviewRepo.findOne({
            where:{id},
            relations:['user','place'],
        });
        if(!review){
            throw new NotFoundException(`Review #${id} khong tồn tại`);
        }
        if(review.user?.id !==userId){
            throw new ForbiddenException('Đây không phải là bài đăng của bạn');
        }
        Object.assign(review,{
            rating: dto.rating ?? review.rating,
            comment: dto.comment ?? review.comment,
            isAnonymous: dto.isAnonymous ?? review.isAnonymous
        });
        const saved = await this.reviewRepo.save(review);
        await this.UpdatePlaceRating(review.place.id);
        return saved;
    }
    async remove(id:string,userId:string ):Promise<{message: string}>{
        const review = await this.reviewRepo.findOne({
            where:{id},
            relations: ['user','place']
        });
        if(!review){
            throw new NotFoundException(`Review #${id} không tồn tại`)
        }
        if(review.user?.id !== userId){
            throw new ForbiddenException ('Bạn không thể xóa đánh giá này')
        }
        const placeId = review.place.id
        await this.reviewRepo.remove(review);
        await this.UpdatePlaceRating(placeId);
        return {message:'Đã xóa đánh giá thành công'}

    }
    private async UpdatePlaceRating(placeId: string):Promise<void>{

    }
}