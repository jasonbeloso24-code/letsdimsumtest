import { getEntry } from 'astro:content';
import { MENU_CATEGORIES } from './menu';
import { menuItems } from './content';
import { NAME, ADDRESS, FACEBOOK_URL } from './business';
import { to24h } from './time';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// No priceRange, telephone or aggregateRating until the owners confirm them.
export async function menuSchema(site: URL) {
  const items = await menuItems();
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${NAME} menu`,
    url: new URL('/menu/', site).href,
    inLanguage: 'en',
    hasMenuSection: MENU_CATEGORIES.map((cat) => ({
      '@type': 'MenuSection',
      name: cat.label,
      alternateName: cat.zh,
      hasMenuItem: items
        .filter((i) => i.data.category === cat.id)
        .map((i) => ({ '@type': 'MenuItem', name: i.data.name, alternateName: i.data.zh })),
    })),
  };
}

export async function restaurantSchema(site: URL) {
  const hours = (await getEntry('hours', 'hours'))!.data;
  const openingHoursSpecification = hours.rows.flatMap((row) => {
    const opens = to24h(row.opens);
    const closes = to24h(row.closes);
    if (!opens || !closes) return [];
    return [{ '@type': 'OpeningHoursSpecification', dayOfWeek: row.days.map((d) => DAYS[Number(d)]), opens, closes }];
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: NAME,
    alternateName: '来点心',
    url: site.href,
    image: new URL('/og.png', site).href,
    servesCuisine: ['Chinese', 'Dim sum'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.province,
      addressCountry: ADDRESS.country,
    },
    openingHoursSpecification,
    hasMenu: new URL('/menu/', site).href,
    ...(FACEBOOK_URL ? { sameAs: [FACEBOOK_URL] } : {}),
  };
}
