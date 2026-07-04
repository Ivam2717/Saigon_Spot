import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceImage } from "./entities/place-image.entity";
import { Place } from "../places/entities/place.entity";
import { User } from "../users/entities/user.entity";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
@Injectable()
export class PlaceImagesService{
    constructor(
        @InjectRepository(PlaceImage)
        private readonly imageRepo:Repository<PlaceImage>,
        @InjectRepository(Place)
        private readonly placeRepo:Repository<Place>,
        private readonly cloudinaryService: CloudinaryService,
    ){}
    async uploadForPlace(
        placeId: string,
        file: Express.Multer.File,
        userId: string,
    ):Promise<PlaceImage>{
        const place = await this.placeRepo.findOne({ where: {id: placeId}})
        if(!place){
            throw new NotFoundException(`Place #${placeId} này không tồn tại`);
        }
        const result = await this.cloudinaryService.uploadImage(file, 'saigon-spot/places');
        const image = this.imageRepo.create({
            url: result.secure_url,
            place: {id: placeId} as Place,
            uploadedBy: {id: userId} as User
        });
        return this.imageRepo.save(image)
    }
    async remove(
        id:string,
        userId:string
    ):Promise<{message: string}>{
        const image = await this.imageRepo.findOne({
            where: {id},
            relations:['uploadedBy']
        });
        if(!image){
            throw new NotFoundException (`Image #${id} không tồn tại`)
        }
        if(image.uploadedBy?.id !==userId){
            throw new ForbiddenException('Bạn không có quyền để xóa cảnh này')
        }
        const publicId = this.extractPublicId(image.url)
        await this.cloudinaryService.deleteImage(publicId)
        await this.imageRepo.remove(image)
        return {message: 'Đã xóa ảnh thành công'}
    }
    private extractPublicId(url:string): string{
        const parts = url.split('/');
        const uploadIndex = parts.indexOf('upload');
        const relevantParts = parts.slice(uploadIndex +2)
        const filename = relevantParts[relevantParts.length -1].split('.')[0];
        relevantParts[relevantParts.length-1]= filename;
        return relevantParts.join('/')

    }
}