export type Product = {
  id: number;
  prod_name: string;
  prod_price: number;
  created_at: string;
  updated_at: string;
};

export type RawProduct = Omit<Product, 'prod_price'> & { prod_price: string | number };

export type ProductDraft = {
  prod_name: string;
  prod_price: string;
};


