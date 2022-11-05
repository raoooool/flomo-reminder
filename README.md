# Flomo Reminder

基于 `github action` 的定时推送 memo 服务。

默认会在每天的 12:00、18:00 通过 `server 酱` 推送最近 `500` 条 memo 中的随机一条 memo 到 `Bark` 里。

灵感来自 flomo 官方的 `每日提醒` 服务。

## 用法

首先，fork 代码部署到自己仓库。

然后在 fork 的仓库的 github setting 中配置 secrets 如下：

```
BARK_TOKEN='xxx' // Bark App 的 key
FLOMO_AUTHORIZATION='xxx' // FLOMO 的登录凭证，可以在 flomo 网页端里的随便一个接口的请求头里获取，格式为 ‘Bear xxxx’
```

Like this:
![](https://pic1.imgdb.cn/item/6366727716f2c2beb1904caf.png)

Enjoy it！
