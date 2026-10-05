import * as migration_20261005_175145_initial from './20261005_175145_initial'

export const migrations = [
  {
    up: migration_20261005_175145_initial.up,
    down: migration_20261005_175145_initial.down,
    name: '20261005_175145_initial',
  },
]
