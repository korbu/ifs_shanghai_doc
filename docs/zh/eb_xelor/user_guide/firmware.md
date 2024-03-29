# Firmware for R-Car H3

EB xelor 提供 R-Car H3 firmware bin文件的Conan包。

## 获取bin文件

**前提条件:**  
已安装Conan, 详细请参考 [Docker](docker.md).

如果不用 [Valeria](valeria.md) 来构建, 需要注意的是Conan profile使用conan user和connan channel。
你需要在 `config/valeria/r-car-h3/profiles` 目录下创建 `get_user_channel` 文件并指定user 和 channel。
例如：
```
CONAN_USER=EBxelor
CONAN_CHANNEL=2020.12
```

Step 1  
在EB xelor artifactory中搜索所有firmware的包. E.g. firmware:

`conan search -r eb_core-releases \*eb_firmware*`

Step 2  
创建空白目录并从EB xelor artifactory获取二进制文件。例如：
``` bash
mkdir firmware
cd firmware
conan install \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/host/gcc7_arm64 \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/host/A5x \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/build/linux_x86_64 \
-r eb_core-releases eb_firmware/0.1.1@EBxelor/2020.12
```

::: tip 提示
当前firmware包包含R7和A5x的文件。后续版本会将他们分开打包。
:::

Step 3  
检查目录下已有对应的文件：

```
firmware-H3-4GB
firmware-H3-8GB
```

## 各个文件的描述

| 文件 | 描述|
|--|--|
| bl2.elf | Perform platform security setup to allow access to controlled components, started vom IPL1|
| bl2.map | bl2 map file|
| bl2.srec | bl2 in srec format|
| bl31.elf | Started by the bl2, initializes power modes|
| bl31.map | bl31 map file|
| bl31.srec | bl31 in srec format|
| bootparam_sa0.srec | ???|
| cert_header_sa6.srec | certificate header of the IPL1, checked by the boot ROM|
| ipl1.elf | first part that is started|
| ipl1.map | ipl1 map file|
| ipl1.srec | ipl1 in srec format|

## 配置
firmware文档中有使用到的地址的描述。
firmware以二进制文件形式交付。

## Flashing to H3
参考 [Flashing](./flashing.md) 已了解如何烧写。
