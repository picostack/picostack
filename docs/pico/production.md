---
title: Production Deployment
---

This guide will walk you through a production-ready deployment of Pico. This
includes a [Vault](https://vaultproject.io) server that Pico will use to safely
pass credentials to its [targets](../reference/target).

For the purposes of a full deployment, this guide will also include deploying
the [Pico Core Stack](https://github.com/picostack/core) which is a curated
collection of containerised software for monitoring your system.

## Before You Start

If you do deploy the Core Stack, you'll need a publically accessible domain
name.

:::note

Whenever you see `example.com` replace it with your own domain name. These will
be highlighted in code blocks:

```yaml {3}
some:
  config:
    - domain.example.com
  more:
    config:
      - ...
```

:::

If you're working in a non-public environment with an internal DNS, you can
deploy the Core Stack without LetsEncrypt SSL enabled. You'll need to fork the
[picostack/core](https://github.com/picostack/core) repository and modify it
according to the Traefik documentation to disable LetsEncrypt SSL or set up
self-signed certificates from an internal certificate authority.

:::tip

If you want to fully securely deploy without risking putting anything on the
host machine, make use of
[Docker Contexts](https://docs.docker.com/engine/context/working-with-contexts/)
to securely deploy Pico and Vault from your local machine. This ensures
environment variables are transmitted directly to the container and never stored
in a `.env` file or in the shell's prompt or history.

:::

## Create a Gateway Network

First, you need a named, non-internal gateway network for allowing external
access to containers.

```sh
docker network create \
    --driver=bridge \
    --attachable \
    --internal=false \
    gateway
```

## Deploy Vault

:::warning

The Vault section of this guide is _very brief_ and covers just enough to get a
running, secure instance online. It _may_ become outdated as newer Vault
versions are released and you are advised to refer to the official Vault
documentation.

Vault is also a very complex piece of enterprise-grade software. Take some time
to learn the concepts and terminology. Especially if you are granting access to
multiple people on your team through the use of groups and policies.

Check out [this](https://learn.hashicorp.com/vault/getting-started/install)
tutorial to get started with Vault.

:::

You can deploy Vault and Pico onto the same machine, but it's advised to have
Vault running elsewhere as it's a critical point of failure. If Vault goes down,
it must be manually restarted whereas if Pico and its targets go down, they can
be brought back automatically. Having them on separate machines makes this more
resilient.

Use the following Docker Compose configuration to stand up a Vault instance.

```yaml {23}
version: "3.5"

networks:
  default:
    external:
      name: gateway

services:
  vault:
    image: vault
    entrypoint:
      - vault
      - server
      - -config=/vault/config/config.hcl
    volumes:
      - ${DATA_DIR}/vault/file:/vault/file
      - ./vault.hcl:/vault/config/config.hcl
    cap_add:
      - IPC_LOCK
    ports:
      - 8200:8200
    networks:
      - default
    labels:
      traefik.enable: true
      traefik.docker.network: gateway
      traefik.http.routers.vault.rule: Host(`vault.${DOMAIN_NAME}`)
      traefik.http.routers.vault.entrypoints: https
      traefik.http.routers.vault.tls.certresolver: default
```

And you need a Vault configuration:

```hcl
storage "file" {
  path = "/vault/file"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}

ui = true
```

Once these are in a directory, run:

```sh
docker-compose up -d
```

If your domain points to the machine you are deploying to, ensure port `8200` is
open and visit `example.com:8200` in your browser to confirm the deployment was
successful.

Note the Traefik labels, these allow Traefik to route requests here.

[This](https://learn.hashicorp.com/vault/getting-started/deploy#initializing-the-vault)
part of the Vault guide will guide you through the initialisation part. Here,
you set up your master keys and root token.

### Set Up User Access

Create an `administrator` policy so you don't need to use root all the time. See
[this](https://learn.hashicorp.com/vault/getting-started/policies) page for more
information about policies.

Enable the `userpass` Auth Method, this will allow users to log in with a
username and a password. You can also skip this and use a different method such
as SSO.

Now you can add a user for yourself and your team members. See the users,
entities and aliases documentation for more information. Either add the
`administrator` policy to users or create a group with the `administrator`
policy and add users to that group.

### Activate `kv` Secret Engine

Activate the `kv` secret engine using v2 by clicking "Enable new engine" on the
main dashboard. Select "KV" and "Version 2" (Pico works with Version 1 too). The
path default is `kv` which will mount the engine on the path `/kv`. If you
change this, ensure you look out for references to `/kv` in the next section and
change accordingly.

### Create a Pico Policy

Pico needs a policy to access Vault. This policy should only give the
permissions necessary to run and no more. This is the principle of least
privilege.

Below is a recommended policy for Pico, if you chose to mount the KV secrets
engine on a different path, the line you need to change is highlighted:

```hcl {1}
path "kv/*" {
  capabilities = ["read", "list"]
}
```

This allows Pico to list secrets and read them. Nothing more.

### Create a Pico Entity and Alias

Create an Entity for Pico, this represents Pico as an accessor of Vault. Then
create an Alias for Pico using the Token authentication method, this allows Pico
to authenticate to Vault using an API token.

See [this page](https://learn.hashicorp.com/vault/security/iam-identity) for
more information on entities and aliases.

### Create a Token

Now you've got a Pico policy, entity and alias set up, you can create a token
that has the `pico` policy associated with it.

```sh
vault token create -policy=pico -ttl=72h # Pico renews tokens every 24h
```

This will create a token and display it with some metadata. Copy the token and
test it by opening up the Vault web UI in another tab and logging in with that
token. You should _only_ be able to see the `cubbyhole/` and `kv/` items in the
list of secrets engines.

Switch back to the tab where you're logged in as root and create a secret inside
`kv/` with some dummy data. Pico's logged in user should now be able to read
this.

### Create Pico Config Secret

Pico has two types of configuration: static and dynamic. Static configuration is
done at initialisation time via environment variables. Dynamic configuration is
done via the [Configuration Repository](../reference/config-repo).

There's one issue here. Pico needs to be able to authenticate to access this
configuration repository. We want to store Git login details securely. For this
reason, Pico will, on initialisation, read a secret named `pico` from the
secrets engine (Vault, in this example) and extract Git login details from there
in order to access the configuration repository.

You can configure this path with the `vault-config-path` flag. But lets assume
`pico` for now (which means `/kv/pico/` as the full path).

Open up the Vault UI (or use the command line client) and create a secret in
`/kv` named `pico` and set two keys:

- `GIT_USERNAME`
- `GIT_PASSWORD`

Note that you should not use your own personal login details but instead create
an API user and token. See the documentation for your Git provider for more
information.

Use the Vault CLI (authenticated as the Pico entity) to test this:

```sh
❯ vault kv get /kv/pico
====== Metadata ======
Key              Value
---              -----
created_time     2020-04-06T12:50:49.294201Z
deletion_time    n/a
destroyed        false
version          1

======== Data ========
Key             Value
---             -----
GIT_PASSWORD    p4ssw0rd
GIT_USERNAME    pico-api-token
```

## Deploy Pico

Now Vault is prepared, it's time to set up Pico.

### Create Config Repo

Create a config repo. It can be empty for now. As long as Pico has access. We'll
assume this repo is at the URL `https://github.com/mycompany/pico-config` for
the remainder of this guide.

### Deploy

Now you're ready to deploy Pico. Use the Docker Compose configuration below.
Ensure you're deploying Pico in an environment that has direct access to Vault.
In the example below, you'll see `https://vault.example.com`, replace this with
an address that leads to Vault in that context. If you deploy Vault and Pico
inside the same Docker Compose configuration, you can just use
`http://vault:8200`.

Also, provide the token for Pico to access Vault that you created earlier as an
environment variable named `VAULT_TOKEN`. Take care to do this securely (avoid
shell history, don't leave it in a `.env` file, etc.)

```yaml {9,10}
version: "3"

services:
  pico:
    image: picostack/pico:v1
    command: run https://github.com/mycompany/pico-config
    restart: on-failure
    environment:
      DIRECTORY: "/data/targets" # where to persist data
      VAULT_ADDR: "https://vault.example.com" # where to find Vault
      VAULT_TOKEN: ${VAULT_TOKEN:?} # the token you created with `vault token create ...`
      VAULT_PATH: kv/ # where the KV engine was mounted
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /data/targets:/data/targets
```

:::note

Note the `/data/targets` mount in `DIRECTORY` and `volumes` is the exact same.
This is significant and is explained [here](../reference/docker).

:::

Upon running `docker-compose up` you should see Pico log a single message to
indicate it's running happily. If you specified a few targets in your config
repo already, it may take some time to perform the initial clone for these
targets.

## Deploy Core Stack

The documentation for the Core Stack is located
[here](https://github.com/picostack/core#deployment). You can store the six
environment variables it requires inside a Vault secret named after the target.

## Conclusion

You now have a production-ready, secure, Git-driven automation tool! 🎉

See the [configuration](../reference/configuration) reference to learn how to
add new targets.
