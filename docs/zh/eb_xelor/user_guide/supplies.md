# 来自供应商的文件
由于授权限制，个别文件需要你直接从供应商获取。

## 由NXP提供的文件

### LLCE
低延时通信引擎（LLCE）固件包含以下4个二进制文件:

* DTE.bin
* PPE_RX.bin
* PPE_TX.bin
* FRPE.bin

你需要通过NXP获取他们，然后替换`test/software/config/flash_config_serials32g.json`中`filename`的路径。

### Flasher
从NXP获取烧写工具`S32FlashTool`后，替换`test/software/config/flash_config_serials32g.json`中以下路径:

* `flash_algorithms/QSPI`
* `flash_algorithms/EMMC`
* `flash_algorithms/SD`
* `flash_writer`
* `target_application`