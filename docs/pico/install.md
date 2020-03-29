---
title: Installation
---

## Linux

```sh
curl -s https://raw.githubusercontent.com/picostack/pico/master/install.sh | bash
```

Or via Docker:

```sh
docker pull picostack/pico:v1
```

See the docker section below and the image on
[Docker Hub](https://hub.docker.com/r/picostack/pico).

### Staging

If you want to test new features before they land in the stable release, you can
use the `staging` label.

## Everything Else

It's primarily a server side tool aimed at Linux servers, so there aren't any
install scripts for other platforms. Most Windows/Mac usage is probably just
local testing so just use `go get` for these use-cases.

If there is a demand for a Windows/Mac binary release (via scoop and brew), it
will be added.
