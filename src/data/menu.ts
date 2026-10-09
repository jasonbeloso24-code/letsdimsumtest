// Menu categories, in the order of the printed boards. Items live in src/content/menu/ (edited in Keystatic).
export const MENU_CATEGORIES = [
  { id: 'dimsum', label: 'Dimsum', zh: '点心' },
  { id: 'buns', label: 'Buns', zh: '包子' },
  { id: 'must-try', label: 'Must Try', zh: '必点' },
  { id: 'vegetables-noodles', label: 'Vegetables & Noodle Soups', zh: '时蔬 · 汤面' },
  { id: 'rice-bowls', label: 'Rice Bowls', zh: '盖饭' },
  { id: 'desserts', label: 'Desserts', zh: '甜点' },
  { id: 'drinks', label: 'Drinks', zh: '饮品' },
] as const;

export const MENU_PDF = '/menu/lets-dimsum-menu.pdf';
