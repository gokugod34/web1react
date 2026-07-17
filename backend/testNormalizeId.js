const normalizeId = require('./src/utils/normalizeId');

const cases = [
  { input: 'abc', label: 'invalid string' },
  { input: '999', label: 'nonexistent product' },
  { input: '3', label: 'valid product' },
  { input: 4, label: 'valid numeric' }
];

cases.forEach(test => {
  console.log(test.label, normalizeId(test.input));
});
