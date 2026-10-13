import * as migration_20260911_205201_initial from './20260911_205201_initial';
import * as migration_20260912_104216_portfolio from './20260912_104216_portfolio';
import * as migration_20260925_000000_site_video from './20260925_000000_site_video';
import * as migration_20260925_010000_premium_video from './20260925_010000_premium_video';
import * as migration_20261012_054738_articles from './20261012_054738_articles';
import * as migration_20261012_061442_site_contact from './20261012_061442_site_contact';
import * as migration_20261012_184253_admin_usability from './20261012_184253_admin_usability';
import * as migration_20261012_190133_site_branding from './20261012_190133_site_branding';
import * as migration_20261012_192116_visitor_analytics from './20261012_192116_visitor_analytics';
import * as migration_20261013_085856_categories from './20261013_085856_categories';
import * as migration_20261013_121504_site_about from './20261013_121504_site_about';

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
    name: '20261012_054738_articles',
  },
  {
    up: migration_20261012_061442_site_contact.up,
    down: migration_20261012_061442_site_contact.down,
    name: '20261012_061442_site_contact',
  },
  {
    up: migration_20261012_184253_admin_usability.up,
    down: migration_20261012_184253_admin_usability.down,
    name: '20261012_184253_admin_usability',
  },
  {
    up: migration_20261012_190133_site_branding.up,
    down: migration_20261012_190133_site_branding.down,
    name: '20261012_190133_site_branding',
  },
  {
    up: migration_20261012_192116_visitor_analytics.up,
    down: migration_20261012_192116_visitor_analytics.down,
    name: '20261012_192116_visitor_analytics',
  },
  {
    up: migration_20261013_085856_categories.up,
    down: migration_20261013_085856_categories.down,
    name: '20261013_085856_categories',
  },
  {
    up: migration_20261013_121504_site_about.up,
    down: migration_20261013_121504_site_about.down,
    name: '20261013_121504_site_about'
  },
];
