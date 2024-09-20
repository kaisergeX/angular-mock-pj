import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Product } from '~/products/entities/product.entity';

@Injectable()
export class CategoryRepository {
  #logger = new Logger('AuthController');

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async createCategory(newCategory: CreateCategoryDto) {
    const categoryData = this.categoryRepo.create(newCategory);

    try {
      const processedCategory = await this.categoryRepo.save(categoryData);
      this.#logger.verbose(`Category ${newCategory.name} created`);
      return processedCategory;
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  getCategoryList(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  getCategoryById(id: Category['id']): Promise<Category> {
    return this.categoryRepo.findOneBy({ id });
  }

  updateCategory(id: Category['id'], data: UpdateCategoryDto) {
    return this.categoryRepo.manager.transaction(async (manager) => {
      const categoryUpdateResult = await manager.update(Category, { id }, data);
      await manager.update(
        Product,
        { categoryId: id },
        { categoryName: data.name },
      );

      return categoryUpdateResult;
    });
  }

  deleteCategory(id: Category['id']) {
    return this.categoryRepo.delete({ id });
  }
}
