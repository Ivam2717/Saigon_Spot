import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { rejects } from "assert";
import{ v2 as cloudinary, UploadApiResponse} from "cloudinary";
import { resolve } from "path";
import { Readable } from "stream";
import { Multer } from "multer";
@Injectable()
export class CloudinaryService{
    constructor(private readonly config: ConfigService){
        cloudinary.config({
            cloud_name: config.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: config.get<string>('CLOUDINARY_API_KEY'),
            api_secret: config.get<string>('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(
        file: Express.Multer.File,
        folder: string,
    ): Promise<UploadApiResponse>{
        return new Promise((resolve,reject)=>{
            const uploadStream= cloudinary.uploader.upload_stream(
                {folder},
                (error,result)=> {
                    if(error) return reject(error);
                    resolve(result!);
                },
            );
            Readable.from(file.buffer).pipe(uploadStream);
        });
    }
    async deleteImage(publicId: string): Promise<void>{
        await cloudinary.uploader.destroy(publicId);
    }
}