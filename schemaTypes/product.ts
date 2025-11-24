import {defineType, defineField} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    // 🏷️ Basic Info
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),

    // 🖼️ Images
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      options: {layout: 'grid'},
    }),

    // 🏷️ Category
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Clothing', value: 'clothing'},
          {title: 'Bags', value: 'bags'},
          {title: 'Shoes', value: 'shoes'},
          {title: 'Sneakers', value: 'sneakers'},
          {title: 'Gadgets', value: 'gadgets'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    // 🚻 Gender
    defineField({
      name: 'gender',
      title: 'Gender',
      type: 'string',
      options: {
        list: [
          {title: 'Women', value: 'women'},
          {title: 'Men', value: 'men'},
          {title: 'Unisex', value: 'unisex'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'women',
    }),

    // 📏 Sizes - Simple array with "Add item" button (iPad friendly!)
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Click "Add item" to add each size (e.g., 6, 8, 10, S, M, L)',
      hidden: ({parent}) => parent?.category !== 'clothing',
    }),

    // 💰 Price
    defineField({
      name: 'price',
      title: 'Price (₵)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'discountPrice',
      title: 'Discount Price (₵)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),

    // 🎨 Colors - Simple array with "Add item" button (iPad friendly!)
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Click "Add item" to add each color (e.g., Red, Black, Blue)',
    }),

    // 🧾 Description
    defineField({
      name: 'description',
      title: 'Product Description',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Rich text description of the product.',
    }),

    // 🚦 Status
    defineField({
      name: 'status',
      title: 'Product Status',
      type: 'string',
      options: {
        list: [
          {title: 'Available', value: 'available'},
          {title: 'Sold', value: 'sold'},
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (Rule) => Rule.required(),
    }),

    // ⭐ Flags
    defineField({
      name: 'isFeatured',
      title: 'Featured Product?',
      type: 'boolean',
      initialValue: false,
    }),

    // 🕒 Dates
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'mainImage',
    },
    prepare(selection) {
      const {title, subtitle, media} = selection
      return {
        title,
        subtitle: subtitle ? subtitle.charAt(0).toUpperCase() + subtitle.slice(1) : '',
        media,
      }
    },
  },
})
