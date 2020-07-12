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

:::tip

Using `debug` will enable
[exit waiting status](../troubleshooting/exit-waiting-status) to aid debugging
unexpected hangs.

:::
