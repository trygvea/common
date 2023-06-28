module.exports = {
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    [
      '@semantic-release/npm',
      {
        tarballDir: 'release',
        pkgRoot: 'packages/config-loader',
      },
    ],
    [
      '@semantic-release/npm',
      {
        tarballDir: 'release',
        pkgRoot: 'packages/schemas',
      },
    ],
    [
      '@semantic-release/npm',
      {
        tarballDir: 'release',
        pkgRoot: 'packages/utils',
      },
    ],
    [
      '@semantic-release/npm',
      {
        tarballDir: 'release',
        pkgRoot: 'packages/validators',
      },
    ],
    [
      '@semantic-release/github',
      {
        assets: 'release/*.tgz',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'packages/config-loader',
          'packages/schemas',
          'packages/utils',
          'packages/validators',
        ],
      },
    ],
  ],
  preset: 'angular',
  branches: [{ name: 'master' }, { name: 'next', prerelease: true }],
};
