import {defineType, defineField} from 'sanity'

export const order = defineType({
  name: 'order',
  title: 'Orders',
  type: 'document',

  fields: [
    // 🆔 Order ID
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      description: 'Unique order identifier (e.g., ORD-20250101-ABCD)',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),

    // 👤 Customer Information
    defineField({
      name: 'customerInfo',
      title: 'Customer Information',
      type: 'object',
      fields: [
        {
          name: 'fullName',
          title: 'Full Name',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          description: 'Optional - for order updates',
        },
        {
          name: 'userId',
          title: 'User ID (Clerk)',
          type: 'string',
          description: 'Clerk user ID if signed in, null for guest',
        },
      ],
    }),

    // 📍 Delivery Information
    defineField({
      name: 'deliveryInfo',
      title: 'Delivery Information',
      type: 'object',
      fields: [
        {
          name: 'region',
          title: 'Region',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'city',
          title: 'City/Town',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'address',
          title: 'Delivery Address/Landmark',
          type: 'text',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // 🛒 Order Items
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{type: 'product'}],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'productSnapshot',
              title: 'Product Snapshot',
              type: 'object',
              description: 'Product details at time of order',
              fields: [
                {name: 'name', type: 'string'},
                {name: 'price', type: 'number'},
                {name: 'discountPrice', type: 'number'},
                {name: 'mainImageUrl', type: 'string'},
                {name: 'size', type: 'string'},
                {name: 'color', type: 'string'},
              ],
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            },
            {
              name: 'priceAtPurchase',
              title: 'Price at Purchase',
              type: 'number',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              productName: 'productSnapshot.name',
              quantity: 'quantity',
              price: 'priceAtPurchase',
            },
            prepare({productName, quantity, price}) {
              return {
                title: `${productName} x${quantity}`,
                subtitle: `₵${(price * quantity).toFixed(2)}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    // 💰 Order Pricing
    defineField({
      name: 'pricing',
      title: 'Pricing',
      type: 'object',
      fields: [
        {
          name: 'itemsTotal',
          title: 'Items Total',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
          description: 'Total cost of items (paid upfront)',
        },
        {
          name: 'discount',
          title: 'Discount',
          type: 'number',
          initialValue: 0,
        },
        {
          name: 'itemsTotalAfterDiscount',
          title: 'Items Total After Discount',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
          description: 'Amount customer paid for items',
        },
        {
          name: 'estimatedDeliveryFee',
          title: 'Estimated Delivery Fee',
          type: 'number',
          validation: (Rule) => Rule.required().min(0),
          description: 'Initial delivery fee estimate',
        },
        {
          name: 'confirmedDeliveryFee',
          title: 'Confirmed Delivery Fee',
          type: 'number',
          description: 'Actual delivery fee (to be paid on delivery)',
        },
      ],
    }),

    // 💳 Items Payment (Upfront via MoMo/Card)
    defineField({
      name: 'itemsPayment',
      title: 'Items Payment',
      type: 'object',
      fields: [
        {
          name: 'method',
          title: 'Payment Method',
          type: 'string',
          options: {
            list: [
              {title: 'Mobile Money', value: 'mobile_money'},
              {title: 'Card (Visa/Mastercard)', value: 'card'},
            ],
          },
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'status',
          title: 'Payment Status',
          type: 'string',
          options: {
            list: [
              {title: 'Pending', value: 'pending'},
              {title: 'Paid', value: 'paid'},
              {title: 'Failed', value: 'failed'},
              {title: 'Refunded', value: 'refunded'},
            ],
          },
          initialValue: 'pending',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'paystackReference',
          title: 'Paystack Reference',
          type: 'string',
          description: 'Paystack transaction reference',
        },
        {
          name: 'amount',
          title: 'Amount Paid',
          type: 'number',
          description: 'Amount paid for items',
        },
        {
          name: 'paidAt',
          title: 'Paid At',
          type: 'datetime',
        },
      ],
    }),

    // 💵 Delivery Fee Payment (On Delivery)
    defineField({
      name: 'deliveryPayment',
      title: 'Delivery Fee Payment',
      type: 'object',
      fields: [
        {
          name: 'method',
          title: 'Payment Method',
          type: 'string',
          options: {
            list: [
              {title: 'Cash', value: 'cash'},
              {title: 'Mobile Money', value: 'mobile_money'},
            ],
          },
          description: 'How delivery fee will be paid',
        },
        {
          name: 'status',
          title: 'Status',
          type: 'string',
          options: {
            list: [
              {title: 'Pending', value: 'pending'},
              {title: 'Paid', value: 'paid'},
            ],
          },
          initialValue: 'pending',
        },
        {
          name: 'amount',
          title: 'Amount Paid',
          type: 'number',
          description: 'Delivery fee paid on delivery',
        },
        {
          name: 'paidAt',
          title: 'Paid At',
          type: 'datetime',
        },
      ],
    }),

    // 🚚 Delivery Status
    defineField({
      name: 'deliveryStatus',
      title: 'Delivery Status',
      type: 'string',
      options: {
        list: [
          {title: 'Payment Pending', value: 'payment_pending'},
          {title: 'Payment Received', value: 'payment_received'},
          {title: 'Confirmed', value: 'confirmed'},
          {title: 'Preparing for Delivery', value: 'preparing'},
          {title: 'Out for Delivery', value: 'out_for_delivery'},
          {title: 'Delivered', value: 'delivered'},
          {title: 'Cancelled', value: 'cancelled'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'payment_pending',
      validation: (Rule) => Rule.required(),
    }),

    // 📞 Order Confirmation
    defineField({
      name: 'confirmation',
      title: 'Order Confirmation',
      type: 'object',
      fields: [
        {
          name: 'isConfirmed',
          title: 'Order Confirmed?',
          type: 'boolean',
          initialValue: false,
          description: 'Has the order been confirmed with customer?',
        },
        {
          name: 'confirmedBy',
          title: 'Confirmed By',
          type: 'string',
          description: 'Staff member who confirmed the order',
        },
        {
          name: 'confirmedAt',
          title: 'Confirmed At',
          type: 'datetime',
        },
        {
          name: 'deliveryDateAgreed',
          title: 'Agreed Delivery Date',
          type: 'datetime',
          description: 'Date agreed with customer for delivery',
        },
        {
          name: 'deliveryFeeConfirmed',
          title: 'Delivery Fee Confirmed?',
          type: 'boolean',
          initialValue: false,
          description: 'Has actual delivery fee been confirmed with customer?',
        },
      ],
    }),

    // 📝 Notes
    defineField({
      name: 'customerNotes',
      title: 'Customer Notes',
      type: 'text',
      description: 'Special instructions from customer',
    }),

    defineField({
      name: 'adminNotes',
      title: 'Admin/Delivery Notes',
      type: 'text',
      description: 'Internal notes - delivery instructions, location details, etc.',
    }),

    // 🕒 Timestamps
    defineField({
      name: 'createdAt',
      title: 'Order Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
    }),

    defineField({
      name: 'deliveredAt',
      title: 'Delivered At',
      type: 'datetime',
    }),
  ],

  preview: {
    select: {
      orderId: 'orderId',
      customerName: 'customerInfo.fullName',
      itemsTotal: 'pricing.itemsTotalAfterDiscount',
      paymentStatus: 'itemsPayment.status',
      deliveryStatus: 'deliveryStatus',
      createdAt: 'createdAt',
    },
    prepare({orderId, customerName, itemsTotal, paymentStatus, deliveryStatus, createdAt}) {
      const date = new Date(createdAt).toLocaleDateString('en-GB')
      const paymentIcon = paymentStatus === 'paid' ? '✓' : '⏳'
      return {
        title: `${paymentIcon} ${orderId} - ${customerName}`,
        subtitle: `₵${itemsTotal?.toFixed(2)} • ${deliveryStatus} • ${date}`,
      }
    },
  },

  orderings: [
    {
      title: 'Newest First',
      name: 'createdAtDesc',
      by: [{field: 'createdAt', direction: 'desc'}],
    },
    {
      title: 'Unpaid Orders',
      name: 'unpaid',
      by: [{field: 'itemsPayment.status', direction: 'asc'}],
    },
    {
      title: 'By Delivery Status',
      name: 'deliveryStatus',
      by: [{field: 'deliveryStatus', direction: 'asc'}],
    },
  ],
})
