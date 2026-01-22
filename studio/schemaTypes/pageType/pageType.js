export const pageType = {
  name: 'pageType',
  title: 'Page Type',
  type: 'document',
  fields: [
    
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
    },
    {
      name: 'ingress',
      title: 'Ingress',
      type: 'array',
      of: [{type: 'block'}, {type: 'carousel'}],
    },
    {
      name: 'carousel',
      title: 'Carousel',
      type: 'array',
      of: [{type: 'carousel'}],
    },
  ],
}
export default pageType
