---
title: The Software
---

The stack is composed of a set of container images that facilitate the above
ideology and allow you to focus on building your own software.

## Core Services

The "Core" services are the cornerstone of the Pico Stack. Together, they
provide all the tools you need to know exactly what's happening in your system
as well as the automation required to operate production-ready web services
behind HTTPS.

:::note Get The Core Configs

See the ready-to-deploy Pico Stack Core Docker Compose configuration files
[here][picostack_core]

:::

### [Traefik][traefik]

_As a HTTP gateway and for automatic SSL certificates._

Traefik is the go-to modern reverse proxy for HTTP services. It's
container-first and is configured by reading metadata from containers. This
means containers themselves declare how they want to be routed to and Traefik
uses this to route requests to them. There are no configuration files to copy
around, everything is done via labels.

### [Portainer][portainer]

_To see what's running._

Portainer provides a simple web interface to check up on what services are
running and their status. You can start, stop, restart and inspect services at
runtime.

### [Watchtower][watchtower]

_For keeping container images up to date._

Watchtower is a great solution for automated deployment. It will pull new Docker
images whenever they are updated and re-deploy containers automatically. Not
advised for public images for security reasons but great for your own software.

### [Grafana][grafana]

_For viewing logs, metrics and alerts._

Grafana is an industry standard for viewing information about services. Here, it
sits as the primary interface to all the metrics and logs to your system via the
following four components.

### [Prometheus][prometheus]

_For metric collection._

Prometheus is another industry standard for collecting time-series data from
services and systems.

### [Node Exporter][node_exporter]

_For system metrics._

Collects and exports metrics from the underlying system. This includes CPU,
memory and storage device information.

### [cAdvisor][cadvisor]

_For container metrics._

Collects and exports metrics from the Docker daemon. This includes container
resource usage and performance of all running containers on the host.

### [Loki][loki]

_For log aggregation._

Loki is a relatively new log aggregation tool from the team at Grafana. It acts
as a logging driver for Docker so all container logs are directed to Loki which
handles storage, indexing and rotation. These logs are then visible and
searchable via the Grafana interface.

## Pico

[Pico][pico] is an automated Git robot designed specifically to work well in the
Pico Stack environment. It provides a way to automate deployments and securely
pass sensitive configuration variables to services.

## Vault

[Vault][vault], by HashiCorp, is an on-premises secrets database for securely
storing and distributing sensitive information such as database passwords and
private keys. In the Pico Stack, Vault is used by Pico to pass these secrets to
deployments securely. No more `.env` files on your server's filesystem!

## DNSControl

[DNSControl][dnscontrol], by StackExchange, is a tool for automatically
configuring DNS records in a Infrastructure-as-Code way. DNS configuration is
stored in a declarative way and the tool uses this to diff and update against
various DNS providers.

## Cloudflare

Cloudflare's network is a great tool not only as a protection layer and a CDN
but also as a way to automate those domain name entries with DNSControl. Having
all your domains in one place while also automating them with a layer of
protection and analytics is such a useful tool when running multiple web
services.

<!-- Links -->

[picostack_core]: https://github.com/picostack/core
[traefik]: https://traefik.io
[portainer]: https://portainer.io
[watchtower]: https://containrrr.github.io/watchtower
[grafana]: https://grafana.com
[prometheus]: https://prometheus.io
[node_exporter]: https://github.com/prometheus/node_exporter
[cadvisor]: https://github.com/google/cadvisor
[loki]: https://github.com/grafana/loki
[pico]: https://github.com/picostack/pico
[vault]: https://www.vaultproject.io
[dnscontrol]: https://stackexchange.github.io/dnscontrol
