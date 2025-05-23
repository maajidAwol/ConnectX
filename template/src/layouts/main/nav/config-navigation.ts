// routes
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export const pageLinks = [
  {
    isNew: true,
    order: '1',
    subheader: 'E-commerce',
    cover: '/assets/images/menu/menu_ecommerce.jpg',
    items: [
      { title: 'Landing', path: paths.eCommerce.landing },
      { title: 'Products', path: paths.eCommerce.products },
      { title: 'Product', path: paths.eCommerce.product },
      { title: 'Cart', path: paths.eCommerce.cart },
      { title: 'Checkout', path: paths.eCommerce.checkout },
      { title: 'Order Completed', path: paths.eCommerce.orderCompleted },
      { title: 'Wishlist', path: paths.eCommerce.wishlist },
      { title: 'Compare', path: paths.eCommerce.compare },
      { title: 'Account Personal', path: paths.eCommerce.account.personal },
      { title: 'Account Wishlist', path: paths.eCommerce.account.wishlist },
      { title: 'Account Vouchers', path: paths.eCommerce.account.vouchers },
      { title: 'Account Orders', path: paths.eCommerce.account.orders },
      { title: 'Account Payment', path: paths.eCommerce.account.payment },
    ],
  },
  {
    order: '2',
    subheader: 'Common',
    items: [
      { title: 'Login Cover', path: paths.loginCover },
      { title: 'Login Illustration', path: paths.loginIllustration },
      { title: 'Login Background', path: paths.loginBackground },
      { title: 'Register Cover', path: paths.registerCover },
      { title: 'Register Illustration', path: paths.registerIllustration },
      { title: 'Register Background', path: paths.registerBackground },
      { title: 'Reset Password', path: paths.resetPassword },
      { title: 'Verify Code', path: paths.verifyCode },
      { title: '404 Error', path: paths.page404 },
      { title: '500 Error', path: paths.page500 },
      { title: 'Maintenance', path: paths.maintenance },
      { title: 'ComingSoon', path: paths.comingsoon },
      { title: 'Pricing 01', path: paths.pricing01 },
      { title: 'Pricing 02', path: paths.pricing02 },
      { title: 'Payment', path: paths.payment },
      { title: 'Support', path: paths.support },
    ],
  },
];

export const navConfig = [
  { title: 'Home', path: '/' },
  { title: 'About Us', path: '/about' },
  { title: 'Contact Us', path: '/contact' },
  { title: 'Become a Merchant', path: '/merchant' },
  { title: 'Products', path: paths.products },
];