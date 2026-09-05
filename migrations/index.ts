import * as migration_20260222_121345_initial from './20260222_121345_initial';
import * as migration_20260903_205755_css_redesign from './20260903_205755_css_redesign';
import * as migration_20260905_120000_artikelbyline from './20260905_120000_artikelbyline';

export const migrations = [
  {
    up: migration_20260222_121345_initial.up,
    down: migration_20260222_121345_initial.down,
    name: '20260222_121345_initial',
  },
  {
    up: migration_20260903_205755_css_redesign.up,
    down: migration_20260903_205755_css_redesign.down,
    name: '20260903_205755_css_redesign'
  },
  {
    up: migration_20260905_120000_artikelbyline.up,
    down: migration_20260905_120000_artikelbyline.down,
    name: '20260905_120000_artikelbyline',
  },
];
