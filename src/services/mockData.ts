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
  createdAt: string;
}

export const initialProperties: Property[] = [
  {
    id: 'prop-001',
    title: 'Cobertura Duplex Cyrela',
    description: 'Espetacular cobertura com vista panorâmica para o parque, varanda gourmet integrada e acabamentos de altíssimo padrão.',
    type: 'Venda',
    price: 3500000,
    bedrooms: 4,
    bathrooms: 5,
    parkingSpots: 3,
    area: 280,
    address: 'Av. Ibirapuera, São Paulo - SP',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80',
    status: 'Ativo',
    createdAt: new Date('2023-11-15').toISOString(),
  },
  {
    id: 'prop-002',
    title: 'Mansão Contemporânea Alphaville',
    description: 'Design assinado, sistema de automação completo, piscina com borda infinita e área de lazer exclusiva.',
    type: 'Venda',
    price: 8200000,
    bedrooms: 5,
    bathrooms: 7,
    parkingSpots: 6,
    area: 600,
    address: 'Residencial 1, Barueri - SP',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    status: 'Ativo',
    createdAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: 'prop-003',
    title: 'Loft Industrial Pinheiros',
    description: 'Moderno loft de conceito aberto no coração de Pinheiros, pé direito duplo, janelões do chão ao teto.',
    type: 'Aluguel',
    price: 8500,
    bedrooms: 1,
    bathrooms: 2,
    parkingSpots: 1,
    area: 85,
    address: 'Rua Fradique Coutinho, São Paulo - SP',
    image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&auto=format&fit=crop&q=80',
    status: 'Ativo',
    createdAt: new Date('2024-02-28').toISOString(),
  },
  {
    id: 'prop-004',
    title: 'Apartamento NeoClassic Itaim',
    description: 'Unidade exclusiva em andar alto, finamente mobiliada, automação total e serviços 24h no condomínio.',
    type: 'Aluguel',
    price: 15000,
    bedrooms: 3,
    bathrooms: 4,
    parkingSpots: 3,
    area: 180,
    address: 'Rua Leopoldo Couto de Magalhães, São Paulo - SP',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    status: 'Ativo',
    createdAt: new Date('2024-03-05').toISOString(),
  }
];
