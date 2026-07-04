import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import { Tag } from "./entities/tag.entity";
import { Place } from "../places/entities/place.entity";
import { CreateTagDto } from "./dto/create-tag.dto";
import { ManagePlaceTagsDto } from "./dto/manage-place-tags-dto";
@Injectable()
export class TagsService{
    constructor(
        @InjectRepository(Tag)
        private tagRepo: Repository<Tag>,
        @InjectRepository(Place)
        private placeRepo: Repository<Place>,
    ) {}
    async findAll(): Promise<Tag[]>{
        return this.tagRepo.find({ order: {name: 'ASC'}})
    }
    async create(dto:CreateTagDto): Promise<Tag>{
        const existing = await this.tagRepo.findOne({where : {name : dto.name}})
        if(existing){
            throw new ConflictException(`Tag "#${dto.name}" đã tồn tại`);
        }
        const tag = this.tagRepo.create(({name: dto.name}))
        return this.tagRepo.save(tag)
    }
    async remove(id: number): Promise<{message: string}>{
        const tag = await this.tagRepo.findOne({where: {id}});
        if(!tag){
            throw new NotFoundException(`Tag #${id} không tồn tại`);
        }
        await this.tagRepo.remove(tag);
        return {message: `Đã xóa tag "${tag.name}"`}
    }
    async addTagsToPlace(
        placeId:string,
        dto:ManagePlaceTagsDto,
    ):Promise<Place>{
        const place = await this.placeRepo.findOne({
            where: {id:placeId},
            relations:['tags']
        });
        if(!place){
            throw new NotFoundException(`Place #${placeId} không tồn tại`)
        }
        const tags = await this.tagRepo.findBy({id: In(dto.tagIds)});
        if(tags.length !== dto.tagIds.length){
            throw new NotFoundException ('Một hoặc nhiều tag không tồn tại')
        }
        const existingIds = place.tags.map((t) => t.id)
        const newTags = tags.filter((t) => !existingIds.includes(t.id));
        place.tags = [...place.tags,...newTags];
        return this.placeRepo.save(place);
    }
    async removeTagsFromPlace(
        placeId: string,
        dto:ManagePlaceTagsDto,
    ): Promise<Place>{
        const place = await this.placeRepo.findOne({
            where:{id: placeId},
            relations:['tags']
        })
        if(!place){
            throw new NotFoundException (`Place #${placeId} này không tồn tại`);
        }
        place.tags = place.tags.filter((t) => !dto.tagIds.includes(t.id))
        return this.placeRepo.save(place)
    }
}