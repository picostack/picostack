---
title: Getting Started with Pico
description:
  Pico is a Git-driven task runner built to facilitate GitOps and
  Infrastructure-as-Code while securely passing secrets to tasks.
---

Pico is a Git-driven task runner built to facilitate GitOps and
Infrastructure-as-Code while securely passing secrets to tasks.

## Overview

Pico is a little tool for implementing [Git-Ops][git-ops] in single-server
environments. It's analogous to [kube-applier][kube-applier],
[Terraform][terraform], [Ansible][ansible] but for automating lone servers that
do not need cluster-level orchestration.

Pico aims to be extremely simple. You give it some Git repositories and tell it
to run commands when those Git repositories receive commits and that's about it.
It also provides a way of safely passing in credentials from [Hashicorp's
Vault][vault].

[git-ops]: https://www.weave.works/blog/gitops-operations-by-pull-request
[kube-applier]: https://github.com/box/kube-applier
[terraform]: https://terraform.io
[ansible]: https://ansible.com
[vault]: https://vaultproject.io
