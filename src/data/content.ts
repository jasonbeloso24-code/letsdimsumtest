import { getCollection } from 'astro:content';

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) => a.data.order - b.data.order;

export async function photosFor(section: 'about' | 'place' | 'visit') {
  return (await getCollection('photos', (p) => p.data.section === section)).sort(byOrder);
}

export async function dishes() {
  return (await getCollection('dishes')).sort(byOrder);
}

export async function menuItems() {
  return (await getCollection('menu')).sort(byOrder);
}
