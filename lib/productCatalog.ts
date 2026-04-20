export interface Product {
  id: string;
  name: string;
  tagline: string;
  type: string;
  driver: string;
  battery: string;
  ancLevel: 'basic' | 'advanced' | 'pro';
  ipx: string;
  price: number;
  bestFor: string[];
  colorways: string[];
  imageUrl: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'x1',
    name: 'NexVerse X1',
    tagline: 'Your world, beautifully filtered.',
    type: 'Over-Ear Wireless',
    driver: '40mm Dynamic Driver',
    battery: '30 hours (ANC on)',
    ancLevel: 'basic',
    ipx: 'IPX4',
    price: 199,
    bestFor: ['commuting', 'casual listening', 'calls'],
    colorways: ['Midnight Black', 'Pearl White', 'Storm Grey'],
    imageUrl: '/images/x1.png',
  },
  {
    id: 'x1-pro',
    name: 'NexVerse X1 Pro',
    tagline: 'Studio silence, everywhere you go.',
    type: 'Over-Ear Wireless',
    driver: '40mm Planar-Hybrid Driver',
    battery: '38 hours (ANC on)',
    ancLevel: 'advanced',
    ipx: 'IPX5',
    price: 349,
    bestFor: ['work from home', 'travel', 'focus sessions', 'audiophiles'],
    colorways: ['Obsidian', 'Cosmic Blue', 'Rose Gold'],
    imageUrl: '/images/x1-pro.png',
  },
  {
    id: 'x1-max',
    name: 'NexVerse X1 Max',
    tagline: 'The benchmark. Redefined.',
    type: 'Over-Ear Wireless',
    driver: '50mm Orthodynamic Driver',
    battery: '48 hours (ANC on)',
    ancLevel: 'pro',
    ipx: 'IPX6',
    price: 549,
    bestFor: ['studio mixing', 'spatial audio immersion', 'premium travel', 'all-day wear'],
    colorways: ['Deep Space', 'Titanium Silver', 'Aurora'],
    imageUrl: '/images/x1-max.png',
  },
];

export type ProductId = 'x1' | 'x1-pro' | 'x1-max';

export function getProductById(id: ProductId): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
