# EB tresos以及示例程序RT_RefApp指南

EB xelor 提供 EB tresos AutoCore文件以及CP示例程序RT_RefApp的Conan包。

## 概述
本节介绍如何在Windows平台搭建Conan，使用Conan recipe构建/安装ET tresos和RT_RefApp。

::: tip 注意
目前EB tresos studio仅支持Windows。
:::

**EB tresos AutoCore 组件:**

ACP, MCAL, ACG, and Generic modules-update

image:5978760A-28DC-4231-A04F-6752787DD6ED.png[Architecture,scaledwidth="50%"]

## 在Windows平台安装Conan
As EB tresos AutoCore and RT_RefApp run only on Windows OS.
We need to set the Conan client on the Windows machine.
EB tresos AutoCore is packaged as EB tresos conan recipes in EB xelor.
Prerequisite: We assume that a bash shell is used, e.g. git-bash or cygwin.

**Python安装:**

- Download the OS corresponding python installer from https://www.python.org/.
At least python version 3.8 is required.

- Install python in the folder `C:\Tools\` (you can choose another directory)

**Conan安装:**
``` bash
python -m pip install -r tools/valeria/requirements.txt
```
::: tip 提示
For more Conan installation detail, please refer to https://docs.conan.io/en/latest/installation.html
:::

::: warning 警告
The path length limitation shall be disabled.  
`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
`LongPathsEnabled` shall be equal to 0x00000001
:::

::: warning 警告
Even with the previous configuration, the build of EB tresos applications can fail due to long
path names. This can be avoided by using conan feature to force short path names. Set the environment
variables `CONAN_USER_HOME_SHORT="C:\path\to\local-short-name-cache"`
and `CONAN_USE_ALWAYS_SHORT_PATHS="True"` to activate this.
:::

**安装Conan配置:**

- Get the EB xelor sources, see [Obtain](./obtain.md).

- Update the conan remote repositories, see [Configuration](configuration.md).

- Go to the folder where the sources are located and run the Conan configuration installation:
``` bash
$ conan config install config/conan/config
$ conan config install config/conan/config_ci
```

::: tip 提示
Usually, the Conan configuration is installed in the local cache `C:\Users\<User ID>\.conan\`  
You can use different caches by defining the environment variable `CONAN_USER_HOME`  
Refer to https://docs.conan.io/en/latest/mastering/custom_cache.html
:::

- Set the Conan username for the configured repositories: 
``` bash
conan user -r eb_core-releases <artifactory's login>
conan user -r eb_core-snapshots <artifactory's login>
conan user -r eb_core-devdrops <artifactory's login>
```

::: tip 提示
If it requires the password, please enter the <Artifactory’s login>'s password.
In case you only have access to the `eb_core-releases` repository, 
you should omit the `eb_core-snapshots` and `eb_core-devdrops` repository initialization, 
see [Configuration](configuration.md).
:::

::: tip 提示
When using cygwin, it can happen that the credentials are not stored by conan when
calling `conan user` from cygwin shell. In this case, please call the `conan user` command
from Windows command line first. Afterwards you can continue using cygwin.
:::

- Perform a Conan search command to make sure the result is returned:
``` bash
$ conan search -r eb_core-releases
```

The response should be similar to:
``` bash
Please log in to "eb_core-releases" to perform this action.
Execute "conan user" command.
Please enter a password for "<artifactory's login>" account:
Existing package recipes:

eb_adg/0.1.0@EBxelor/2020.10
eb_adg/0.4.0@EBxelor/2020.12-pre1
...
```

## Install jfrog command line interface in Windows

This is only necessary in case you want to rebuild EB xelor packages from source.
The incoming supplies for Tresos are stored in Artifactory and jfrog cli is used to access those.

- jfrog installation:

Download the jfrog from https://api.bintray.com/content/jfrog/jfrog-cli-go/$latest/jfrog-cli-windows-amd64/jfrog.exe?bt_package=jfrog-cli-windows-amd64[jfrog cli website]

- Set jfrog PATH:

Move jfrog.exe to your work directory: e.g. ../workspace/jfrog.exe +
Add the work directory of jfrog (e.g. ../workspace) into `Environment Variables->System variables->Path`

- jfrog configuration:
``` bash
$ jfrog rt config --url=https://artifactory-central.elektrobit.com/ \
--user=EB_account_user --password=EB_account_password
```

jfrog configuration on windows is equivalent to linux, please refer to [Docker](docker.md) section.

### Build the EB tresos binaries
::: tip 提示
Please refer to [Valeria](valeria.md) for building the whole EB tresos locally.
:::


## RT_RefApp installation and build
RT_RefApp's project configuration is stored in `pkg\eb_rt-refapp\workspace\`

### Getting the RT_RefApp binaries
**Prerequisite:**  
Conan setup on windows.

In case you did not use [Valeria](valeria.md) to build, please note that the conan profiles are using conan user and channel.
You need to create a file called `get_user_channel` in folder `config/valeria/r-car-h3/profiles` specifying user and channel. 
In this example we use user `EBxelor` and channel `2020.12`.
``` bash
CONAN_USER=EBxelor
CONAN_CHANNEL=2020.12
```

Step 1  
Search all available RT_RefApp packages from EB xelor Artifactory:
``` bash
$ conan search -r eb_core-releases eb_rt-refapp
```

The response should be similar to:
```
Existing package recipes:

eb_rt-refapp/0.3.5@EBxelor/2020.12
...
```

Step 2  
Create empty directory and install EB tresos AutoCore binaries from EB xelor Artifactory.
Replace version number and user/channel in the call in case you want to download other versions. 

For R-car H3:
```
$ mkdir RT_RefApp
$ cd RT_RefApp
$ conan install --profile:build \
  ../EBxelor-2020.12/config/valeria/r-car-h3/profiles/build/windows_x86_64 \
  --profile:build \
  ../EBxelor-2020.12/config/valeria/r-car-h3/profiles/build/soc_specific \
  --profile:host \
  ../EBxelor-2020.12/config/valeria/r-car-h3/profiles/host/R7 \
  --profile:host \
  ../EBxelor-2020.12/config/valeria/r-car-h3/profiles/host/keil_arm \
  -r eb_core-releases eb_rt-refapp/0.3.5@EBxelor/2020.12
```

For NXP S32G:
``` bash
$ mkdir RT_RefApp
$ cd RT_RefApp
$ conan install --profile:build \
  ../EBxelor-2020.12/config/valeria/s32g/profiles/build/windows_x86_64 \
  --profile:build \
  ../EBxelor-2020.12/config/valeria/s32g/profiles/build/soc_specific \
  --profile:host \
  ../EBxelor-2020.12/config/valeria/s32g/profiles/host/M7 \
  --profile:host \
  ../EBxelor-2020.12/config/valeria/s32g/profiles/host/gcc7_arm32 \
  -r eb_core-releases eb_rt-refapp/0.3.5@EBxelor/2020.12
```

::: tip 提示
This step will just download the RT_RefApp *elf* file.
:::

### Build the RT_RefApp binaries
::: tip 提示
Please refer to <<Valeria>> for building the RT_RefApp locally.
:::

This chapter will show you how to build the RT_RefApp manually or with CI.

RT_RefApp build workflow:

image:E83B1387-9D8C-4660-9DCA-23AD07D76041.png[Architecture,scaledwidth="50%"]

Please follow the below command instruction to build the RT_RefApp in the local cache.
Replace `user/valeria-test` by the conan user and channel that you are using.
``` bash
$ mkdir RT_RefApp
$ cd RT_RefApp
$ conan install --build missing \
  --profile:host ../EBcore-main/config/valeria/r-car-h3/profiles/host/R7 \
  --profile:host ../EBcore-main/config/valeria/r-car-h3/profiles/host/keil_arm \
  --profile:build \
  ../EBcore-main/config/valeria/r-car-h3/profiles/build/windows_x86_64 \
  --profile:build \
  ../EBcore-main/config/valeria/r-car-h3/profiles/build/soc_specific \
  ../EBcore-main/pkg/eb_rt-refapp/conan user/valeria-test
$ conan source ../EBcore-main/pkg/eb_rt-refapp/conan/conanfile.py
```

The response should be similar to:
``` bash
Using lockfile: 'D:\tmp\refapp/conan.lock'
Using cached profile from lockfile
conanfile.py (eb_rt-refapp/0.2.0@user/valeria-test): \
Configuring sources in D:\tmp\refapp
conanfile.py (eb_rt-refapp/0.2.0@user/valeria-test): \
Executing exports to: D:\tmp\refapp
conanfile.py (eb_rt-refapp/0.2.0@user/valeria-test): \
exports_sources: Copied 1 file: .project
conanfile.py (eb_rt-refapp/0.2.0@user/valeria-test): \
exports_sources: Copied 32 '.mem' files
conanfile.py (eb_rt-refapp/0.2.0@user/valeria-test): \
exports_sources: Copied 45 '.xdm' files
...
```

::: tip 提示
If you are using `git bash` or `cygwin` console, you can use below command to continue. If you are using Windows `cmd`, please replace `export` by `set`.
:::

Set the environment variable for EB tresos license server:
``` bash
$ export EB_LICENSE_FILE="<Address of the EB tresos license server"
```

::: tip 提示
Here we need to set the absolute path to the RT_RefApp project's directory.
:::

Set the environment variable for ARM Keil:
``` bash
$ export ARMLMD_LICENSE_FILE="The adresse of the ARM Keil license server"
```

Call the Conan `build` method to generate the RT_RefApp's configuration and make the build
``` bash
$ conan build ../EBcore-main/pkg/eb_rt-refapp/conan/conanfile.py
```
