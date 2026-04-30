export type PropertyType = 'Venda' | 'Aluguel';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  area: number;
  address: string;
  image: string;
  status: 'Ativo' | 'Inativo';
  highlights: string[];
  createdAt: string;
}
