import * as migration_20260911_205201_initial from './20260911_205201_initial';
import * as migration_20260912_104216_portfolio from './20260912_104216_portfolio';
import * as siteVideo from './20260925_000000_site_video';

export const migrations = [
  {
    up: migration_20260911_205201_initial.up,
    down: migration_20260911_205201_initial.down,
    name: '20260911_205201_initial',
  },
  {
    up: migration_20260912_104216_portfolio.up,
    down: migration_20260912_104216_portfolio.down,
    name: '20260912_104216_portfolio'
  },
  { up: siteVideo.up, down: siteVideo.down, name: '20260925_000000_site_video' },
];
