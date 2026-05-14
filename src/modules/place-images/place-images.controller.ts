import { Controller } from "@nestjs/common";
import { PlaceImagesService } from "./place-images.service";
@Controller('place-images')
export class PlaceImagesController{
    constructor(private readonly placeImagesService: PlaceImagesService){

    }
}