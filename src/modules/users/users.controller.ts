import { Controller, Patch,UseGuards, UseInterceptors,
    UploadedFile,Request,BadRequestException
 }  from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
@Controller('users')
export class UsersController{
    constructor(private readonly usersService:UsersService){}
    @Patch('me/avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file',{
        storage: memoryStorage(),
        limits: {fieldSize:2*1024*1024},
        fileFilter:(_,file,cb)=>{
            const allowed = ['image/jpeg','image/png','image/webp'];
            if(allowed.includes(file.mimetype)){
                cb(null,true)
            }else{
                cb(new BadRequestException('Chỉ chấp nhận file JPG, PNG, WEBP'),false)
            }
        },
    }))
    updateAvatar(
        @UploadedFile() file: Express.Multer.File,
        @Request()req: {user: {id: string}}
    ){
        if(!file) throw new BadRequestException('Vui lòng chọn file ảnh');
        return this.usersService.updateAvatar(req.user.id,file);
    }
}