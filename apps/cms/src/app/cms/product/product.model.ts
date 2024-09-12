export type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  category: string;
  status: 'active' | 'inactive';
};
