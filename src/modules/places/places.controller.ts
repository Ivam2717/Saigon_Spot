import {
  Controller, Get, Post,Patch,Delete,Request,
  Body, HttpCode, HttpStatus,
  UseGuards, Param, ParseUUIDPipe,
} from '@nestjs/common';
import { PlacesService } from "./places.service";
import { CreatePlaceDto } from './dto/create-place.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateCategoryDto } from '../categories/dto/update-category.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UpdateStatusDto } from './dto/update-status.dto';
@Controller('places')
export class PlacesController{
    constructor(private readonly placesService: PlacesService){}
    @Get()
    findAll() {
        return this.placesService.findAll();
    }
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe)id:string){
        return this.placesService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    create(
        @Body() dto: CreatePlaceDto,
        @Request() req:{ user: { id: string }}
    ) {
        return this.placesService.create(dto,req.user.id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdatePlaceDto,
        @Request() req:{user: {id:string}},
    ){
        return this.placesService.update(id,dto,req.user.id)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(
        @Param('id', ParseUUIDPipe) id:string,
        @Request() req: {user:{id:string}},
    ){
        return this.placesService.remove(id,req.user.id)
    }

    @Get('admin/places')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    findAllAdmin(){
        return this.placesService.findAllAdmin();
    }

    @Patch('admin/places/:id/status')
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('admin')
    updateStatus(
        @Param('id',ParseUUIDPipe) id: string,
        @Body() dto: UpdateStatusDto
    ){
        return this.placesService.updateStatus(id, dto.status);
    }
}