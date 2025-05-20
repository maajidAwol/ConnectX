// ----------------------------------------------------------------------

export type IProductItemHeroProps = {
  title: string;
  caption: string;
  coverImg: string;
  label: string;
};

export type IProductItemCompareProps = {
  id: string;
  name: string;
  price: number;
  coverImg: string;
  rating: number;
  details: string[];
};

export interface IProductItemProps {
  id: string;
  tenant: string[];
  owner: string;
  sku: string;
  name: string;
  base_price: string;
  profit_percentage: number | null;
  selling_price: number | null;
  quantity: number;
  category: {
    id: string;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  is_public: boolean;
  description: string;
  short_description: string;
  tag: string[];
  brand: string;
  additional_info: Record<string, any>;
  warranty: string;
  cover_url: string;
  images: string[];
  colors: string[];
  sizes: string[];
  total_sold: number;
  total_ratings: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export type IProductFiltersProps = {
  filterTag: string[];
  filterStock: boolean;
  filterBrand: string[];
  filterShipping: string[];
  filterCategories: string;
  filterRating: string | null;
  filterPrice: {
    start: number;
    end: number;
  };
};

export type IProductOrderProps = {
  id: string;
  item: string;
  price: number;
  status: string;
  orderId: string;
  deliveryDate: Date | string | number;
};
