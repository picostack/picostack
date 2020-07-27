---
title: Pico Configuration
---

The precursor to Pico used JSON for configuration, this was fine for simple
tasks but the ability to provide a little bit of logic and variables for
repetitive configurations is very helpful. Inspired by [StackExchange's
dnscontrol][dnscontrol], Pico uses a secure and isolated ECMAScript 2015 VM as a
configuration engine. This provides a JSON-like environment with the added
benefit of conditional logic.

## Files

When Pico reads the config repo, it will load all files with a `.js` extension
in the root directory (not subdirectories). It then passes these source files
into the _configuration engine_ sorted by filename.

## Config Example

Pico's configuration engine exposes a simple set of declarative functions that
represent components of the desired state.

Here's an example of a simple configuration that tells Pico to:

- Expose an environment variable to all targets
- Create an authentication method named `github`
- Create and track a target at `github.com/mycompany/some-app`
- Run `docker-compose up -d` whenever that target is committed to

```js
// An Environment Variable object
//
// Creates an environment variable named `MOUNT_POINT` for every deployment with
// the value `/data`. This is useful for deployment-wide variables that don't
// change often and are not considered sensitive.
//
E("MOUNT_POINT", "/data");

// An Auth object
//
// Creates a named authentication method which can be used with any target. Note
// that there are no actual credentials here as it's impossible to specify them
// in this configuration file. Instead, you provide it with a path within the
// secrets engine and keys for the username and password. This enforces that all
// credentials for accessing repositories is stored securely, outside of
// configuration files and outside of version control.
//
A({
  name: "gitlab",
  path: "/pico",
  user_key: "GIT_USERNAME",
  pass_key: "GIT_PASSWORD",
});

// A Target object
//
// Declares a named target repository to track using the `github` authentication
// method. It will pull from the `dev` branch and run `docker-compose up -d`
// when new commits are pushed. If this target is removed from the configuration
// file, Pico will run `docker-compose down` before removing the target.
//
T({
  name: "my_app",
  url: "https://github.com/mycompany/some-app",
  branch: "dev",
  up: ["docker-compose", "up", "-d"],
  down: ["docker-compose", "down"],
  auth: "github",
});
```

## Reference

### The `A` Function

All properties are required.

| Property   | Type (TypeScript notation) | Purpose                                                                                                           |
| ---------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `name`     | `string`                   | Name of the auth method.                                                                                          |
| `path`     | `string`                   | Path within the secret store where the username/password are stored, relative to the Pico `vault-path` base path. |
| `user_key` | `string`                   | Key for username                                                                                                  |
| `pass_key` | `string`                   | Key for password                                                                                                  |

Authentication methods can be declared at any point in a config repo (the order
does not matter.)

#### Auth Example

For example, say you have the following Vault setup, with `vault-path` set to
`/secret`:

```sh
❯ vault kv list secret/
Keys
----
pico
```

There's a secret named `pico`, it has the following contents:

```sh
❯ vault kv get secret/pico
====== Metadata ======
Key              Value
---              -----
created_time     2020-04-05T14:18:34.9297555Z
deletion_time    n/a
destroyed        false
version          1

======== Data ========
Key             Value
---             -----
GIT_PASSWORD    password123
GIT_USERNAME    pico_token
```

To use these credentials to pull targets, the following authentication method
declaration would work:

```js
A({
  name: "my_org_github",
  path: "pico",
  user_key: "GIT_USERNAME",
  pass_key: "GIT_PASSWORD",
});
```

This tells Pico: whenever it needs to pull or clone any target that uses the
`my_org_github` auth, to look up the Git HTTP Basic Auth username and password
in a secret at `secret/pico` under the keys `GIT_USERNAME` and `GIT_PASSWORD`.

Secrets are looked up for every use and not cached anywhere in Pico's memory or
on disk. This means two things: secrets are always securely stored within Vault
and secrets may be changed without the need to restart Pico.

### The `T` Function

Expects an object with the following properties:

| Property              | Type (TypeScript notation) | Purpose                                                                                            |
| --------------------- | -------------------------- | -------------------------------------------------------------------------------------------------- |
| `name` (**required**) | `string`                   | A label for the target - this is used as a directory name so it must be valid for your OS.         |
| `url` (**required**)  | `string`                   | The repository URL to watch for changes, either http or ssh.                                       |
| `branch`              | `string`                   | The git branch to use. This will also be appended (after a `_`) to the target directory path.      |
| `up` (**required**)   | `Array<string>`            | The command to run on each new Git commit.                                                         |
| `down`                | `Array<string>`            | Down specifies the command to run during either a graceful shutdown or when the target is removed. |
| `env`                 | `[name: string]: string`   | Environment variables associated with the target - do not store credentials here!                  |
| `initial_run`         | `boolean`                  | Whether or not to run `Command` on first run, useful if the command is `docker-compose up`.        |
| `auth`                | `string`                   | Authentication method to use from the auth store.                                                  |

The `T` function declares a "Target" which is essentially a Git repository. In
this example, the repository `https://github.com/mycompany/some-app` would
contain a `docker-compose.yml` file for some application stack. Every time you
make a change to this file and push it, Pico will pull the new version and run
the command defined in the `up` attribute of the target, which is
`docker-compose up -d`.

You can put as many target declarations as you want in the config file, and as
many config files as you want in the config repo. You can also use variables to
cut down on repeated things:

```js
var GIT_HOST = "https://github.com/mycompany/";
T({
  name: "my_app",
  url: GIT_HOST + "my-docker-compose-project",
  up: ["docker-compose", "up", "-d"],
});
```

Or, if you have a ton of Docker Compose projects and they all live on the same
Git host, why not declare a function that does all the hard work:

```js
var GIT_HOST = "https://github.com/mycompany/";

function Compose(name) {
  return {
    name: name,
    url: GIT_HOST + name,
    up: ["docker-compose", "up", "-d"],
  };
}

T(Compose("homepage"));
T(Compose("todo-app"));
T(Compose("world-domination-scheme"));
```

### The `E` Function

| Argument | Type (TypeScript notation) | Purpose                                       |
| -------- | -------------------------- | --------------------------------------------- |
| `key`    | `string`                   | The name of the environment variable.         |
| `value`  | `string`                   | The value stored in the environment variable. |

This declares an environment variable that will be passed to the `up` and `down`
commands for all targets.

For example:

```js
E("MOUNT_POINT", "/data");
T({ name: "postgres", url: "...", up: "docker-compose", "up", "-d" });
```

This would pass the environment variable `MOUNT_POINT=/data` to the
`docker-compose` invocation. This is useful if you have a bunch of compose
configs that all mount data to some path on the machine, you then use
`${MOUNT_POINT}/postgres:/var/lib/postgres/data` as a volume declaration in your
`docker-compose.yml`.
