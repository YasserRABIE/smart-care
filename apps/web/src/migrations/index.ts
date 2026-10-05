import * as migration_20261005_182421_initial from './20261005_182421_initial'
import * as migration_20261005_190641_contact_subject_template from './20261005_190641_contact_subject_template'

export const migrations = [
  {
    up: migration_20261005_182421_initial.up,
    down: migration_20261005_182421_initial.down,
    name: '20261005_182421_initial',
  },
  {
    up: migration_20261005_190641_contact_subject_template.up,
    down: migration_20261005_190641_contact_subject_template.down,
    name: '20261005_190641_contact_subject_template',
  },
]
