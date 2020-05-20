---
title: Git Errors
---

Sometimes, the local repositories Pico uses (either
[configuration](../reference/config-repo) or [targets](../reference/target)) can
get into a bad state and Pico's internal Git client won't pull new commits. A
lot of these corner cases are being actively ironed out, however you can
manually resolve these issues if you need a quick fix. In the event you do run
into one of these problems,
[please open an issue](https://github.com/picostack/pico/issues)!

Common causes for these problems are things like force-pushing Git tree changes
and local repositories becoming dirty somehow (log files etc).

## Solution

Simply deleting a repository fixes most Git state issues. You don't need to
restart Pico after doing this. Pico will automatically re-clone a missing
repository.

If you delete the configuration repository, Pico will clone a new one and emit a
[reconfigure event](../reference/reconfigure) and reconcile its internal state.

If you delete a target repository, Pico will clone a new one and run the `up`
command for that target.
