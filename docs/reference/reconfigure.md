---
title: Reconfigure Events
---

A Reconfigure is when Pico receives a commit in the
[Configuration Repository](config-repo) and configures itself again at runtime.

During a reconfigure, no new events are processed. Though, configuration does
not take very long so it's unlikely any events will be received anyway.

## The Process

When config is updated, Pico will first execute the configuration in the
configuration engine to validate it and build a new config object.

If the validation fails for any reason, Pico logs an error and stops here. The
original configuration remains in-place and its up to you to fix the issues and
push new config. There's no need to ever restart Pico in this situation, simply
analyse the error, resolve it and push again - Pico will keep trying new
commits.

If the validation succeeds, Pico then runs a differential algorithm against the
current config and the new config. It will build a list of newly added targets
and targets that have been removed.

Now it has those two lists, it will:

1. Shut down all removed targets using their `down` commands (if present)
2. Stand up all added targets using their `up` commands

Any failures are logged but do not stop the process. A failure at this point is
a failure in the target, not Pico itself, so there's no reason to stop and
prevent other targets from being executed successfully.

The new config is then committed into Pico's internal state and Pico returns to
waiting for:

1. Configuration repository commits
2. Target repository commits

And the cycle begins again, as soon as the configuration repository is updated.
