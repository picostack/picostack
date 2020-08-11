module.exports = {
  sidebar: [
    {
      type: "category",
      label: "Introduction",
      items: ["intro/introduction", "intro/software"],
    },
    {
      type: "category",
      label: "Pico",
      items: [
        "pico/overview",
        "pico/install",
        "pico/getting-started",
        "pico/production",
      ],
    },
    {
      type: "category",
      label: "Reference",
      items: [
        "reference/reference",
        "reference/config-repo",
        "reference/config-secret",
        "reference/configuration",
        "reference/reconfigure",
        "reference/environment-variables",
        "reference/target",
        "reference/docker",
      ],
    },
    {
      type: "category",
      label: "Troubleshooting",
      items: [
        "troubleshooting/git-errors",
        "troubleshooting/pico-errors",
        "troubleshooting/exit-waiting-status",
      ],
    },
  ],
};
