---
title: Environment Variables
---

## `ENVIRONMENT`

Controls how logs are presented.

| Value         | Effect                                                                                                                                                                              |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `production`  | Uses a production configuration for logging: JSON formatting ([more info](https://pkg.go.dev/go.uber.org/zap?tab=doc#NewProductionConfig))                                          |
| `development` | Uses a development configuration for logging: Not JSON, easier on the eyes and more readable labels. ([more info](https://pkg.go.dev/go.uber.org/zap?tab=doc#NewDevelopmentConfig)) |

## `LOG_LEVEL`

Accepts: `debug`, `info`, `warn`, `error` additional documentation available
[here](https://pkg.go.dev/go.uber.org/zap@v1.15.0/zapcore?tab=doc#Level).

### `DEBUG`

Setting the log level to debug will also enable the runtime interrupt tracing
feature. When the user sends an interrupt signal to Pico, before terminating its
processes it will log out a stack trace and a list of points of interest in the
codebase that were waiting for something. These points of interest are listed
below. This feature can help debug issues that cause Pico to hang waiting for
some long-running process.

| Name                  | Purpose                                                                                                                                                                                                     |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `watch_config`        | Pico was waiting for the repository watcher to either clone or pull (update) the [config repo](../reference/config-repo). This can hang when SSH is not configured correctly or the remote network is slow. |
| `start_wait_init`     | Pico was waiting for the first [reconfigure](../reference/reconfigure) event to set the initial [configuration](../reference/configuration) state.                                                          |
| `start_select_states` | This is the idle state which runs once Pico has initialised. This indicates Pico is waiting for [configuration](../reference/configuration) updates or [targets updates](../reference/target).              |
| `watch_targets`       | When Pico reconfigures, this task indicates Pico has prepared the Git watchers for all [target](../reference/target) repositories and is waiting for them to be cloned/pulled/updated.                      |
| `send_target_task`    | Pico has received a [target](../reference/target) update event and is dispatching a task to the execution engine and waiting for it to be processed.                                                        |
