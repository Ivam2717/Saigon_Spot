import { Controller,Get,Patch,Post,Delete,
    Param,Body,UseGuards,Request,HttpCode,HttpStatus,ParseUUIDPipe
 } from "@nestjs/common";
import { ReviewsService } from "./reviews.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UpdateReviewDto } from "./dto/update-review.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
@Controller('')
export class ReviewsController{
    constructor(private readonly reviewsService:ReviewsService){}
    @Get('places/:placeId/reviews')
    findByPlace(@Param('placeId', ParseUUIDPipe) placeId:string){
        return this.reviewsService.findByPlace(placeId)
    }
    @Post('places/:placeId/reviews')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    create(
        @Param('placeId', ParseUUIDPipe) placeId: string,
        @Body() dto: CreateReviewDto,
        @Request() req: {user:{id: string}},
    ){
        return this.reviewsService.create(placeId, dto,req.user.id)
    }
    @Patch('reviews/:id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id',ParseUUIDPipe) id:string,
        @Body() dto:UpdateReviewDto,
        @Request() req: {user:{id:string}}
    ){
        return this.reviewsService.update(id, dto, req.user.id)
    }
    @Delete('reviews/:id')
    @UseGuards(JwtAuthGuard)
    remove(
        @Param('id', ParseUUIDPipe) id:string,
        @Request() req: {user : {id: string}}
    ){
        return this.reviewsService.remove(id, req.user.id)
    }
}