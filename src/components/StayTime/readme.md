# 停留时长统计

## usage
var st = window.CREATE && new window.CREATE.StayTime({
type :3,
interval: 1e3,
cfg: window.CFG
});

## params
| 参数名       | 类型     | 默认值     |  描述     |
|-----------|-------|------------------| --- |
|  type        |  number | 3  |  请求类型 1 广告位点击 7 进入游戏大厅或者游戏 2 游戏大厅 3 游戏  |
|  interval     |  number | 10e3  | 发送消息间隔 |
|  cfg     |  object | {}  | CFG对象 |