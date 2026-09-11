import * as migration_20260911_205201_initial from './20260911_205201_initial';

export const migrations = [
  {
    up: migration_20260911_205201_initial.up,
    down: migration_20260911_205201_initial.down,
    name: '20260911_205201_initial'
  },
];
