# 安装

## 准备系统
安装`Ubuntu 18.04`或者`Ubuntu 20.04`（如需在windows系统上使用EB corbos Starterkit, 需要先安装虚拟机），将EB corbos Starterkit安装包（示例版本为adg-eblinux-standard-delivery.tar.gz) 放置到 `~/Downloads` 。

## 解压安装包
### ADG-2.2（包含2.2）之前的版本
``` bash
mkdir -p /tmp/delivery
cd /tmp/delivery
tar xf ~/Downloads/adg-eblinux-standard-delivery.tar.gz
```

### ADG-2.3 之后的版本，以qemu-x86为例
``` bash
mkdir -p /tmp/delivery
cd /tmp/delivery
tar xf ~/Downloads/ask-ADG-2.3-eblinux-bin.tar.gz
tar xf ~/Downloads/ask-ADG-2.3-eblinux-qemu-x86.tar.gz
```

## 准备环境
执行installer脚本
``` bash
./adg-standard-installer-ADG-2.2.sh
```
或者
``` bash
adg-ADG-2.3-installer.sh
```
路径选择时建议使用默认路径 `~/ara/eb`，直接按下Enter即可。
执行完毕界面如下图所示。
<img :src="$withBase('/images/eb_corbos_starterkit/installation/run_installer_sh.png')" alt="执行安装脚">

## 添加环境变量
``` bash
gedit ~/.bashrc
```
在 `~/.bashrc` 最后一行添加如下环境变量：  
`export workspace=~/ara/eb/workspace/`

## 安装EB corbos Studio
``` bash
ara-cli SdkMgr --overwrite --activate --update-packages adg.*.tar.gz
```
在最后可根据自己的当前环境选择相应的 `platform:` 比如 `qemu-x86` 
<img :src="$withBase('/images/eb_corbos_starterkit/installation/select_platform.png')" alt="选择平台">

## 运行EB corbos Studio

### 命令行操作
``` bash
corbos-studio-launcher --target-os eblinux
```

### 点击图标操作
图标路径： `~/ara/eb/tools/studio/ADG-2.2/EB_corbos_Studio`

### 安装了多个corbos/adg版本
默认会打开最新安装的EB corbos Stuido版本，如果有特殊需求，可以修改`~/.ara/config.ini`文件的配置

## 选择workspace
自行选择workspace路径，下图是示例路径：`~/ara/eb/workspace`
<img :src="$withBase('/images/eb_corbos_starterkit/installation/select_workspace.png')" alt="选择工作区">

## 准备adg demo
adg demo路径为： `~/ara/eb/adaptivecore/source/git/ara_Demos/impl/demonstrator/templates/demos/`  
把5个demos拷贝进workspace。  
下图是示例路径 `~/ara/eb/workspace/adg/demo` 
<img :src="$withBase('/images/eb_corbos_starterkit/installation/prepare_adg_demo.png')" alt="准备Demo">
