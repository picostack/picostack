---
title: Configuration Repo
---

The "configuration repository" or "config repo" is the repository that
configures how Pico runs. One instance of Pico only has exactly one config repo.
It's specified as the argument to the `run` subcommand.

```sh
pico run https://github.com/mycompany/config.git
```

This will run Pico using the repository `config` in the `mycompany` namespace.

Pico will then pull the repo whenever it receives commits and search for Pico
configuration files and apply them. This is called a [Reconfigure](reconfigure)
event.

See the [Pico Configuration documentation](configuration) for a full overview of
the configuration specification.
