import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { safeAnyToNumber } from '@repo/shared';

@Injectable()
export class CategoryService {
  constructor(private readonly productRepo: CategoryRepository) {}
  create(data: CreateCategoryDto) {
    return this.productRepo.createCategory(data);
  }

  findAll() {
    return this.productRepo.getCategoryList();
  }

  findOne(id: string) {
    const { result: productId, success } = safeAnyToNumber(id);
    if (!success) {
      throw new BadRequestException();
    }

    return this.productRepo.getCategoryById(productId);
  }

  update(id: string, data: UpdateCategoryDto) {
    const { result: productId, success } = safeAnyToNumber(id);
    if (!success) {
      throw new BadRequestException();
    }

    return this.productRepo.updateCategory(productId, data);
  }
}
