import * as migration_20261005_182421_initial from './20261005_182421_initial'
import * as migration_20261005_190641_contact_subject_template from './20261005_190641_contact_subject_template'
import * as migration_20261005_192638_map_location from './20261005_192638_map_location'

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
  {
    up: migration_20261005_192638_map_location.up,
    down: migration_20261005_192638_map_location.down,
    name: '20261005_192638_map_location',
  },
]
