import { config, fields, collection, singleton } from '@keystatic/core';
import { MENU_CATEGORIES } from './src/data/menu';

const photo = (label: string) =>
  fields.image({ label, directory: 'src/assets/photos', publicPath: '../../assets/photos/', validation: { isRequired: true } });
const order = fields.integer({ label: 'Order', description: 'Lower numbers show first', defaultValue: 999, validation: { isRequired: true } });

export default config({
  storage: { kind: 'github', repo: 'jasonbeloso24-code/letsdimsumtest' },
  ui: { brand: { name: "Let's Dimsum" } },
  collections: {
    menu: collection({
      label: 'Menu items',
      path: 'src/content/menu/*',
      slugField: 'name',
      columns: ['name', 'category'],
      schema: {
        name: fields.slug({ name: { label: 'English name' } }),
        zh: fields.text({ label: 'Chinese name', validation: { isRequired: true } }),
        category: fields.select({
          label: 'Category',
          options: MENU_CATEGORIES.map((c) => ({ label: c.label, value: c.id })),
          defaultValue: 'dimsum',
        }),
        order,
      },
    }),
    dishes: collection({
      label: 'Signature dishes',
      path: 'src/content/dishes/*',
      slugField: 'name',
      schema: {
        name: fields.slug({ name: { label: 'English name' } }),
        zh: fields.text({ label: 'Chinese name', validation: { isRequired: true } }),
        image: photo('Square photo'),
        alt: fields.text({ label: 'Photo description (alt text)', validation: { isRequired: true } }),
        featured: fields.checkbox({ label: 'Wide feature card', description: 'Only one dish should be featured' }),
        note: fields.text({ label: 'Short description (feature card only)', multiline: true }),
        order,
      },
    }),
    photos: collection({
      label: 'Photos',
      path: 'src/content/photos/*',
      slugField: 'title',
      schema: {
        title: fields.slug({ name: { label: 'Internal name' } }),
        section: fields.select({
          label: 'Section',
          options: [
            { label: 'About (2 photos)', value: 'about' },
            { label: 'Our place strip (3 photos)', value: 'place' },
            { label: 'Visit (1 photo)', value: 'visit' },
          ],
          defaultValue: 'place',
        }),
        image: photo('Photo'),
        alt: fields.text({ label: 'Photo description (alt text)', validation: { isRequired: true } }),
        order,
      },
    }),
  },
  singletons: {
    hours: singleton({
      label: 'Hours',
      path: 'src/content/hours',
      schema: {
        confirmed: fields.checkbox({
          label: 'Confirmed by the owners',
          description: '[CLIENT TO CONFIRM] Leave unticked until the owners check the hours',
        }),
        rows: fields.array(
          fields.object({
            label: fields.text({ label: 'Days label', validation: { isRequired: true } }),
            days: fields.multiselect({
              label: 'Days',
              options: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d, i) => ({
                label: d,
                value: String(i),
              })),
            }),
            opens: fields.text({ label: 'Opens', validation: { isRequired: true } }),
            closes: fields.text({ label: 'Closes', validation: { isRequired: true } }),
          }),
          { label: 'Regular hours', itemLabel: (p) => p.fields.label.value },
        ),
        holidays: fields.array(
          fields.object({
            date: fields.date({ label: 'Date', validation: { isRequired: true } }),
            label: fields.text({ label: 'Holiday', validation: { isRequired: true } }),
            hours: fields.text({ label: 'Hours (or "Closed")', validation: { isRequired: true } }),
          }),
          { label: 'Holiday hours', itemLabel: (p) => `${p.fields.date.value ?? ''} ${p.fields.label.value}` },
        ),
      },
    }),
  },
});
