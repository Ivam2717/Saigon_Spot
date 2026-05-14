import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaceImage } from "./entities/place-image.entity";
@Injectable()
export class PlaceImagesService{
    constructor(
        @InjectRepository(PlaceImage)
        private placeImagesRepository:Repository<PlaceImage>
    ){}
}