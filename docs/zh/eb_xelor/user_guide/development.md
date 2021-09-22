# 开发工作流
本节将介绍如何利用EB xelor开发包。

## Step 1: call valeria
首先你需要将所有包的信息取到本地conan缓存，保证所有需要的依赖都在你的本地。
如果你设置好了conan remote仓库，用户，和channel，所有未修改的包都会从Artifactory获得，而不需要重新构建。

::: tip 注意
使用stable channel时，注意不要随意上传文件。
开发时，建议使用你自己的用户和channel。
:::

::: tip 注意
EB xelor团队使用特定的仓库用来开发。
EB xelor持续集成系统使用 `EBcore/merge-EBCORE-1234` 来做合并验证,  `EBCORE-1234` 是git仓库的一个分支名。
本地使用同样的配置时，本地开发和持续集成系统会关联起来，方便重用包而不用重新构建。
:::

::: tip 注意
为了减少Valeria运行时间，你可以：

* 如果开发只涉及部分EB xelor代码，创建一个精简版Valeria build manifest
* 利用 `--build-policy` 指定你开发的包，pattern可参考
:::

## Step 2: 使用Conan工作流
运行完Valeria命令后，使用 https://docs.conan.io/en/latest/developing_packages/package_dev_flow.html[conan package 开发工作流].

作为例子，我们为R-Car H3改动位于 `pkg/eb_u-boot/conan` 的 `u-boot` 包。

调用conan指令时，你需要指定相应的profile配置。
你可以通过build manifest或者valeria输出来决定这些设置：
``` bash
[valeria] invoke: conan lock create 
--reference eb_u-boot/0.1.0@your_user/valeria-test 
--lockfile valeria-buildspec-1-init.lock 
--lockfile-out valeria-buildspec-1-full.lock
--profile:host 
/workdir/EBcore-main/config/valeria/r-car-h3/profiles/host/A5x
--profile:host 
/workdir/EBcore-main/config/valeria/r-car-h3/profiles/host/
gcc7_arm64
--profile:build 
/workdir/EBcore-main/config/valeria/r-car-h3/profiles/build/linux_x86_64
```

进入 `pkg/eb_u-boot/conan` 目录，然后执行：
``` bash
conan install \
--profile:host \
/workdir/EBcore-main/config/valeria/r-car-h3/profiles/host/A5x \
--profile:host \
/workdir/EBcore-main/config/valeria/r-car-h3/profiles/host/\
gcc7_arm64 \
--profile:build \
/workdir/EBcore-main/config/valeria/r-car-h3/profiles/build/linux_x86_64 \
--install-folder build . your-user/valeria-test
```
执行之后，所有构建相关的设定会在build文件夹中，然后你可以执行
``` bash
conan source --source-folder build --install-folder build .
conan build --build-folder build .
```
来构建u-boot包。

::: tip 注意
后续开发中，建议先用构建系统构建一次集成好的包，然后做增量（开发）构建。例如：
``` bash
cd build/u-boot-2018.09-rcar-3.9.5
export ARCH=arm64
export CROSS_COMPILE=\
/workdir/.conan/data/gcc7-arm64/0.1.0/your-user/\
valeria-test/package/\
4db1be536558d833e52e862fd84d64d75c2b3656/\
gcc-linaro-7.3.1-2018.05-x86_64_aarch64-linux-gnu/bin/\
aarch64-linux-gnu-
make -j 4
```
开发完成后，再次调用conan。
:::

::: tip 提示
基于EB xelor模板创建一个新的recipe文件 (conanfile.py):
``` bash
conan new --template pkg mypackage/1.2.3
```
然后遵从step 2中的conan包开发工作流来开发你自己的包。
:::
