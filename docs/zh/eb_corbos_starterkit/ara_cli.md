# ara-cli简介
ara-cli is a Python-based command line tool used to run different build and verification operations. ara-cli
offers a set of hooks, which combine multi-step operations into a single hook. A hook usually calls a set of tasks
in order and with predefined parameters. Additionally, it is also possible to call individual tasks with ara-cli.
The set of available hooks and tasks can be listed with the following command:
ara-cli
You can get help with a task or hook if you add the --help parameter after a hook or a task name.
ara-cli Build --help

## 开始使用
AP应用相关的操作由 `ara-cli Application` 命令完成，相关参数可由 `ara-cli Application --help` 查看。

### 创建新工程
你可以通过 `ara-cli Application` 命令创建新工程
``` bash
ara-cli Application --create-project --app ~/workspace/adg/demo --target-os <target_os>
```
然后，生成CMakeList：
``` bash
ara-cli Application --generate-cmake --app ~/workspace/adg/demo --target-os <target_os>
```

### 移植已有工程

#### 修改CMkeLists.txt
添加project定义：
``` bash
project(demo
 VERSION 1.0.0
 LANGUAGES CXX
)
```
添加include文件
``` bash
include(Options.cmake)
include(InstallPaths.cmake)
include(Test.cmake)
include(CommonTargets)
```
根据项目需求，添加对应的包信息：
``` bash
find_package(ara_TSyn REQUIRED)
find_package(ara_HealthMgr REQUIRED)
find_package(ara_DLT REQUIRED)
find_package(ara_PM REQUIRED)
find_package(ara_EM REQUIRED)
find_package(ara_PSP REQUIRED)
find_package(ara_Com REQUIRED)
```
然后，生成CMakeList：
``` bash
ara-cli Application --generate-cmake --app ~/existing_project --target-os <target_os>.
```

#### 使用EB corbos Starterkit的示例demo
TBD

### 配置工程
TBD

### 运行plugets
TBD

### 工程构建
TBD

### 工程验证
TBD

## 使用QEMU
TBD

## 使用R-Car H3
TBD

## Working with a target host
TBD

## 使用容器
TBD

## 使用UCM包
TBD

## Perform system and user space tracing with LTTng and perf
TBD

## Working with an application binary
TBD

## Working with ADG modules
TBD

## 构建EB Linux镜像
TBD

## Starterkit
TBD

## Troubleshooting
TBD

## 卸载Starkerkit
TBD