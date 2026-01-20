export const eventType = {
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Event Name',
      type: 'object',
      fields: [
        {name: 'sv', type: 'string', title: 'Svenska'},
        {name: 'en', type: 'string', title: 'English'},
      ],
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name.sv', maxLength: 96},
    },
    {
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'object',
      fields: [
        {name: 'sv', type: 'text', title: 'Svenska'},
        {name: 'en', type: 'text', title: 'English'},
      ],
    },
    {
      name: 'photo',
      title: 'Event Photo',
      type: 'image',
    },
    {
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
      description: 'Max antal besökare',
    },
    {
      name: 'attendees',
      title: 'Attendees',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Lista över bokade besökare',
    },
    {
      name: 'waitlist',
      type: 'array',
      title: 'Waitlist',
      of: [{type: 'string'}],
      description: 'Lista över personer på väntelistan',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        
        layout: 'tags',
      },
    },
  ],
  preview: {
    select: {
      title: 'name.sv',
      subtitle: 'location',
      media: 'photo',
    },
  },
}

export default eventType
