import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { emit } from 'process';
import { IsEmail } from 'class-validator';
export interface JwtPayLoad{
    sub: string;
    email: string;
    role: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(config: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('JWT_SECRET')!,
        });
    }
    validate(payload:JwtPayLoad){
        return{id:payload.sub,email: payload.email,role:payload.role};
    }
}