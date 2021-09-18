# 交通信号场景模拟应用
本应用包含以下Demo：  
| 名称          |功能            |相关模块                           |
| ------------- | ------------- | -------------------------------- |
|Sensor_handler |TBD            |ara:Com, ara:EM, ara:PM, ara:Phm |
|Sensor_Preprocessor |TBD       |ara:Com, ara:EM, ara:Phm  |
|Sensor_Manager |TBD   |ara:Com, ara:EM, ara:Phm |
|Sensor_dataProcessor |TBD |ara:Com, ara:EM, ara:PM |
|Display_Manager |TBD |ara:Com, ara:EM |
|phm_callback |TBD |ara:EM |

<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/architecture.png')" alt="交通信号场景演示程序架构图">

## 准备Demo(命令行操作)
``` bash
ara-cli Application --generate-cmake --app ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/ --target-os eblinux --target-platform qemu-x86 
```

## 导入工程

### 命令行操作
如全程使用命令行操作，此步骤不需要。

### UI界面操作
1. File->import
2. Select an import wizard: General/Existing Projects into Workspace
    <img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/import_project.png')" alt="General/Existing Projects into Workspace">
3. Select root directory: `~/ara/eb/workspace/adg/demo/Sensor_Preprocessor`
4. Copy project into workspace选项在项目不在workspace目录的时候需要选中
    <img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/select_root_directory.png')" alt="Copy project into workspace">

### 目录结构介绍
+ Build Targets： 里面是一些编译操作
+ Includes： 是依赖的第三方头文件和我们ADG的头文件
+ Impl：是我们需要实现功能的代码路径
+ Launch： 是ContainerDeploy到qemu之后，提供run和debug操作
+ Model： 放的是该工程依赖ADG的arxml配置文件
+ Plugets： 里的插件可以让我们根据model里的arxml生成配置文件或者代码，具体可以看user guide
+ Test： 里放的是单元测试代码
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/folder_structure.png')" alt="目录结构">

## 运行与ADG相关的pluget
+ 必要插件：araEmManifestGen.pluget, araComBindingGenerator.pluget
+ Sensor_dataProcessor， Sensor_handler需要araPmManifestGen.pluget插件 +
+ 跨VM的Sensor_handler ,Sensor_Preprocessor需要araComManifestGenerator插件 +
 

### 命令行操作
--EM相关—
``` bash
ara-cli RunPluget --name araEmManifestGen.pluget \
--input  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/ \
--output ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/
```
--Com相关—
``` bash
ara-cli RunPluget --name AraComBindingGenerator.pluget \
--input  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/ \
--output  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/
```
--Com配置文件—
``` bash
ara-cli RunPluget --name AraComManifestGenerator.pluget \
--input  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/ \
--output  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/
```
--PM相关—
``` bash
ara-cli RunPluget --name araPmManifestGen.pluget \
--input  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/ \
--output  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/
```

### UI界面操作
执行AraComBindingGenerator.pluget,点击OK
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/execute_pluget_AraComBindingGenerator.png')" alt="执行AraComBindingGenerator">
此步骤会在generated文件夹下生成代码，给Service或Client使用
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/generate_code.png')" alt="generate_code">

执行AraComManifestGenerator.pluget,点击OK  
此步骤会在generated下生成config文件夹，里面有sensor_preprocessor_someip_machine1.json文件
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/execute_pluget_AraComManifestGenerator.png')" alt="执行AraComManifestGenerator">

执行araEmManifestGen,点击OK  
此步骤会在generated文件夹生成EM相关的配置文件
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/execute_pluget_araEmManifestGen.png')" alt="执行araEmManifestGen">

## 编译工程

### 命令行操作
``` bash
ara-cli Application --app  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/ --target-os eblinux --target-platform qemu-x86
```

### UI界面操作
点击Build Targets/ Build

## 把编译好的工程封装进Container

### 命令行操作
``` bash
ara-cli CreateAppContainer --app-dir  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/ \
--config-dir  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/generated \
--container-dir  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/container
```

### UI界面操作
点击`Build Targets/CreateAppContainer`

## 启动qemu
+ qemu1: Sensor_Preprocessor, Sensor_Manager, Sensor_dataProcessor, Display_Manager
+ qemu2: Sensor_handler
::: tip 注意
下文命令行中数字1皆代表qemu1.
:::

### 命令行操作

``` bash
ara-network -a -N 1
```
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/network_bridge.png')" alt="network_bridge">

``` bash
ara-cli RunQemu --start 1 --target-os eblinux
```

若执行失败，再次执行即可
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/run_qemu.png')" alt="run_qemu">

## 登陆qemu

### 命令行操作

``` bash
ssh -o StrictHostKeyChecking=no root@fd00::eb:1
```

## 部署container到qemu

### 命令行操作

``` bash
ara-cli DeployAppContainer --app-dir  ~/ara/eb/workspace/adg/demo/Sensor_Preprocessor/ --target-host root@fd00::eb:1
```

### UI界面操作
点击Build Targets/DeployAppContainer

## 部署配置文件到qemu
Sensor_handler和Sensor_Preprocessor需要Deploy Target File,之后可以在qemu1和qemu2  之间通信。 +
此步骤会把json文件deploy到qemu里，路径为 `/etc/adaptive/ara_Com/daemon_1/sensor_preprocessor_someip_machine1.json`

### 命令行操作

``` bash
ara-cli TargetOperation --app-dir ./Sensor_Preprocessor
```

### UI界面操作
点击Build Targets/DeployTargetFiles

## 执行程序

``` bash
runc list
```

Qemu1:
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/runc_list_qemu1.png')" alt="runc_list_qemu1">

Qemu2:
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/runc_list_qemu2.png')" alt="runc_list_qemu2">

### 命令行操作
Qemu1:
``` bash
runc exec Sensor_Preprocessor /opt/Sensor_Preprocessor/bin/Sensor_Preprocessor
runc exec Sensor_Manager /opt/Sensor_Manager/bin/Sensor_Manager
runc exec Sensor_dataProcessor /opt/Sensor_dataProcessor/bin/Sensor_dataProcessor
runc exec Display_Manager /opt/Display_Manager/bin/Display_Manager
```

Qemu2:
``` bash
runc exec Sensor_handler /opt/Sensor_handler/bin/Sensor_handler
```

+ 左1：Displayer_Manager
+ 左2：Sensor_Manager
+ 左3：Sensor_dataProcessor
+ 右1：Sensor_Preprocessor，在Sensor_handler没起之前,FindService结果为0，否则为1
+ 右2：Sensor_handler

<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/communication_processes.png')" alt="communication_processes">
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/demo_logo.png')" alt="demo_logo">

### UI界面操作
右击/launch/Sensor_Preprocessor_run.launch -> Run As -> Sensor_Preprocessor_run  
弹窗点击yes，会在Console看到程序的log。

<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/Sensor_Preprocessor_run.png')" alt="Sensor_Preprocessor_run">
<img :src="$withBase('/image/eb_corbos_starterkit/demo_ara_com/Sensor_Preprocessor_log.png')" alt="Sensor_Preprocessor_log">

## 停止qemu

### 命令行操作
``` bash
ara-cli RunQemu --stop 1
```