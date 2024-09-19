import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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

  getProductById(id: Product['id']): Promise<Product> {
    return this.productRepo.findOneBy({ id });
  }

  updateProduct(id: Product['id'], data: UpdateProductDto) {
    return this.productRepo.update({ id }, data);
  }
}
