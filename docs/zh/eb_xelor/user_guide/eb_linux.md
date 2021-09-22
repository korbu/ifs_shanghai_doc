# EB corbos Linux

EB xelor 提供 EB corbos Linux bin文件的Conan包。

## 获取镜像文件

**前提条件:**  
已安装Conan, 详细请参考 [Docker](./docker.md).

如果不使用 [Valeria](./valeria.md) 来构建, 需要注意的是Conan profile使用了两个参数：`conan user`和`connan channel`。
你需要在 `config/valeria/r-car-h3/profiles` 目录下创建 `get_user_channel` 文件并指定`user` 和`channel`。例如：
```
CONAN_USER=EBxelor
CONAN_CHANNEL=2020.12
```

Step 1  
在EB xelor artifactory中搜索所有EB corbos Linux的包.
``` bash
conan search -r eb_core-releases eb_linux*
```

Step 2  
创建空白目录并从EB xelor artifactory获取镜像文件。

For R-Car H3:
``` bash
mkdir linux
cd linux
conan install \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/host/A5x \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/build/linux_x86_64 \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/build/soc_specific \
-r eb_core-releases eb_linux/0.3.0@EBxelor/2020.12
```

For NXP S32G:
``` bash
mkdir linux
cd linux
conan install \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/host/A53 \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/build/linux_x86_64 \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/build/soc_specific \
-r eb_core-releases eb_linux/0.3.0@EBxelor/2020.12
```

Now the linux directory contains the following binaries:
``` bash
EB_linux_base__core-image-eb-dev-corbos-*-hv.wic
bootstrap.uimage
Image
sdk/corbos-linux-glibc-x86_64-core-image-eb-dev-aarch64-corbos\
-*-hv-toolchain-*.sh
```

::: tip 提示
yocto-sdk (corbos-linux-glibc-x86_64-core-image-eb-dev-aarch64-corbos...) 包含linux版本信息.
:::

## 各个文件的描述

| 文件 | 描述 |
| -- | -- |
| EB_linux_base__core-image-eb-dev-corbos-*-hv.wic | EB corbos Linux disk image|
| bootstrap.uimage | u-boot legacy uImage with Linux kernel image. Needed for Hypervisor|
| Image | EB corbos Linux image|
| core-image-eb-dev-corbos-*-hv.squashfs | Root filesystem. Needed for Hypervisor|
| sdk/corbos-linux-glibc-x86_64-core-image-eb-dev-aarch64-corbos-*.sh | Yocto SDK generated from the build|

## 配置

**网络配置**

EB corbos Linux 网络配置分为两部分:

* Hostname comes from Hypervisor as kernel parameter (see more info from [Hypervisor](./hypervisor.md) instructions)
* IP addresses (IPv4 and IPv6) are configured in files:
  * `pkg/eb_linux/yocto/meta-ebcore/recipes-networking/ +
system-network/system-network/network.json`
  * After changing `network*.json` files, rebuild EB corbos Linux, it generates script `/sbin/network-config.sh` which is executed during EB corbos Linux boot

The EB xelor provides a Yocto meta layer to configure the EB linux.
The meta layer is located in this directory:
``` bash
pkg/eb_linux/yocto/meta-ebcore
```
The purpose of the yocto layer is a clear separation of the EB xelor specific configuration from the EB products.

## yocto's sstate-cache的使用
The usage of yocto's sstate-cache can speed up the build process significantly after an initial build.
Read the [yocto manual](https://wiki.yoctoproject.org/wiki/Enable_sstate_cache) for more information about the sstate-cache.

The Linux recipe `pkg/eb_linux/conan/conanfile.py` configures the cache based on the following environment variables.

eb_linux recipe 中 sstate-cache configuration使用的环境变量
| 环境变量 | 值 | 描述|
| -- | -- | -- |
| `SSTATE_DIR` | `/my-local-cache/sstate-cache` | The directory of the local sstate-cache |
| `SSTATE_MIRRORS` |`file://.* http://sstate-cache.my.domain/PATH`| Address of the remote sstate-cache server|

A typical setup is: 

* After a clean build, the `SSTATE_DIR` directory contains the sstate files. 
* These files are uploaded to the `SSTATE_MIRRORS` server to share those with other build machines.
* Also in subsequent builds, newly generated files in `SSTATE_DIR` are uploaded to the server.

## 烧写到 H3
Flashing to the target can be done manually or with the flashing library.
The steps are described in [烧写](./flashing.md) chapters.


Write card image to SD card with dd (replace "sdX" with your SD card device, e.g. "sdc")
``` bash
sudo dd if=EB_linux_base__core-image-eb-dev-corbos-h3ulcb-hv.wic \
  of=/dev/sdX bs=64M
```
Insert SD card to target, reboot target, interrupt the u-boot and boot the hypervisor image:
``` bash
=> ext2load mmc 0:1 0x50FFFFC0 bootstrap.uimage
40633584 bytes read in 931 ms (41.6 MiB/s)
=> bootm 0x50FFFFC0
```
