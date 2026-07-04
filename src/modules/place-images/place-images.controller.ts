import { Controller, Post,Delete, Param,
    UseGuards,UseInterceptors,UploadedFile,
    Request,ParseUUIDPipe, BadRequestException
 } from "@nestjs/common";
import { PlaceImagesService } from "./place-images.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { memoryStorage } from "multer";
@Controller()
export class PlaceImagesController{
    constructor(private readonly placeImagesService: PlaceImagesService){}    
    @Post('places/:placeId/images')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file',{
        storage: memoryStorage(),
        limits: {fileSize: 5*1024*1024},
        fileFilter:(_,file,cb)=>{
            const allowed = ['image/jpeg','image/png','image/webp' ]
            if(allowed.includes(file.mimetype)){
                cb(null,true);
            }else{
                cb(new BadRequestException ('Chỉ chấp nhận file JPG, PNG, WEBP'),false)
            }
        }
    }))
    uploadForPlace(
        @Param('placeId',ParseUUIDPipe) placeId: string,
        @UploadedFile() file: Express.Multer.File,
        @Request() req: {user:{id:string}}
    ){
        if(!file) throw new BadRequestException ('Vui lòng chọn file ảnh')
            return this.placeImagesService.uploadForPlace(placeId,file,req.user.id);
    }
    @Delete('place-images/:id')
    @UseGuards(JwtAuthGuard)
    remove(
        @Param('id',ParseUUIDPipe) id: string,
        @Request() req: {user:{id: string}}
    ){
        return this.placeImagesService.remove(id,req.user.id)
    }
}