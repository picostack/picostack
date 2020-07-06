module.exports = {
  title: "Pico Stack",
  tagline:
    "A simple, modern, containerised server stack for small-scale environments.",
  url: "https://pico.sh",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  organizationName: "picostack",
  projectName: "picostack",
  themeConfig: {
    navbar: {
      title: "Pico Stack",
      logo: {
        alt: "Pico Logo",
        src: "img/pico-logo.svg"
      },
      links: [
        {
          to: "docs/intro/introduction",
          activeBasePath: "docs",
          label: "Docs",
          position: "left"
        },
        {
          href: "https://github.com/picostack",
          label: "GitHub",
          position: "right"
        }
      ]
    },
    footer: {
      style: "dark",
      links: [],
      copyright: `Copyright © ${new Date().getFullYear()} Barnaby "Southclaws" Keene. Built with Docusaurus.`
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/picostack/picostack/edit/master/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ],
  "plugins": [
    "docusaurus-lunr-search"
  ]
};
