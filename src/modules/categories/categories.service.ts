import { 
    Injectable, 
    NotFoundException, 
    ConflictException 
} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) {}
    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.find({
            order:{ name : 'ASC' },
        });
    }
    async findOne( id: number): Promise<Category> {
        const category = await this.categoriesRepository.findOne({where:{id}});
        if(!category){
            throw new NotFoundException(`Category #${id} không tồn tại`);
        }
        return category;
    }
    async create(dto: CreateCategoryDto): Promise<Category> {
        const existing = await this.categoriesRepository.findOne({
            where:{slug:dto.slug},
        });
        if (existing) {
            throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
        }
        const category = this.categoriesRepository.create(dto);
        return this.categoriesRepository.save(category)
    }
    async update( id:number, dto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);
        if (dto.slug && dto.slug !== category.slug) {
            const slugExists = await this.categoriesRepository.findOne({
                where: { slug: dto.slug },
            });
            if (slugExists) {
                throw new ConflictException(`Slug "${dto.slug}" đã tồn tại`);
            }
        }
        Object.assign(category, dto);
        return this.categoriesRepository.save(category);
    }
    async remove(id: number): Promise<{ message: string }> {
        const category = await this.findOne(id);
        await this.categoriesRepository.remove(category);
        return { message: `Đã xóa category #${id}` };
    }
}