---
title: Targets
---

A Target is a repository that holds your application code or scripts. The
[configuration](configuration) specifies targets to track. When a target
repository receives a new commit, Pico will pull it and run the command
specified in its configuration block for that target.

Pico works great with declarative tools like Docker Compose or dnscontrol. For
example, say you have a web application with a `Dockerfile` and a
`docker-compose.yml` file, you can create a Target in the configuration like so:

```js
T({
  name: "my_app",
  url: "https://github.com/mycompany/some-app",
  branch: "dev",
  up: ["docker-compose", "up", "-d", "--build"],
});
```

And every time you commit changes to your project, Pico will pull the changes
and then run:

```sh
docker-compose up -d --build
```

Inside that repository - building your application and updating the running
container.

## Target Repository Storage

Repositories are stored on the filesystem in a directory specified by the
`--directory` flag. They are just regular Git repositories so you can manually
run Git commands inside them if you want to.

:::info

Rolling back the history of a target by running Git commands in the directory
will have no effect. Pico works by repeatedly pulling a Git repository and
checking for changes.

:::

:::caution

Getting a repository into "detached head" state will cause Pico to error when
checking the repository. It will not stop Pico from running, but the target will
cease to be triggered until the state is returned to normal.

The best way to do this is to simply delete the local copy of the repository.

:::

### Branches

If you specified a branch as part of the `T` call in
[configuration](configuration) then this branch name will be appended to the
repository directory path after an underscore (`_`).

For example:

```js
T({
  name: "test",
  url: "https://github.com/mycompany/some-app",
  branch: "dev",
  up: ["docker-compose", "up", "-d", "--build"],
});
```

And assuming your `--directory` was set to `/cache` the repository would be
stored at:

```
/cache/test_dev`
```

Omitting the `branch` field entirely will default to `master` and will not
result in any path suffix.
