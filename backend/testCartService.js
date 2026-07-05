const cartService = require('./src/services/cartService');

const sampleCart = [
  { productId: 2, quantity: 1 },
  { productId: 4, quantity: 2 },
  { productId: 999, quantity: 1 }
];

console.log('productExists 2:', cartService.productExists(2));
console.log('productExists 999:', cartService.productExists(999));
console.log('getProduct 4:', cartService.getProduct(4));
console.log('\nCart products:');
console.log(cartService.getCartProducts(sampleCart));
console.log('\nTotal:', cartService.calculateTotal(sampleCart));
