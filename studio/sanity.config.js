import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'My Sanity Project',

  projectId: 'pu3m65bh',
  dataset: 'production',

  plugins: [
    structureTool(), 
    visionTool(),
    internationalizedArray({
      languages: [
        {id: 'sv', title: 'Svenska'},
        {id: 'en', title: 'English'},
      ],
      defaultLanguages: ['sv'],
      fieldTypes: ['string', 'text'],
    }),
  ],

  i18n: {
    baseLanguage: 'sv',
    languages: [
      {id: 'sv', title: 'Svenska'},
      {id: 'en', title: 'English'},
    ],
  },

  schema: {
    types: schemaTypes,
  },

  // Lägg till preview knapp
  document: {
    productionUrl: async (prev, {document}) => {
      // För events - öppna preview
      if (document._type === 'event' && document.slug?.current) {
        return `http://localhost:3000/events/${document.slug.current}`
      }
      return prev
    },
  },
})
