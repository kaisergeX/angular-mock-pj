import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './products.repository';
import { safeAnyToNumber } from '@repo/shared';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepo: ProductRepository) {}
  create(data: CreateProductDto) {
    return this.productRepo.createProduct(data);
  }

  findAll() {
    return this.productRepo.getProductList();
  }

  findOne(id: string) {
    const { result: productId, success } = safeAnyToNumber(id);
    if (!success) {
      throw new BadRequestException();
    }

    return this.productRepo.getProductById(productId);
  }

  update(id: number, data: UpdateProductDto) {
    return this.productRepo.updateProduct(id, data);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
