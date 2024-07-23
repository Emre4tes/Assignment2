
export interface ShippingAddress {
  name: string;
  phone: string;
  address_line1: string;
  city_locality: string;
  state_province: string;
  postal_code: string;
  country_code: string;
}

export interface Shipping {
  carrier: string;
  address: string;
  description: string;
  cost: number;
}
