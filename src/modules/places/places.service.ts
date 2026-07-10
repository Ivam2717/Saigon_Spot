import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place, PlaceStatus } from "./entities/place.entity";
import { Category } from '../categories/entities/category.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { User } from '../users/entities/user.entity';
import { use } from 'passport';

@Injectable()
export class PlacesService{
  constructor(
      @InjectRepository(Place)
      private placeRepo: Repository<Place>,

      @InjectRepository(Category)
      private readonly categoryRepo: Repository<Category>,
  ) {}
  async findAll(): Promise<Partial<Place>[]> {
    return this.placeRepo.find({
      where: { status: PlaceStatus.APPROVED },
      select: {
        id:          true,
        name:        true,
        address:     true,
        district:    true,
        avgRating:   true,
        reviewCount: true,
        coverUrl:    true,
        status:      true,
        category: {
          id:   true,
          name: true,
        },
      },
      order: { avgRating: 'DESC' },          
    });
  }
  async findOne(id: string): Promise<Place>{
    const place = await this.placeRepo.findOne({
      where:{id},
      relations: ['category', 'createBy','tags']
    });
    if(!place){
      throw new NotFoundException(`Place #${id} này không tồn tại`);
    }
    return place;
  }

  // ── CREATE ───────────────────────────────────────────────
  async create(dto: CreatePlaceDto, userId: string): Promise<Place> {
    // 1. Kiểm tra slug trùng
    const existingSlug = await this.placeRepo.findOne({
      where: { slug: dto.slug },
    });
    if (existingSlug) {
      throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
    }

    let category: Category | null = null;
    if (dto.categoryId) {
      category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category #${dto.categoryId} không tồn tại`);
      }
    }

    // 3. Tạo entity từ DTO
    const place = this.placeRepo.create({
      name:        dto.name,
      slug:        dto.slug,
      address:     dto.address,
      district:    dto.district,
      description: dto.description,
      coverUrl:    dto.coverUrl,
      isAnonymous: dto.isAnonymous ?? false,
      location:    dto.location ?? null,
      category:    category ?? undefined,
      // status mặc định = 'pending' (theo entity)
      createdBy:   {id:userId} as User
    });

    return this.placeRepo.save(place);
  }
  async update(id: string, dto: UpdatePlaceDto, userId: string): Promise<Place>{
    const place = await this.placeRepo.findOne({
      where:{id},
      relations:['createdBy'],
    });
    if(!place){
      throw new NotFoundException(`Place #${id} không tồn tại`)
    }
    if(place.createdBy?.id !== userId){
      throw new ForbiddenException('Hãy đăng nhập để sửa địa điểm');
    }
    if(dto.slug && dto.slug !== place.slug){
      const slugExists = await this.placeRepo.findOne({
        where:{slug:dto.slug},
      });
      if(slugExists){
        throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`)
      }
    }
    if(dto.categoryId){
      const category = await this.categoryRepo.findOne({
        where:{id:dto.categoryId},
      });
      if (!category){
        throw new NotFoundException(`Category #${dto.categoryId} không tồn tại`)
      }
      place.category = category;
    }
    Object.assign(place,{
      name:        dto.name        ?? place.name,
      slug:        dto.slug        ?? place.slug,
      address:     dto.address     ?? place.address,
      district:    dto.district    ?? place.district,
      description: dto.description ?? place.description,
      coverUrl:    dto.coverUrl    ?? place.coverUrl,
      isAnonymous: dto.isAnonymous ?? place.isAnonymous,
      location:    dto.location    ?? place.location,
    });
    return this.placeRepo.save(place);
  } 
  async remove(id: string, userId: string): Promise<{message: string}>{
    const place = await this.placeRepo.findOne({
      where: {id},
      relations: ['createBy'],
    });
    if(!place){
      throw new NotFoundException(`PLace #${id} không tồn tại`);
    }
    if(place.createdBy?.id !== userId){
      throw new ForbiddenException('Hãy đăng nhập để thực hiện chức năng này');
    }
    return {message:'Đã xóa địa điểm thành công'}
  }
  async findAllAdmin():Promise<Place[]>{
    return this.placeRepo.find({
      relations:['category','createdBy'],
      select:{
        id: true,
        name: true,
        address: true,
        district: true,
        status: true,
        avgRating: true,
        reviewCount: true,
        createdAt: true,
        category: {id: true, name:true},
        createdBy: {id:true,  fullName:true, email:true}
      },
      order:{ createdAt: 'DESC'}
    })
  }
  async updateStatus(id: string, status: PlaceStatus): Promise<Place>{
    const place = await this.placeRepo.findOne({where: {id}});
    if(!place){
      throw new NotFoundException (`Place #${id} không tồn tại`)
    }
    place.status= status
    return this.placeRepo.save(place)
  }
}