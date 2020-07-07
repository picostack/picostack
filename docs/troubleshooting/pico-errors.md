---
title: Pico Errors
description: A comprehensive list of all possible Pico error messages.
---

## Initialisation Errors

These occur during initialisation and will cause the program to exit
immediately. They are the result of a misconfiguration or inability to reach a
necessary resource.

### "failed to create vault secret store"

Pico is trying to connect to a Vault server but failed for some reason:

| Error                                                | Reason                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| failed to create vault client                        | The Vault SDK failed to create a client. This is usually related to the specified Vault address, it might be malformed.                                                                                                                                                                                                                |
| failed to connect to vault server                    | This occurs when Pico is unable to ping the Vault server by attempting to read its own token. If this happens, there might be a connection issue preventing a HTTP(S) request from succeeding or a permission problem, preventing the Pico policy from accessing its own token.                                                        |
| failed to determine KV engine version at '/somepath' | Pico supports the Vault KV Engine v1 and v2 and, during initialisation, will attempt to determine the version of the engine being used. If it fails, this error is given with some detail. This can be caused by the KV engine not being present on the specified path, or Pico's policy not having sufficient permissions to read it. |

### "failed to create an authentication method from the given config"

This occurs when Pico fails to acquire an authentication method for Git. Most of
the time, the sub-error is `failed to set up SSH authentication` which can be
caused by an SSH agent failing to start or not being found on the
machine/container that Pico is running in.

## Runtime Fatal Errors

These can occur at any time while Pico is running and will immediately cause
Pico to exit.

### "git watcher crashed"

This occurs during a [reconfigure](../reference/reconfigure) event, when Pico
sets up a Git watcher job against the new targets of a
[configuration](../reference/configuration). The most likely cause of this is an
auth issue or a malformed Git repository path in the configuration.

Rolling back to the previous working configuration should resolve this. You can
do this by reverting the problematic commit in your
[configuration repository](../reference/config-repo), pushing and restarting
Pico.

### "reconfigure provider crashed"

This occurs during a [reconfigure](../reference/reconfigure) event, when Pico
receives an event from the [configuration repository](../reference/config-repo)
indicating that its state must be updated with the new configuration. It is
caused by either a failure while watching the configuration repository (auth or
malformed URL) or a failure during a first-time set up (creating directories).

A rollback should also solve the problem in this situation. The error may have
additional details for what failed.

### "vault token renewal job failed"

Pico will frequently renew its Vault token (based on the `vault-renew-interval`
flag) and if this renewal fails, this error is shown.

Possible solutions include:

- Creating a new token manually (see Vault documentation, or the
  [production deployment guide](../pico/production))
- Ensuring Pico can still access Vault
- Ensuring Pico has adequate permissions to renew tokens
