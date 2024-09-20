import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '~/category/entities/category.entity';

@Injectable()
export class ProductRepository {
  #logger = new Logger('AuthController');

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async createProduct(newProduct: CreateProductDto) {
    const category = await this.categoryRepo.findOneBy({
      id: newProduct.categoryId,
    });

    if (!category) {
      throw new NotFoundException({ message: 'Category not found' });
    }

    const productData = this.productRepo.create({
      ...newProduct,
      categoryName: category.name,
    });
    try {
      const processedProduct = await this.productRepo.save(productData);
      this.#logger.verbose(`Product ${newProduct.name} created`);
      return processedProduct;
    } catch (_) {
      throw new InternalServerErrorException();
    }
  }

  getProductList(): Promise<Product[]> {
    return this.productRepo.find();
  }

  getProductById(id: Product['id']): Promise<Product> {
    return this.productRepo.findOneBy({ id });
  }

  async updateProduct(id: Product['id'], data: UpdateProductDto) {
    const category = await this.categoryRepo.findOneBy({
      id: data.categoryId,
    });

    if (!category) {
      throw new NotFoundException({ message: 'Category not found' });
    }

    return this.productRepo.update(
      { id },
      { ...data, categoryName: category.name },
    );
  }

  deleteProduct(id: Product['id']) {
    return this.productRepo.delete({ id });
  }
}
