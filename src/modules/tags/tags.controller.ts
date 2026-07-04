import { Get,Post,Delete,Param,Body, UseGuards,ParseIntPipe,HttpCode,HttpStatus } from "@nestjs/common";
import { Controller } from "@nestjs/common";
import { TagsService } from "./tags.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ManagePlaceTagsDto } from "./dto/manage-place-tags-dto";
@Controller()
export class TagsController{
    constructor(private readonly tagsService:TagsService){}

    @Get('tags')
    findAll(){
        return this,this.tagsService.findAll();
    }
    
    @Post('tags')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    create(@Body() dto: CreateTagDto){
        return this.tagsService.create(dto)
    }

    @Delete('tags/:id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseIntPipe)id:number){
        return this.tagsService.remove(id)
    }

    @Post('places/:placeId/tags')
    @UseGuards(JwtAuthGuard)
    addTagsToPlace(
        @Param('placeId') placeId: string,
        @Body() dto: ManagePlaceTagsDto,
    ){
        return this.tagsService.addTagsToPlace(placeId,dto)
    }

    @Delete('places/:placeId/tags')
    @UseGuards(JwtAuthGuard)
    removeTagsFromPlace(
        @Param('placeId') placeId: string,
        @Body() dto: ManagePlaceTagsDto
    ){
        return this.tagsService.removeTagsFromPlace(placeId,dto);
    }
}