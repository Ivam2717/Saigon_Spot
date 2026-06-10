import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { use } from 'passport';
import { UserRole } from '../users/entities/user.entity';
@Injectable()
export class AuthService{
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){}
    async register(dto: RegisterDto){
        return this.usersService.createUser({
            email: dto.email,
            fullName:dto.fullName,
            password:dto.password
        });
    }
    async login(dto: LoginDto): Promise<{ accessToken: string}>{
        const user = await this.usersService.findByEmail(dto.email)
        if (!user){
            throw new UnauthorizedException('Email hoặc password không đúng')
        }

        const isMatch = await bcrypt.compare(dto.password,user.password)
        if(!isMatch){
            throw new UnauthorizedException('Email hoặc password không đúng')
        }

        const payload = {sub: user.id, email: user.email, role:user.role }
        return {accessToken: this.jwtService.sign(payload)}
    }
}