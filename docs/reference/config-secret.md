---
title: Configuration Secret
---

The "configuration secret" is a secret stored in Vault that contains global Pico
configuration parameters that are considered too sensitive for environment
variables or command-line flags.

## Git Credentials

When Pico initialises, if you aren't using SSH for Git authentication, Pico will
read the config secret for `GIT_USERNAME` and `GIT_PASSWORD`. Pico will use
these to pull the [configuration repository](config-repo).

## Global Environment Variables

Any key prefixed with `GLOBAL_` will be passed to every target as an environment
variable. This is useful for log levels, dev/prod switches, feature flags or any
sort of shared credentials and secrets used by many or all targets.
