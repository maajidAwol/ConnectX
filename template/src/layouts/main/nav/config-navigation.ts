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
      { title: 'Login Cover', path: paths.auth.loginCover },
      { title: 'Login Illustration', path: paths.auth.loginIllustration },
      { title: 'Login Background', path: paths.auth.loginBackground },
      { title: 'Register Cover', path: paths.auth.registerCover },
      { title: 'Register Illustration', path: paths.auth.registerIllustration },
      { title: 'Register Background', path: paths.auth.registerBackground },
      { title: 'Reset Password', path: paths.auth.resetPassword },
      { title: 'Verify Code', path: paths.auth.verifyCode },
    ],
  },
];

export const navConfig = [
  { title: 'Home', path: '/' },
  { title: 'About', path: '/about' },
  { title: 'Contact Us', path: '/contact' },
  { title: 'Shop Now', path: paths.products },
];