import { Injectable , ConflictException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "./entities/user.entity";
import* as bcrypt from 'bcrypt';
import { use } from "passport";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private readonly cloudinaryService: CloudinaryService
    ) {}
    async findByEmail(email:string): Promise<User | null>{
        return this.userRepo.findOne({where: {email}});
    }
    async createUser(data:{
        email:string
        password:string
        fullName:string
    }): Promise<Omit<User, 'password'>>{
        const existing = await this.findByEmail(data.email);
        if(existing){
            throw new ConflictException('Email đã được sử dụng');
        }
        const hash = await bcrypt.hash(data.password,10);
        const user = this.userRepo.create({
            email: data.email,
            password: hash,
            fullName: data.fullName
        });
        const saved = await this.userRepo.save(user);
        const {password,...result} = saved;
        return result;
    }
    async updateAvatar(userId: string, file: Express.Multer.File): Promise<Omit<User,'password'>>{
        const user = await this.userRepo.findOne({where: {id: userId}});
        if(!user){
            throw new NotFoundException (`User #${userId} không tồn tại`)
        }
        const result = await this.cloudinaryService.uploadImage(file, 'saigon-spot/avatars');
        user.avatarUrl = result.secure_url;
        const saved = await this.userRepo.save(user)
        const {password,...rest} = saved
        return rest;
    }
}