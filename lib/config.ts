import type { Config } from './types';

const config: Config = {
  pageTitle: 'Sree N | @eersnington',
  title: 'Sree',
  subtitle: 'SWE @ StockPenguins | I like breaking web and building games',

  links: [
    {
      id: 'github',
      title: 'GitHub',
      url: 'https://github.com/eersnington',
      keybind: 'ggh',
    },
    {
      id: 'twitter',
      title: 'Twitter',
      url: 'https://twitter.com/eersnington',
      keybind: 'gx',
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/sreenington',
      keybind: 'gli',
    },
    {
      id: 'youtube',
      title: 'YouTube',
      url: 'https://youtube.com/@CrazyDanTHEMinecrafter',
      keybind: 'gyt',
    },
    {
      id: 'email',
      title: 'Contact Me',
      url: 'mailto:hi@eers.dev',
      keybind: 'gcm',
    },
  ],

  keybinds: {
    help: '?', // Will be detected with Shift key in the handler
    toggleTheme: 'T', // Capital T represents Shift+t
    escape: 'Escape',
  },
};

export default config;
