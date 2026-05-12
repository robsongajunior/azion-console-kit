const isMain = process.env.GITHUB_REF_NAME === 'main'

const commitAnalyzer = [
  '@semantic-release/commit-analyzer',
  {
    preset: 'conventionalcommits',
    releaseRules: [
      { type: 'feat', release: 'minor' },
      { type: 'fix', release: 'patch' },
      { type: 'perf', release: 'patch' },
      { breaking: true, release: 'major' }
    ]
  }
]

const releaseNotes = [
  '@semantic-release/release-notes-generator',
  {
    preset: 'conventionalcommits',
    presetConfig: {
      types: [
        { type: 'feat', section: 'Features' },
        { type: 'fix', section: 'Bug Fixes' },
        { type: 'perf', section: 'Performance Improvements' },
        { type: 'chore', hidden: true },
        { type: 'docs', hidden: true },
        { type: 'style', hidden: true },
        { type: 'refactor', hidden: true },
        { type: 'test', hidden: true }
      ]
    }
  }
]

const changelog = [
  '@semantic-release/changelog',
  {
    changelogFile: 'CHANGELOG.md',
    changelogTitle: '# Changelog'
  }
]

const npm = ['@semantic-release/npm', { npmPublish: false }]

const git = [
  '@semantic-release/git',
  {
    assets: ['package.json', 'CHANGELOG.md'],
    message: 'chore(release): ${nextRelease.version} [skip ci]'
  }
]

const github = [
  '@semantic-release/github',
  {
    draftRelease: false,
    releaseNameTemplate: 'v${nextRelease.version}',
    successComment: false,
    failCommentCondition: false
  }
]

// On `next`, skip changelog + git plugins so the branch never commits
// release artifacts (package.json / CHANGELOG.md). This keeps next → main
// merges clean — only main owns those files.
export default {
  tagFormat: '${version}',
  branches: [
    { name: 'main' },
    { name: 'next', channel: 'next', prerelease: 'rc' }
  ],
  plugins: [
    commitAnalyzer,
    releaseNotes,
    ...(isMain ? [changelog] : []),
    npm,
    ...(isMain ? [git] : []),
    github
  ]
}
