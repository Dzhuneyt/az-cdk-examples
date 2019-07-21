module.exports = {
  preset: 'ts-jest',
  coverageDirectory: '/tmp/jest_coverage',
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '/cdk.out/'],
};
