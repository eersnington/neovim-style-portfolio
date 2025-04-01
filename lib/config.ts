export interface Link {
  id: string;
  title: string;
  url: string;
  keybind: string;
  icon?: string;
}

export interface Config {
  pageTitle: string;
  // Homepage title and subtitle
  title: string;
  subtitle: string;

  // Navigation links
  links: Link[];

  // Keyboard shortcuts
  keybinds: {
    help: string;
    toggleTheme: string;
    escape: string;
  };
}

const config: Config = {
  pageTitle: "Sree N | @eersnington",
  title: "Sree N",
  subtitle: "TypeScript & Go SWE | Developing apps for 8yrs+",

  links: [
    {
      id: "github",
      title: "GitHub",
      url: "https://github.com/eersnington",
      keybind: "ggh",
    },
    {
      id: "twitter",
      title: "Twitter",
      url: "https://twitter.com/eersnington",
      keybind: "gx",
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      url: "https://www.linkedin.com/in/sreenington",
      keybind: "gli",
    },
    {
      id: "youtube",
      title: "YouTube",
      url: "https://youtube.com/@CrazyDanTHEMinecrafter",
      keybind: "gyt",
    },
    {
      id: "email",
      title: "Contact Me",
      url: "mailto:sreeaadhi07@gmail.com",
      keybind: "gcm",
    },
  ],

  keybinds: {
    help: "?", // Will be detected with Shift key in the handler
    toggleTheme: "T", // Capital T represents Shift+t
    escape: "Escape",
  },
};

export default config;
