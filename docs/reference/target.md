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
