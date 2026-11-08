export default {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'ts', 'json', 'node'],
  transform: {
    '^.+\\.[cm]?[jt]s$': [
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
          '@babel/preset-typescript',
        ],
      },
    ],
  },
};
