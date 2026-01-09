const carousel = {
  name: 'carousel',
  title: 'Event carousel',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Rubrik',
      type: 'string',
      description: 'Ex: Musik i närheten',
    },
    {
      name: 'events',
      title: 'Välj events',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'event'}]}],
      validation: (Rule) => Rule.min(1),
    },
  ],
}

export default carousel
