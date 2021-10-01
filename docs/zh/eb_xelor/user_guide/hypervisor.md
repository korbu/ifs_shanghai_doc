# EB corbos Hypervisor

EB xelor 提供 EB corbos Hypervisor bin文件的Conan包。

## 获取镜像文件

*前提条件:* +
已安装Conan, 详细请参考 <<Docker>>.

如果不用 <<Valeria>> 来构建, 需要注意的是Conan profile使用conan user和connan channel。
你需要在 `config/valeria/r-car-h3/profiles` 目录下创建 `get_user_channel` 文件并指定user 和 channel。
例如：
```
CONAN_USER=EBxelor
CONAN_CHANNEL=2020.12
```

Step 1  
在EB xelor artifactory中搜索所有EB corbos Hypervisor的包.
```
conan search -r eb_core-releases eb_hypervisor*
```

Step 2  
创建空白目录并从EB xelor artifactory获取镜像文件

For R-Car-H3:
```
mkdir hypervisor
cd hypervisor
conan install \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/host/A5x \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/build/linux_x86_64 \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/build/soc_specific \
-r eb_core-releases eb_hypervisor/0.3.1@EBxelor/2020.12
```

For NXP S32G:
```
mkdir hypervisor
cd hypervisor
conan install \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/host/A53 \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/build/linux_x86_64 \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/build/soc_specific \
-r eb_core-releases eb_hypervisor/0.3.1@EBxelor/2020.12
```


现在， `hypervisor/eb_hypervisor_r-car-h3/` 目录将包含这些文件：
```
EBcore-boot.img
EBcore-containers.img
EBcore-data.img
EBcore-rootfs.img
```

## 各个文件的描述

| 文件 | 描述|
|--|--|
| EBcore-boot.img | Contains bootstrap.uimage. Used if the hypervisor is started form emmc|
| EBcore-rootfs.img | Root file system for VM2 and VM3 running on EB corbos Linux|
| EBcore-containers.img | Container partitions for VM2 and VM3|
| EBcore-data.img | Data partitions for VM2 and VM3|


## 配置

### EB corbos Linux hostname

修改文件: `pkg/eb_hypervisor/config/setup_vm.ned`. Hostname 在这些行中定义 (当前名称为 EBcore-vm-alpha 和 EBcore-vm-beta):
```
local vm_2_bootargs = " root=/dev/vda rootwait ro hostname=ebcore-vm-alpha" ..

local vm_3_bootargs = " root=/dev/vda rootwait ro hostname=ebcore-vm-beta" ..
```

### Hypervisor's vm1 bridge's IP

Mount ramdisk
``` bash
sudo mkdir /mnt/hv_ramdisk
sudo mount pkg/eb_hypervisor/config/ramdisk-vm.rd \
  /mnt/hv_ramdisk
```
Change IP address in file:
``` bash
sudo nano /mnt/hv_ramdisk/etc/network/interfaces-bridge
```

Save and umount
``` bash
sudo umount /mnt/hv_ramdisk
```

### vm-hub hostname

Mount ramdisk
``` bash
sudo mkdir /mnt/hv_ramdisk
sudo mount pkg/eb_hypervisor/config/ramdisk-vm.rd \
  /mnt/hv_ramdisk
```
Change vm-hub hostname in file:
``` bash
sudo nano /mnt/hv_ramdisk/etc/hostname
```
Save and umount
``` bash
sudo umount /mnt/hv_ramdisk
```

### 使用方法

Hypervisor 支持下列键盘命令:

| 命令 | 动作|
|--|--|
| Ctrl-E . | Disconnect (goes to Hypervisor console)|
| Ctrl-E 1 | Connect to console 'vm1' (vm-hub)|
| Ctrl-E 2 | Connect to console 'vm2' (ebcore-vm-alpha)|
| Ctrl-E 3 | Connect to console 'vm3' (ebcore-vm-beta)|

## 烧写到 H3

Subject to change.
Flashing will be changed in some point, but currently flashing contains two separate steps.

Step 1  
Hardware needs to be prepared for flashing.
Make sure that you have the latest u-boot, which supports fastboot (can be found in EB xelor artifactory).

Stop u-boot, and give following commands:
```
setenv vm2_partition 'name=boot,start=1MiB,size=50MiB;name=rootfs, \
  size=64MiB;name=data,size=480MiB;name=containers,size=512MiB;'
setenv vm3_partition 'name=rootfs2,size=64MiB;name=data2, \
  size=480MiB;name=containers2,size=512MiB;'
setenv partitions $vm2_partition$vm3_partition
setenv bootcmd 'ext4load mmc 1:1 0x50FFFFC0 bootstrap.uimage; bootm 0x50FFFFC0'
saveenv

fastboot udp
```
Output should be like that:
```
Using ethernet@e6800000 device
Listening for fastboot command on 192.168.7.14
```

Step 2  
Goto directory were the hypervisor binaries where installed
``` bash
cd hypervisor/eb_hypervisor_r-car-h3/
```
Give `./flash_emmc.sh <ip-address>` command.
ip-address is the same as the one hw is listening to, see output from Step 1.
``` bash
./flash_emmc.sh 192.168.7.14
```

After flashing script is done, hardware should boot automatically to hypervisor.
And the user can login to VM's:
```
vm2     :
vm2     | corbos 1.13.0 EBcore-vm2 hvc1
vm2     |
vm2     | EBcore-vm2 login:
vm1     : [   10.390488] ravb e6800000.ethernet eth2: Link is Up -
                                        100Mbps/Full - flow control rx/tx
vm1     | [   10.403145] IPv6: ADDRCONF(NETDEV_CHANGE): eth2: link becomes ready
vm1     | [   10.413330] br0: port 3(eth2) entered blocking state
vm1     | [   10.421371] br0: port 3(eth2) entered forwarding state
vm3     |
vm3     | corbos 1.13.0 EBcore-vm3 hvc0
vm3     |
vm3     |
vm3     | corbos 1.13.0 EBcore-vm3 hvc1
vm3     |
vm3     | EBcore-vm3 login:
```
