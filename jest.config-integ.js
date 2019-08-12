module.exports = {
  preset: 'ts-jest',
  testRegex: '((\\.|/)(integ))\\.[jt]sx?$',
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '/cdk.out/'],
};
