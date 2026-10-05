import * as migration_20261005_182421_initial from './20261005_182421_initial'

export const migrations = [
  {
    up: migration_20261005_182421_initial.up,
    down: migration_20261005_182421_initial.down,
    name: '20261005_182421_initial',
  },
]
