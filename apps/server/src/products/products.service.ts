import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepo: ProductRepository) {}
  create(data: CreateProductDto) {
    return this.productRepo.createProduct(data);
  }

  findAll() {
    return this.productRepo.getProductList();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, _: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
