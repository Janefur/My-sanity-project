export const pageType = {
  name: 'pageType',
  title: 'Page Type',
  type: 'document',
  fields: [
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          {title: 'Svenska', value: 'sv'},
          {title: 'English', value: 'en'},
        ],
      },
    },
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
      name: 'body',
      title: 'Body',
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
