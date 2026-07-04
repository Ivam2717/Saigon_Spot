import { IsInt, IsOptional, IsBoolean, Max, Min, IsString } from "class-validator";
export class CreateReviewDto{
    @IsInt({message: 'Rating phải là số nguyên'})
    @Min(1,{message: 'Rating tối thiểu là 1'})
    @Max(5,{message: 'Rating tối thiểu là 5'})
    rating!: number;

    @IsString()
    @IsOptional()
    comment?: string;

    @IsBoolean()
    @IsOptional()
    isAnonymous?: boolean
}