const service = require('./src/services/productService');

console.log('=== findAll (first 5) ===');
console.log(service.findAll().slice(0,5));

console.log('\n=== findById 3 ===');
console.log(service.findById(3));

console.log('\n=== findByCategory Electrónica ===');
console.log(service.findByCategory('Electrónica'));

console.log('\n=== search "Mochila" ===');
console.log(service.search('Mochila'));

console.log('\n=== sortByPrice desc (first 5) ===');
console.log(service.sortByPrice('desc').slice(0,5));

console.log('\n=== getRelated product 2 ===');
console.log(service.getRelated(2));

console.log('\n=== getSuggested (limit 5) ===');
console.log(service.getSuggested(5));
