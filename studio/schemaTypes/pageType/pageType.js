export const pageType = {
  name: "pageType",
  title: "Page Type",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    },{
      name:'slides',
      title:'Slides',
      type:'array',
      of:[{type:'image'}],
    }
  ],
};
export default pageType;