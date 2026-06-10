import { IsNotEmpty, 
    IsEmail, IsString, 
    MinLength, MaxLength 
} from "class-validator";

export class RegisterDto {
    @IsEmail({},{message: 'Email không hợp lệ'})
    email!:string;

    @IsString()
    @MinLength(6, {message: 'Mật khẩu tối thiểu 6 ký tự'})
    password!: string

    @IsString()
    @IsNotEmpty({message: 'Họ tên không được để trống'})
    @MaxLength(100)
    fullName!:string
}