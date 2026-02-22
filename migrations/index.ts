import * as migration_20260222_121345_initial from './20260222_121345_initial';

export const migrations = [
  {
    up: migration_20260222_121345_initial.up,
    down: migration_20260222_121345_initial.down,
    name: '20260222_121345_initial'
  },
];
