import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductRepository {
  #logger = new Logger('AuthController');

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createProduct(newProduct: CreateProductDto) {
    const productData = this.productRepo.create(newProduct);

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
}
