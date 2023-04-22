# Flomo Reminder

基于 `github actions` 的定时推送 memo 服务，灵感来自 flomo `每日提醒` 功能。

![](https://i.328888.xyz/2023/04/19/i6vXeH.png)

## 功能

- 支持通过 cron 表达式配置推送时间，默认在每天 `9:00`、`12:00`、`18:00` 进行推送
- 推送支持 [Bark](https://github.com/Finb/Bark) 和 [PushDeer](http://www.pushdeer.com)
- 支持自定义要推送的 memo 标签

## 用法

1. **fork** 此仓库
2. 如果要修改推送时间，在 `.github` -> `workflows` -> `main.yaml` 中编辑 `on:schedule:cron` 这一项的为合法的 cron 表达式即可，请关注[注意事项](#注意)
3. 在**自己的 github 仓库**里，定位到 `Settings` -> `Security` -> `Secrets and variables` -> `Actions`

![](https://p.ipic.vip/oygvav.png)

3. 在 `Secrets` 这一栏中，点击右边的按钮 `New repository secret`，添加如下表参数。如果配置了多个通道的 token，则会发送多个通道推送

| 参数                | 说明                                                                                   | 示例                        | 必填 |
| ------------------- | -------------------------------------------------------------------------------------- | --------------------------- | ---- |
| FLOMO_AUTHORIZATION | 在 Web 端登录 flomo，打开开发者工具，在随便一个接口请求里复制 authorization 头的值即可 | Bearer 12345678 ｜ xxxxxxxx | ✅   |
| BARK_TOKEN          | Bark 的 推送 token，在 Bark app 中可以找到                                             | aBcDefg1234HijkLmn          |      |
| PUSHDEER_TOKEN      | PushDeer 的 推送 token，在 PushDeer 设置中可以找到                                     | aBcDefg1234HijkLmn          |      |

1. 在 `Variables` 栏中，点击按钮 `New repository variable`，添加如下表参数

| 参数      | 说明                                                                                                           | 示例                                            | 必填 |
| --------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---- |
| PUSH_TAGS | 要推送的 tags，用**英文逗号**分隔。如果设置了「读书」，会推送「读书」标签下所有的子标签                        | 学习/前端/知识体系,读书,名言                    |      |
| PUSH_CRON | 推送时间的 CRON 表达式，默认为 "0 1,4,10 \* \* \*"（时间要减去时区偏差 8）, 即每天 9 点、12 点、18 点 推送一次 | 0 0/2 \* \* \* （从零点开始每两个小时推送一次） |

## 调试

拉取代码到本地并安装依赖之后，新建一个 `.env` 文件，把环境变量填进去，示例如下：

```
// ./.env
FLOMO_AUTHORIZATION=Bearer 123456|xxxxxx
BARK_TOKEN=xxxxxx
PUSH_TAGS=学习/前端/知识体系,读书,名言
```

然后运行本地调试命令：

```shell
yarn start
```

观察 console 信息即可。

## 更新

定期拉取此仓库代码即可。

## 注意

1. 由于 github 的 action 机制，**推送时间不会完全准确**。高峰时期实测大概会延迟 40-50 分钟推送，可以酌情考虑把设置推送时间比想要推送的时间稍微提前一些。
2. 推送时间的 CRON 表达式，**时间要减去时区偏差 8**，例如每天 `9、12、18` 点推送要写成 `"0 1,4,10 * * *"`。

## 反馈

请直接提 `issue`，谢谢！

## 感谢

[flomo](https://flomoapp.com)
