import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const existing = await this.categoriesRepository.findOne({
            where: { name: createCategoryDto.name },
        });

        if (existing) {
            throw new ConflictException('La categoría ya existe');
        }

        const category = this.categoriesRepository.create(createCategoryDto);
        return await this.categoriesRepository.save(category);
    }

    async findAll() {
        return await this.categoriesRepository.find();
    }

    async findOne(id: string) {
        const category = await this.categoriesRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        const category = await this.findOne(id);

        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existing = await this.categoriesRepository.findOne({
                where: { name: updateCategoryDto.name },
            });
            if (existing) {
                throw new ConflictException('El nombre de categoría ya existe');
            }
        }

        await this.categoriesRepository.update(id, updateCategoryDto);
        return await this.findOne(id);
    }

    async remove(id: string) {
        const category = await this.findOne(id);
        await this.categoriesRepository.remove(category);
        return { message: 'Categoría eliminada exitosamente' };
    }
}
