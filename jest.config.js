module.exports = {
  preset: 'ts-jest',
  coverageDirectory: '/tmp/jest_coverage',
  testRegex: '((\\.|/)(test))\\.[jt]sx?$',
  testPathIgnorePatterns: ['/public/', '/public-app/', '/dist/', '/node_modules/', '/cdk.out/'],
  modulePathIgnorePatterns: ['/cdk.out/', '/layers/'],
};
