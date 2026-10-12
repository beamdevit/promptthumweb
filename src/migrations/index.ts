import * as migration_20260911_205201_initial from './20260911_205201_initial';
import * as migration_20260912_104216_portfolio from './20260912_104216_portfolio';
import * as migration_20260925_000000_site_video from './20260925_000000_site_video';
import * as migration_20260925_010000_premium_video from './20260925_010000_premium_video';
import * as migration_20261012_054738_articles from './20261012_054738_articles';

export const migrations = [
  {
    up: migration_20260911_205201_initial.up,
    down: migration_20260911_205201_initial.down,
    name: '20260911_205201_initial',
  },
  {
    up: migration_20260912_104216_portfolio.up,
    down: migration_20260912_104216_portfolio.down,
    name: '20260912_104216_portfolio',
  },
  {
    up: migration_20260925_000000_site_video.up,
    down: migration_20260925_000000_site_video.down,
    name: '20260925_000000_site_video',
  },
  {
    up: migration_20260925_010000_premium_video.up,
    down: migration_20260925_010000_premium_video.down,
    name: '20260925_010000_premium_video',
  },
  {
    up: migration_20261012_054738_articles.up,
    down: migration_20261012_054738_articles.down,
    name: '20261012_054738_articles'
  },
];
