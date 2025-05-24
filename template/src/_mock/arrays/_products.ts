//
import _mock from '../_mock';

// ----------------------------------------------------------------------

const NAME = [
  'Apple iPhone',
  'Samsung Galaxy',
  'Nike Air Max',
  'Adidas Ultraboost',
  'Sony PlayStation',
  'Microsoft Surface',
  'Tesla Model S',
  'Amazon Echo',
  'Google Pixel',
  'Bose QuietComfort',
  'Canon EOS',
  'HP Spectre',
  'LG OLED',
  'Rolex Submariner',
  'Chanel No.5',
  'Louis Vuitton Speedy',
  'Gucci Ace',
  'Ray-Ban Aviator',
  'Herschel Little America',
  'Le Creuset Dutch Oven',
  'Yeti Tumbler',
  'Patagonia Nano Puff',
  'Lululemon Align Leggings',
  'Allbirds Wool Runners',
];

const CATEGORIES = [
  'Electronics',
  'Fashion and Apparel',
  'Home and Garden',
  'Beauty and Personal Care',
  'Health and Wellness',
  'Toys and Games',
  'Sports and Outdoors',
  'Baby and Kids',
  'Automotive and Industrial',
  'Pet Supplies',
  'Food and Beverage',
  'Office and School Supplies',
  'Jewelry and Accessories',
  'Arts and Crafts',
  'Books and Media',
  'Travel and Luggage',
  'Gifts and Flowers',
  'Musical Instruments',
  'Party Supplies',
  'Business and Industrial Supplies',
  'Tools and Hardware',
  'Electronics Accessories',
  'Furniture and Decor',
  'Computer and Software',
];

const DESCRIPTION = `
<p>Aenean viverra rhoncus pede. Etiam feugiat lorem non metus. Quisque malesuada placerat nisl.</p>

<ul>
  <li> Updated with a more matte texture, perfect for casual styling. </li>
  <li> Durable water-repellent coating. </li>
  <li> dsdsds </li>
  <li> dsdsds </li>
  <li> Anti-static lining. </li>
</ul>

<p>Living in today's metropolitan world of cellular phones, mobile computers and other high-tech gadgets is not just hectic but very impersonal. We make money and then invest our time and effort in making more money..</p>
`;

// ----------------------------------------------------------------------

export const _productsTable = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  orderId: `#011120${index + 1}`,
  item: NAME[index],
  deliveryDate: _mock.time(index),
  price: _mock.number.price(index),
  status: ['Completed', 'To Process', 'Cancelled', 'Return'][index] || 'Completed',
}));

// ----------------------------------------------------------------------

export const _productsCarousel = [
  {
    id: _mock.id(0),
    title: 'Discover Our Premium Collection',
    caption: 'Explore our handpicked selection of high-quality products, crafted with care and attention to detail.',
    coverImg: _mock.image.product(0),
    label: 'New Arrivals',
    price: _mock.number.price(0),
  },
  {
    id: _mock.id(1),
    title: 'Exclusive Deals Await',
    caption: 'Unlock special discounts and offers on our most popular items. Limited time only!',
    coverImg: _mock.image.product(1),
    label: 'Special Offers',
    price: _mock.number.price(1),
  },
  {
    id: _mock.id(2),
    title: 'Shop with Confidence',
    caption: 'Enjoy secure payments, fast shipping, and exceptional customer service with every purchase.',
    coverImg: _mock.image.product(2),
    label: 'Trusted Shopping',
    price: _mock.number.price(2),
  },
  {
    id: _mock.id(3),
    title: 'Join Our Community',
    caption: 'Be the first to know about new products, exclusive deals, and special events.',
    coverImg: _mock.image.product(3),
    label: 'Stay Connected',
    price: _mock.number.price(3),
  },
];

// ----------------------------------------------------------------------

export const _productsCompare = [
  'Apple iPhone 12 Pro',
  'Apple iPhone 13 Pro',
  'Apple iPhone 14 Pro',
].map((name, index) => ({
  id: _mock.id(index),
  name,
  price: _mock.number.price(index),
  rating: _mock.number.rating(index),
  coverImg: _mock.image.product(4),
  details: (index === 0 && [
    'Super Retina XDR (OLED)',
    'Up to 29 hours video playback',
    'A14 Bionic',
    'True Tone',
    'IP68',
    '2017',
  ]) || ['Super Retina XDR (OLED)', '', 'A14 Bionic', '', 'IP68', '2017'],
}));

// ----------------------------------------------------------------------

export const _products = [...Array(24)].map((_, index) => ({
  id: _mock.id(index),
  tenant: ['default'],
  owner: 'admin',
  sku: `SKU-${index + 1000}`,
  name: NAME[index],
  base_price: _mock.number.price(index).toString(),
  profit_percentage: 20,
  selling_price: _mock.number.price(index),
  quantity: 100,
  category: CATEGORIES[index],
  is_public: true,
  description: DESCRIPTION,
  short_description: _mock.text.description(index),
  tag: ['sale', 'new', 'featured'],
  brand: 'Brand',
  additional_info: {},
  warranty: '1 year',
  cover_url: _mock.image.product(index),
  images: [
    _mock.image.product(1),
    _mock.image.product(2),
    _mock.image.product(3),
    _mock.image.product(4),
    _mock.image.product(5),
    _mock.image.product(6),
    _mock.image.product(7),
    _mock.image.product(8),
  ],
  colors: ['red', 'blue', 'green'],
  sizes: ['S', 'M', 'L'],
  total_sold: index * 2 + 40,
  total_ratings: index * 2 + 40,
  total_reviews: index * 2 + 40,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));
