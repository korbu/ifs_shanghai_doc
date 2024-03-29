# Docker

## 概述

EB xelor提供docker容器以用来开发并构建EB xelor交付物，容器基于(Yocto Project/OECore tools) 和 Ubuntu 18.04，包含基本的开发工具，例如python3，git，git-lfs，repo tool，Conan等。

容器文件dockerfile位于 `config/docker/Dockerfile` 。

## 安装并运行EB xelor docker容器

前提条件:

* Linux机器或运行Linux的虚拟机。我们使用的是Ubuntu。

安装步骤
+ Step 1  
    安装Docker CE: https://docs.docker.com/install/linux/docker-ce/ubuntu/

    创建组，并将你的用户名添加到组中:

    ``` bash
    groupadd docker
    sudo usermod -aG docker $USER
    ```
    注销登陆/重启后，运行 `docker run hello-world` 测试是否安装成功。

+ Step 2  
    获取EB xelor代码, 请参阅 [获取EB xelor](/obtain.md).

+ Step 3
    运行EB xelor docker容器

    如果没有EB xelor docker镜像，可以通过运行这个脚本自动创建:
    ``` bash
    tools/docker/run_docker.sh
    ```

    创建镜像后，`run_docker.sh`会检查各项配置并在命令行中报告发现的问题。

`run_docker.sh`脚本的配置和信息
|信息|说明|解决办法|
|--|--|--|
|ACTION NEEDED: Git commit template is missing on host |EB xelor使用commit模板，脚本会检查git client是否配置并使用了这个模板|如果你需要向EB xelor提交源代码，你应当安装git commit模板，如果不需要，那么可以忽略这个信息|
|SETUP: Set/update Conan authentication for remote(s) (Artifactory)|脚本根据 `config/conan/config` 安装conan配置，并验证是否有权限访问Artifactory仓库|提供凭证信息。如果你使用不同的Artifactory仓库，你应该修改 `config/conan/config/remotes.txt` 文件|
|SETUP: JFrog configuration needed, host is missing file |我们使用JFrog命令行客户端从Artifactory仓库下载文件|根据提示输入凭证信息，只需要输入用户名和密码，其他提示问题可以使用默认值|

## 目录结构
在EB xelor docker容器中，`/workdir`映射到的是你运行`run_docker.sh`的路径.

`run_docker.sh`会在这个文件夹下创建Conan缓存(`.conan`
directory)，即`/workdir/.conan`。因此，最好不要在源码路径运行这个脚本。

示例如下 (以克隆EBcore-main仓库为例):
``` bash
mkdir ebxelor
cd ebxelor
git clone git@gitext.elektrobitautomotive.com:EBcore/EBcore-main.git
./EBcore-main/tools/docker/run_docker.sh
```
Conan cache目录在`ebxelor/.conan`，对应的docker容器中路径是`/workdir/.conan`。

## Troubleshooting

::: tip 提示
源代码目录不应当属于root用户（组）。否则会有这样的提示信息:
``` bash
Refusing to use a gid of 0
```
:::

::: tip 提示
如果在VirtualBox中遇到了NAT的DNS问题:

Ubuntu 18.04 使用的是本地DNS缓存127.0.0.53，在容器中不会起效。因此Docker默认设置为 Google的8.8.8.8 DNS 服务器, 如果有防火墙设置可能会遇到问题。

Ubuntu 18.04中，`/etc/resolv.conf` 是一个符号链接 (`ls -l /etc/resolv.conf`)，指向
 `/run/systemd/resolve/stub-resolv.conf` (127.0.0.53)

更改路径到 `/run/systemd/resolve/resolv.conf`, 它列出了实际使用的DNS服务器：
....
sudo ln -sf /run/systemd/resolve/resolv.conf /etc/resolv.conf
....

查看并验证是否修改成功: `cat /etc/resolv.conf`

另外，你也可以修改VirtualBox DNS:
....
VBoxManage modifyvm "VM name" --natdnshostresolver1 on
....
:::
