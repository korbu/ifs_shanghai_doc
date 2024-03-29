# 烧写
EB xelor以Conan包形式提供二进制文件。
你可以手动或者通过调用python库的方式进行烧写。

当前只在原生Linux环境进行过验证，Cygwin或者虚拟机环境，或者是容器中，理论上也可行。

::: tip 提示
所需的Python库列在
'/tools/lib/python/ebcoreflashlib/' 目录下的requirements.txt文件中.

``` bash
sudo pip3 install -r requirements.txt
```

Linux环境下，以下包也是必须的：
fastboot, ethtool, expect
``` bash
sudo apt install -y fastboot ethtool expect
```

当前只在Linux环境进行过验证，如果你在Windoes环境设置了fastboot的PATH环境变量，理论上也是可行的。
:::

# 使用提供的库文件烧写

## Rcar H3的库文件

::: tip 烧写H3之前需要注意的事
检查H3
目标板上有正确的CPLD (Complex Programmable Logic Device, used for configuring the SoC's mode pins) 软件版本(20161005)。

如果软件版本低于20161005，请先升级。
如果软件版本高于20161005, 考虑到可能会有时钟问题，不推荐降级处理 (有可能导致目标板无法启动)。
:::

作为前提条件的是，你需要提前准备好Renesas H3的flash writer并且flasher可以调用到，你可以通过以下方式手动下载flash writer进行验证。

flash writer源代码可以从 https://github.com/renesas-rcar/flash_writer 获取。

如果由于路径问题无法设置在manifest中，你可以命令行调用的时候给入参数。

The flash library provides an interface for erasing and writing images to QSPI and eMMC flash memory in an automated way,
thus supporting usage on personal computers as well as in an automated toolchain (e.g. a Jenkins setup).
It can be configured via a JSON file and command line options.

Data transmission is possible over serial interface for QSPI, over fastboot/UDP for eMMC as soon as u-boot is installed, and over SSH as soon as Linux is booted.
The serial connection is also required for initializing fastboot transmission.
The flashing library uses the pexpect Python module to analyse the output patterns of the software running on the target.
The output is sent over the serial interface.
The flashing library implements the flow control to stop the target in the u-boot if required.

It is possible to flash only single memory areas or groups of multiple areas.

The config file can be validated against a JSON schema.

During the write process it can be necessary to operate some of the board's dip switches.
The library can trigger this automatically when given a set of callback functions doing the
actual switching (use --hw parameter). If you do not work in an automated test environment, you need
to apply the switches as described in Step 1 of [ManualFlashingH3].

::: tip 注意
Remove the board's main power before changing the mode switches. The mode switches are read by
the CPLD when the board first gets power, not when turning it on by pressing the power button.
:::

The library is implemented in Python and can be called directly from another Python program or from the command line.

**Prerequisites** for executing the flasher script:

* Serial connection to the board
* Ethernet (for fastboot eMMC flashing and SSH file transfer)
* Image files available (QSPI images have to be in .srec format) 
* Renesas Flash Writer for serial flashing
* Python 3 installed (at least version 3.8)
* Configuration file according to schema defined in `EBcore-main/tools/lib/python/ebcoreflashlib/JSON_flashlayout_schema.json`

## S32G的库文件

作为前提条件，你需要从NXP获取S32G flashing tool，然后安装。

flashing tool路径需要在manifest文件中设置。

为了让flasher工作，你还需要设置S32G板子上的跳线，使之工作在Serial Boot模式。
如果想用eMMC，你需要调整J50跳线。The silk screen near the jumper describes how to set it.

| Mode | SW14 | SW15 |
| -- | -- | -- |
| Serial Boot Mode | On-Off | Off-Off|
| Normal Boot Mode| Off-Off | Off-Off|

Flash库提供QSPI, eMMC, SD卡以及Linux文件系统的擦写接口，既可以单用户使用或者给自动化工具使用
(e.g. a Jenkins setup).
配置项可以通过JSON文件或命令行选项进行设置。

NXP flash tool通过串口进行通信，u-boot安装后可以通过fastboot/UDP通信，Linux安装后可以通过SSH方式进行通信。
Fastboot传输需要串口链接做初始化。

你可以一次只烧写一块内存或者一组内存区域。

库文件提供回掉函数，以方便在写入过程中需要调整dip开关。

库文件由Python语言编写，你可以通过命令行或在其他Python脚本中调用。

::: tip 注意
脚本已在Linux环境测试。
如果在PATH中设置了fastboot工具，Windows环境也能工作。
:::

执行flasher脚本的 **前提条件** :

* 与板子之间的串口连接
* 以太网连接 (for fastboot eMMC flashing and SSH file transfer)
* 镜像文件 (QSPI images have to be in .s32 format)
* 给串口使用的：NXP flash tool, target application ，flash algorithm file 
* 已安装Python 3 (at least version 3.8)
* 遵从 `EBcore-main/tools/lib/python/ebcoreflashlib/JSON_flashlayout_schema.json` schema的配置文件


## 配置文件

包含烧写区块，分组，网络，内存地址等信息。
配置文件配置项如下:

flash_area:: 烧写内容:
* filename: 文件名
* files: 如果使用 `file_installation` 选项, 则代表文件列表
* flash_address: 起始地址 (以0x开头的十六进制数, 至少两位)
* mem_size: 大小 (以0x开头的十六进制数, 至少两位) - only necessary for S32G targets
* block_size: block大小，Necessary for erasing (and consequently for writing) memory areas (hex with 0x prefix, at least two digits) - 仅针对S32G
* memory_type: `QSPI`, `eMMC`, `SD`, 或者 `file`
* RAM_address: RAM 映射地址 - 仅针对H3
* supported_protocol: `serial`, `fastboot`, 或 `file_installation`
* install_script:  如果使用 `file_installation` 选项, 文件传输结束后执行的脚本
flash_writer:: Renesas flash writer 或 NXP flash tool 文件路径， 路径是 `path_to_firmware` 的相对路径
flash_algorithms:: 以JSON键值对形式表示, 代表烧写区域/烧写算法，其路径为 `path_to_firmware` 的相对路径- 仅针对S32G
target_application:: 目标程序二进制文件。 其路径为 `path_to_firmware` 的相对路径- 仅针对S32G
group:: JSON objects for groups, each consisting of a single list of area names. Necessary if multiple flash areas of the same type shall be flashed with one command.
partition_table:: eMMC partitions, each with a name and a size. Optionally the first partition can have a start address. Only necessary for the `fastboot` flash method.
path_to_firmware:: 镜像文件和flash writer的base路径
target_ip_address:: fastboot UDP传输时使用的IP地址 - `fastboot` 时有用
target_mac_address:: 目标MAC地址 - `fastboot` only
target_username:: SSH 登陆时用户名 - `file_installation` only
target_password:: SSH 登陆时密码 - `file_installation` only
target_tmp_folder:: A temporary folder on the target to store files - `file_installation` only
use_external_emmc:: Whether to use external eMMC - not tested yet
version:: Config file version - not necessary for flashing, but 
MX25UM51245G_MEM_START:: QSPI memory起始地址 - S32G only
MX25UM51245G_MEM_BLOCK_SIZE:: Memory块大小 - S32G only
MX25UM51245G_MEM_SIZE:: QSPI memory大小 - S32G only

If a parameter is missing or specified incorrectly, it will very probably lead to an error in the flashing execution.

示例可参考：
```
EBcore-main/test/software/config/
EBcore-main/tools/lib/python/ebcoreflashlib/examples/
```

::: tip 注意
如果你在配置文件中使用绝对路径，请将 `path_to_firmware`
留空！
:::

## 命令行调用
*使用方法:*
``` bash
python3 EBcore-main/tools/flasher/ebCoreFlasher.py \
--manifest_file path_to_config_file.json \
--flash_method method \
[optional parameters]
```
**参数:**

--manifest_file:: Path to the config file.
--flash_method:: Flash method to be used for the area given: `fastboot`, `serial` or `file_installation`
-v, --verbose:: Set logging level to DEBUG.
--target_type:: Name of the target board SoC: `r-car-h3` or `s32g`
--flash_area:: Name of flash area / group to flash.
--erase_emmc:: Erase eMMC using the flash_method given. Currently only serial interface is supported.
--erase_qspi:: Erase QSPI using the flash_method given. Currently only serial interface is supported.
--erase_sd:: Erase SD using the flash_method given. Currently only serial interface is supported.
--flash_writer:: Name of the flash writer file.
--target_ip_address:: IP address of the target system.
--target_mac_address:: MAC address of the target system.
--com_port:: Serial port to be used for the communication (default=`/dev/ttyUSB0`).
--baudrate:: Serial port baudrate (default=`115200`).
--path_to_firmware:: Path to the firmware files.
--reboot_target:: Reboot target after flashing.
--json_schema_file:: JSON schema for validating the manifest file.
--json_schema_check_dry:: Don\'t write any memory, only validate the manifest file.
--manual_callback_timeout:: Set timeout when operating the target power and dip switches manually.
--hw:: Hardware description file which can be used to automate the user callbacks.

Command line parameters override those in the config file.

**示例**  
(assuming your working directory is `EBcore-main/tools/flasher` and the binaries are stored in
`../../../../artifacts` (or similar)):

Writing QSPI firmware to H3 board:
``` bash
python3 ./ebCoreFlasher.py \
--manifest_file ../../test/software/config/Fw_RcarH3_8GB.json \
--flash_method serial \
--flash_area QSPI_firmware \
--path_to_firmware=../../../../artifacts \
--target_type r-car-h3 \
--hw /platform.json
```

Writing all eMMC partitions of an H3 board:
....
python3 ./ebCoreFlasher.py \
--manifest_file ../../test/software/config/Fw_RcarH3_4GB.json \
--flash_method fastboot \
--target_type r-car-h3 \
--flash_area EMMC
....

Erasing all H3 memory:
....
python3 ebCoreFlasher.py \
--manifest_file ../../test/software/config/Fw_RcarH3_4GB.json \
--flash_method serial \
--target_type r-car-h3 \
--erase_emmc \
--erase_qspi
....

Install the adaptivecore-container. Assumption: the artifacts are located in directory `../artifacts`:
....
python3 ./tools/flasher/ebCoreFlasher.py \
--manifest_file ./test/software/config/vm-alpha.json \
--flash_method file_installation \
--flash_area adaptivecore-container \
--target_type r-car-h3 \
--path_to_firmware=../../artifacts \
....

## 使用python脚本调用

Main file of the library is
....
EBcore-main/tools/lib/python/ebcoreflashlib/flasher.py
....
It can be used in other Python scripts like this:
....
import ebcoreflashlib
my_flasher = ebcoreflashlib.Flasher(manifest_file, com_port)
....
Parameters are similar to those mentioned above.
`manifest_file` and `com_port` are mandatory.
Refer also to the docstring for detailed descriptions.

The flashing library provides the functionality to flash defined memory areas on the QSPI.
There is no file system on the QSPI.
The memory areas are directly addressed by a start address and a length.
For eMMC flashing you can define an image which is flashed to a defined partition on the eMMC.

For modifying single files in the file system, you can use the expectSSH.py file.
It provides the functionality to execute a command on the target.

Connect to the target using the expect library:
....
target = ExpectSSHConsole()
target.connect_and_login_to_vm(configuration)
....

Execute
....
target.run("scp -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no "\
           f"-p {tmp_file.name} {self.user}@{self.ip}:{test_file}")
....
This example copies a file from a remote host to the target.
The UserKnownHostsFile is redirected to the /dev/null device.
This prevents the key from being stored.
The option "StrictHostKeyChecking=no" is used to ignore key errors.
If you do not use this option you must have the correct host keys installed on the target.

[[ManualFlashingH3]]
# Rcar H3 firmware 手动烧写

*Prerequisites:*

* Firmware binary files are available

* Flash Writer from Renesas available

* Linux host with Minicom terminal emulator (`sudo minicom -D ttyx`)

::: warning 警告
Hardware and Software Flow Control must be turned off in Minicom serial port setup.
:::

::: tip 提示
Remove the board's main power before changing the mode switches. The mode switches are read by
the CPLD when the board first gets power, not when turning it on by pressing the power button.
:::

Step 1  
Start Minicom. Prepare Board and flash writer:

* Put SW6(1-4) dip switch to 0100 and SW1 to off.
The terminal should show the following output:
....
-- Load Program to SystemRAM ---------------
please send
....

* Type "CTRL+A S" and select upload method "ascii".
Then choose file for uploading e.g.
`AArch32_Flash_writer_SCIF_DUMMY_CERT_E6300400_m3ulcb.mot`.
After upload finished press any key.

Step 2  
First flash the bootparam_sa0.srec.
n console execute `xls2` command (load program to hyper flash) and provide the following inputs:
``` bash
1
y
y
y
e6320000
0
type "ctrl+A S" and select upload method "ascii", then choose file for uploading 
"bootparam_sa0.srec", after upload finished press any key
y
```

Step 3  
Next flash the ipl1.srec.
In console execute `xls2` command (load program to hyper flash) and provide the following inputs:
``` bash
1
y
y
y
e6302000
40000
type "ctrl+A S" and select upload method "ascii", then choose file for uploading 
"ipl1.srec", after upload finished press any key
y
```

Step 4  
Next flash the bl2.srec.
In console execute `xls2` command (load program to hyper flash) and provide the following inputs:
``` bash
1
y
y
y
e6330000
1c0000
type "ctrl+A S" and select upload method "ascii", then choose file for uploading 
"bl2.srec", after upload finished press any key
y
```

Step 5  
Next flash the bl31.srec.
In console execute `xls2` command (load program to hyper flash) and provide the following inputs:
``` bash
1
y
y
y
44000000
200000
type "ctrl+A S" and select upload method "ascii", then choose file for uploading 
"bl31.srec", after upload finished press any key
y
```

Step 6  
Next flash the u-boot-elf-h3ulcb.srec.
In console execute `xls2` command (load program to hyper flash) and provide the following inputs:
``` bash
1
y
y
y
50000000
640000
type "ctrl+A S" and select upload method "ascii", then choose file for uploading 
"u-boot-elf-h3ulcb.srec", after upload finished press any key
y
```

Step 7  
Put SW6(1-4) dip switch to 1010, then power off and on the hw.
If the firmware is booting correctly, the output should look like this:
``` bash
NOTICE:  (IPL1) BL2: DDR3200(rev.0.37)
NOTICE:  (IPL1) BL2: [COLD_BOOT]
NOTICE:  (IPL1) BL2: DRAM Split is OFF
NOTICE:  (IPL1) BL2: QoS is default setting(rev.0.21)
NOTICE:  (IPL1) BL2: DRAM refresh interval 1.95 usec
NOTICE:  (IPL1) BL2: Periodic Write DQ Training
[    0.000112] NOTICE:  BL2: R-Car H3 Initial Program Loader(CA53)
[    0.004553] NOTICE:  BL2: Initial Program Loader(Rev.2.0.4)
[    0.010085] NOTICE:  BL2: PRR is R-Car H3 Ver.2.0
[    0.014754] NOTICE:  BL2: Board is Starter Kit Rev.1.0
[    0.019851] NOTICE:  BL2: Boot device is QSPI Flash(40MHz)
[    0.025285] NOTICE:  BL2: LCM state is CM
[    0.029276] NOTICE:  BL2: v1.5(release):rc_1_3.0.0-dirty
[    0.034515] NOTICE:  BL2: Built : 09:54:45, Nov  1 2019
[    0.039702] NOTICE:  BL2: Normal boot
[    0.043346] NOTICE:  BL2: dst=0xe633b100 src=0x8180000 len=512(0x200)
[    0.049838] NOTICE:  BL2: dst=0x43f00000 src=0x8180400 len=6144(0x1800)
[    0.057621] NOTICE:  BL2: dst=0x44000000 src=0x8200000 len=65536(0x10000)
[    0.077097] NOTICE:  BL2: dst=0x50000000 src=0x8640000 len=1048576(0x100000)
[    0.307195] NOTICE:  BL2: Booting BL31
 
 
U-Boot 2018.09 (Jul 29 2019 - 14:16:12 +0000)
 
CPU: Renesas Electronics R8A7795 rev 2.0
Model: Renesas H3ULCB board based on r8a7795 ES2.0+
DRAM:  3.9 GiB
Bank #0: 0x048000000 - 0x07fffffff, 896 MiB
Bank #1: 0x500000000 - 0x53fffffff, 1 GiB
Bank #2: 0x600000000 - 0x63fffffff, 1 GiB
Bank #3: 0x700000000 - 0x73fffffff, 1 GiB
 
MMC:   sd@ee100000: 0, sd@ee140000: 1
Loading Environment from MMC... OK
In:    serial@e6e88000
Out:   serial@e6e88000
Err:   serial@e6e88000
Net:   eth0: ethernet@e6800000
Hit any key to stop autoboot:  0
=>                           
```
