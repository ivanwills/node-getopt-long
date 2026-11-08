export default {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/__tests__/**/*.test.mjs'],
  transform: {
    '^.+\\.m?js$': [
      'babel-jest',
      {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: { node: 'current' },
              modules: 'commonjs',
            },
          ],
        ],
      },
    ],
  },
};
