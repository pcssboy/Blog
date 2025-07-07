## 🌈 BilldDesk 远程桌面控制

1. 在线远程：[https://desk.hsslive.cn](https://desk.hsslive.cn)

2. 客户端下载：[https://desk.hsslive.cn/#/download](https://desk.hsslive.cn/#/download)

3. 问题反馈：[https://github.com/galaxy-s10/billd-desk/issues](https://github.com/galaxy-s10/billd-desk/issues)

## 🚀 参与 BilldDesk 开发

能量是守恒的。作者自认为不聪明，但执行力 100%，BilldDesk 整个项目都是经过不断的试错得到的结果。要想参与 BilldDesk 开发，必须满足下面条件之一：

1. 你让我觉得你对 BilldDesk 的开发有实际帮助（1+1=2）。
2. 你让我觉得你对 BilldDesk 的开发有非常多帮助（1+1>2）。
3. 你使用钞能力（1+1<2）： [https://desk.hsslive.cn/#/price]

## ⚠️ 你永远满足不了所有人

1. 每个用户都希望方便自己，下载客户端时，作者总不能在百度网盘、迅雷云盘、夸克网盘，123 云盘等等各大盘都上传一遍。
2. 目前 BilldDesk 从未发布 1.0 稳定版，而这对于某些开发者来说，他们只会开骂（可以去 issue 查看），这里作者建议骂之前先看下这篇文章：[前端之被包养就不要谈独立人格](https://www.hsslive.cn/article/139)。

## 功能

- [x] `web网页` 控制 `电脑端`
- [x] `web网页` 控制 `安卓端`
- [x] `web网页` 控制 `web网页`（仅观看）
- [x] `电脑端` 控制 `电脑端`
- [x] `电脑端` 控制 `安卓端`
- [x] `电脑端` 控制 `web网页`（仅观看）
- [ ] `安卓端` 控制 `电脑端`
- [ ] `安卓端` 控制 `安卓端`
- [ ] `安卓端` 控制 `web网页`（仅观看）
- [x] 多台设备同时远程一台设备
- [x] 一台设备同时远程多台设备
- [x] 多屏操作
- [x] 连接鉴权
- [x] 自定义设备码/连接密码
- [x] 自定义接口（wws/api/中继服务器）
- [x] 按键组合键
- [x] 文件传输
- [x] 开机自启
- [x] 锁屏保活
- [x] 屏幕墙
- [x] 支持 macOS 系统
- [x] 支持 Windows 系统（Windows 10、Windows 11。其他版本未实际测试）
- [x] 支持 Linux 系统（未实际测试）
- [x] 支持 Android 系统（Android 11 至 Android 15，其他版本未实际测试）
- [ ] 支持 iOS 系统
- [x] 后台管理
- [x] Docker 一键部署（1.0.0+支持）
- [x] 支持私有化部署（1.0.0+支持）

## 预览

快速体验：[https://desk.hsslive.cn](https://desk.hsslive.cn)

### web 网页/电脑端控制电脑端

![img](images/BilldDesk/1.png)

### web 网页/电脑端控制安卓端

![img](images/BilldDesk/2.png)

### web 网页/电脑端控制 web 网页

> 仅观看模式

![img](images/BilldDesk/3.png)

### web 网页移动端

> 首页

![img](images/BilldDesk/4.png)

> 控制页

![img](images/BilldDesk/5.png)

### 屏幕墙

![img](images/BilldDesk/6.png)

### 文件传输

![img](images/BilldDesk/7.png)
##  常见问题：
## windows 闪退问题

1. 安装.net 运行时：[点我安装.NET](http://https://dotnet.microsoft.com/zh-cn/download/dotnet-framework/thank-you/net481-web-installer "点我安装.NET")
2. 安装 c++运行时：[点我安装c++](http://https://aka.ms/vs/17/release/vc_redist.x64.exe "点我安装c++")

## mac 安装提示已损坏，无法打开

解决办法：[http://https://zhuanlan.zhihu.com/p/135948430](http://https://zhuanlan.zhihu.com/p/135948430)

---
## docker安装教程：

### docker 安装 mysql拉镜像

```bash
docker pull mysql:8.0
```

### 复制配置文件到本地

先查看配置文件位置：

```bash
docker run --rm mysql:8.0 mysql --help | grep my.cnf
```

查看配置文件位置结果：

```bash
➜  billd-desk-server git:(master) ✗ docker run --rm mysql:8.0 mysql --help | grep my.cnf
                      order of preference, my.cnf, $MYSQL_TCP_PORT,
/etc/my.cnf /etc/mysql/my.cnf /usr/etc/my.cnf ~/.my.cnf
➜  billd-desk-server git:(master) ✗
```

意思是按照/etc/my.cnf /etc/mysql/my.cnf /usr/etc/my.cnf ~/.my.cnf 路径按优先排序。

```bash
➜  billd-desk-server git:(master) ✗ docker run --rm mysql cat /etc/my.cnf
# For advice on how to change settings please see
# http://dev.mysql.com/doc/refman/8.0/en/server-configuration-defaults.html

[mysqld]
#
# Remove leading # and set to the amount of RAM for the most important data
省略...
➜  billd-desk-server git:(master) ✗
```

可以得到镜像中 mysql 配置文件路径为：/etc/my.cnf

创建一个临时的容器，在它里面复制配置文件到本地：

> 注意，本地需要存在/Users/huangshuisheng/Desktop/docker/mysql/conf 这个目录

本地复制时用这个命令：

```bash
LOCAL_DOCKER_MYSQL_PATH=/Users/huangshuisheng/Desktop/docker/mysql \
DOCKER_MYSQL_TMP=`docker run -d mysql:8.0` \
&& docker cp $DOCKER_MYSQL_TMP:/etc/my.cnf $LOCAL_DOCKER_MYSQL_PATH/conf \
&& docker stop $DOCKER_MYSQL_TMP \
&& docker rm $DOCKER_MYSQL_TMP
```

### 启动容器

```bash
# 使用自定义 MySQL 配置文件
# billd-desk-mysql是docker容器名，/Users/huangshuisheng/Desktop/docker/mysql是映射到本机的mysql，123456是密码

LOCAL_DOCKER_MYSQL_PATH=/Users/huangshuisheng/Desktop/docker/mysql \
&& docker run -d \
-p 3306:3306 \
--name billd-desk-mysql \
-e MYSQL_ROOT_PASSWORD=mysql123. \
-v $LOCAL_DOCKER_MYSQL_PATH/conf/my.cnf:/etc/my.cnf \
-v $LOCAL_DOCKER_MYSQL_PATH/data:/var/lib/mysql/ \
mysql:8.0
```

## docker 安装 redis

### 拉镜像

```bash
docker pull redis:7.0
```

### 复制配置文件到本地

> https://raw.githubusercontent.com/redis/redis/7.0/redis.conf

在/Users/huangshuisheng/Desktop/docker/redis/新建 conf 目录
在/Users/huangshuisheng/Desktop/docker/redis/新建 data 目录

将项目根目录的/docker/redis/conf/redis.conf 和 users.acl 复制到/Users/huangshuisheng/Desktop/docker/redis/conf

### 本地启动容器

```bash
# 使用自定义 redis 配置文件
# billd-desk-redis是docker容器名，/Users/huangshuisheng/Desktop/docker/redis是映射到本机的redis

LOCAL_DOCKER_RESIS_PATH=/Users/huangshuisheng/Desktop/docker/redis \
&& docker run -d \
-p 6379:6379 \
--name billd-desk-redis \
-v $LOCAL_DOCKER_RESIS_PATH/data:/data \
-v $LOCAL_DOCKER_RESIS_PATH/conf/redis.conf:/etc/redis/redis.conf \
-v $LOCAL_DOCKER_RESIS_PATH/conf/users.acl:/etc/redis/users.acl \
redis:7.0 redis-server /etc/redis/redis.conf
```

## docker 安装 coturn

> 本地环境时，不需要用 coturn

### 拉镜像

```bash
docker pull coturn/coturn
```

### 启动容器

```bash
LOCAL_DOCKER_COTURN_PATH=/Users/huangshuisheng/Desktop/docker/coturn \
&& docker run -d --network=host  \
--name billd-desk-coturn \
-v $LOCAL_DOCKER_COTURN_PATH/coturn.conf:/my/coturn.conf \
coturn/coturn -c /my/coturn.conf
```
