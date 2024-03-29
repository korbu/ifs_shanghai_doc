# Valeria - 构建完整EB xelor软件包

EB xelor附带名为"Valeria"的构建工具，支持为不同的SoC构建对应的EB xelor软件包。
Valeria封装了Conan命令的调用，通过单一指令方便用户构建xelor软件。
EB xelor包含拥有不同属性的Conan包集合，例如运行在A5x这样性能核上的EB corbos Linux，运行在R7这样实时核上的RT_RefApp，直接运行在CPU上的固件，运行在EB corbos Linux上的EB corbos AdaptiveCore。
Conan可以根据定义在profiles中的设置或选项，进行不同属性的处理。
EB xelor项目包含很多不同属性的包，如果想获取所有需要的包，每次都需要调用很多次Conan命令，Valeria则简化了这个过程，通过读取对应manifest中的构建信息，调用相应的Conan指令。

## 基本理念
Valeria首先调用 `conan export` 获得所有的EB xelor recipes，保证Conan知道如何构建所有包。然后调用 `conan install --build` 开始构建。最后，它会上传这些Conan包到远程仓库，例如Arifactory。

为了保证正确地构建对应平台的包，Valeria使用 [conan build and host profiles](https://docs.conan.io/en/latest/reference/profiles.html#build-profiles-and-host-profiles)。

细节请参考后续章节。

## Build manifest

Manifest文件描述了哪些包需要构建，如何构建这些包等信息。

对于R-Car H3，我们定义了两个manifest文件
```
config/valeria/r-car-h3/manifests/buildmanifest_linuxbuild.xml
config/valeria/r-car-h3/manifests/buildmanifest_windowsbuild.xml
```
如果是S32G，则是
```
config/valeria/s32g/manifests/buildmanifest_linuxbuild.xml
config/valeria/s32g/manifests/buildmanifest_windowsbuild.xml
```

`buildmanifest_linuxbuild.xml` 代表Valeria会根据这个manifest文件在Linux环境中构建Conan包，与之对应的，`buildmanifest_windowsbuild.xml` 代表需要在Windows环境构建的manifest。

对于每一个包，都需要定义一套host和huild profiles。
例如，`config/valeria/s32g/manifests/buildmanifest_linuxbuild.xml` 中 `u-boot` 信息:
``` xml
<ComponentBuildSpec>
    <BuildProfile>build/linux_x86_64</BuildProfile>
    <HostProfile>host/A53</HostProfile>
    <HostProfile>host/gcc7_arm64</HostProfile>
    <Recipe>eb_u-boot</Recipe>
</ComponentBuildSpec>
```
`u-boot` 在Linux x86_64环境中构建，运行在S32G SoC的A53核上。
因此我们定义BuildProfile为 `build/linux_x86_64`，HostProfile则是 `host/A53`。
我们还会用到gcc-linaro编译器来构建 `u-boot`，所以我们还需要定义一个HostProfile为 `host/gcc7_arm64`。

Profiles位于 `config/valeria/r-car-h3/profiles`（R-Car H3） ，`config/valeria/s32g/profiles`（S32G）。

需要注意的是，并非所有recipes都会定义在这个manifest文件中，你只需要列出依赖链上起始recipe。
Conan会构建 `requires` 或 `build_requires` 列出的recipe。
例如:

* EB corbos Linux并没有列出来，因为它是Hypervisor的构建必须项，Linux镜像会是Hypervisor包的一部分
* the compiler required for building the u-boot is not listed, as it is a build requirement of the u-boot.

作为依赖项的Profile，Conan会自动读取它们。
例如构建firmware，需要用到gcc-linaro编译器，我们也会在manifest中指定firmware在linux环境中构建，Conan会知道需要先构建gcc-linaro。

## 从其他channel拷贝包
类似于在git的某个branch上工作，你可以创建你自己的Conan channel来添加新功能。
例如，EB xelor团队为每一个git分支都有对应名为`merge-EBCORE-<jira-id>`的channel。
为了重用主开发分支的包，当你使用 `--conan-copy-ref <ref_user>/<ref_channel>:<ref_repo>` 命令时，Valeria会拷贝这些包到你的临时channel。
在你构建之前，Valeria会在 `ref_user` 和 `ref_channel` 中搜索 `ref_repo` 包，如果找到了相同的RREV以及Package ID, Valeria 会下载到本地缓存，拷贝到你的user/channel中。
由于已经有了包，Conan不会再构建这些包。当你在自己的channel第一次构建，或者将master的改动merge到你的分支中时，这个选项对你会很有用。

## 构建需求的处理
Conan假定 [build requirement](https://docs.conan.io/en/latest/devtools/build_requires.html)的改动并不会影响使用它的人最终生成的包。
例如，当构建需求主要是CMake这样的构建工具时，就很有意义。
当然，像编译器这样的构建需求，肯定会有直接影响。
Conan文档推荐在相关recipe中定义并声明特定的设置或选项，使它在计算package ID时产生影响。
例如，编译器版本 `compiler.version` 会影响package ID的计算.
新的编译器会导致产生一个新的package ID，即使使用了 `missing` 选项，还是会触发rebuild。

Conan计算Package ID会包含需求版本和其他属性的影响，不需要额外设置。
更多信息请参考 [Conan package ABI compatibility](https://docs.conan.io/en/latest/creating_packages/define_abi_compatibility.html).

当然，对于持续集成系统来说，你的目标可能是希望开发人员的一个小改动能得到快速验证。
也就是说，你只想重新构建这个改动所影响的包。
因此，一般来说持续集成系统会用到 `missing` 选项。
另外，在合并验证时，你可能会用到channel拷贝功能，来完成branch rebase后的快速验证。

在EB xelor中，大多数包最后构建出来的二进制文件，都会由于构建需求的变动而不同。
例如, `RT_RefApp` demo是依赖于EB tresos AutoCore产品的，也就是说你可以通过Conan设定来解决构建需求的问题，但当你每次想rebuild的时候，你都需要手动更改设定。

为了解决这个问题，当使用 `--build <policy>` build policy时， Valeria通过以下方式处理构建需求:

将所有recipe导出到Conan缓存后， Valeria 会解析每一个依赖树。
它会检查每一个构建需求，是否在本地缓存或者远程仓库已经有了一个具有相同的名字，版本，user，channe，recipe版本和package ID的包。
如果Valeria找不到这样的包，它会重新构建这个包以及依赖于它的包。

如果你没有通过 `--build` 选项提供了构建policy，Conan会构建每一个包。

## Packages that deploy files
EB xelor中大多数提前构建好的Conan包，包含由Conan recipe `package()` 方法打包而成的构建物（firmware, 文件系统image等）。
当安装此类包时，它会根据Conan recipe `deploy()` 方法拷贝到用户空间中。 
EB xelor uses Conan's package deploy feature to get package contents available for the users and test systems.

执行Valeria构建命令时，它会构建并安装包，每一个安装的包都会部署在 `build/deploy/buildspec-x` 文件夹,  `x` 代表build manifest中构建内容的序号。

当再次执行Valeria构建命令(rebuilding)时，如果 `build/deploy` 文件夹不为空, Valeria 会停止构建并提示警告。
调用Valeria指令时指定 `-cdd` /  `--clean-deploy-dir` 选项, 它会在构建时自动清除 `build/deploy` 文件夹内容。

## 如何调用Valeria
Valeria是一套python脚本，位于：
```
tools/valeria/valeria.py
```
不输入任何参数时，Valeria会显示帮助列表。

Valeria会在调用的目录下建立 `build` 子目录。
在这个目录下，Valeria安装Conan包，为每一个构建细则生成三个Conan lockfile。

### Lockfiles
lockfiles命名规则如下:
`valeria-buildspec-<number>-<step>.lock`. `number` 代表build manifest中构建细则的位置。
lockfiles有如下这些 `step`:

* `valeria-buildspec-<number>-init.lock`:
在执行 `conan install` 之前，利用 `lock create` 命令生成。它包含构建细则中除了包版本信息的完整依赖树。
Valeria将这个文件作为执行 `conan install` 动作的输入信息。
这个文件包含构建需求信息。
* `valeria-buildspec-<number>-inst.lock`:
它是 `conan install` 命令的输出.
它包含构建的包的完整版本信息。
Additionally, each built Conan package has a 'modified' entry.
* `valeria-buildspec-<number>-full.lock`:
在执行 `conan install` 之后，利用 `lock create` 命令生成。
它包含构建或下载的包的完整版本信息。

### Linux
本节描述了如何为Renesas R-Car H3和NXP S32G构建完整EB xelor包。 
以NXP S32G为例，如果你想构建H3, 只需要将 `s32g` 替换为 `r-car-h3`。 

假设源代码在：
```
/workdir/EBxelor-2020.12
```
构建的输出文件在：
```
/workdir/valeria/s32g
```

执行以下命令：
```
mkdir -p /workdir/valeria/s32g
cd /workdir/valeria/s32g
/workdir/EBxelor-2020.12/tools/valeria/valeria.py -b missing -M build \
-m /workdir/EBxelor-2020.12/config/valeria/s32g/manifests/\
buildmanifest_linuxbuild.xml \
-p /workdir/EBxelor-2020.12/config/valeria/s32g/profiles \
-r /workdir/EBxelor-2020.12/pkg \
-cr eb_core-devdrops \
-ccr EBxelor/2020.12:eb_core-releases \
-cdd \
your_user valeria-test
```
以上命令中出现的选项：

* `-b missing -M build`: 构建本地Conan缓存没有的包，使用的构建参数是 `missing`
* `-m /workdir/EBxelor-2020.12/config/valeria/s32g/manifests/buildmanifest_linuxbuild.xml`: 使用的build manifest 
* `-p /workdir/EBxelor-2020.12/config/valeria/s32g/profiles`: profile路径
* `-r /workdir/EBxelor-2020.12/pkg`: recipe路径，子目录也会被解析
* `-cr eb_core-devdrops`:  `conan remote` 会使用到的Artifactory仓库。EB xelor的开发使用 `eb_core-devdrops` 仓库
* `-ccr EBxelor/2020.12:eb_core-releases`: 从用户 `EBxelor` ，channel `2020.12` ，仓库 `eb_core-releases` 拷贝已有（相同）的包
* `-cdd`: 删除已有的构建目录
* `your_user valeria-test`: Conan 用户 和 channel

后续的调用中， `-ccr` 选项可以忽略，它是第一次创建新channel  `user/valeria-test` 时用到的。

如果你想上传包到远程仓库，使用 `-n 0` 命令。

### Windows
假定源代码位于 `./EBxelor-2020.12` ，我们在同目录创建一个工作目录 `./EBxelor-2020.12` 。

同时，我们也假定构建命令在例如git bash或cygwin这样的bash shell中执行。

在Windows环境下的详细构建指导，请参考 [EB Tresos](./eb_tresos.md) 。

```
cd valeria-build
python ../EBxelor-2020.12/tools/valeria/valeria.py -b missing -M build \
-m ../EBxelor-2020.12/config/valeria/s32g/manifests/\
buildmanifest_windowsbuild.xml \
-p ../EBxelor-2020.12/config/valeria/s32g/profiles \
-r ../EBxelor-2020.12/pkg \
-cr eb_core-devdrops \
-ccr EBxelor/2020.12:eb_core-releases \
-cdd \
your_user valeria-test
```

参数定义和上方Linux环境构建时相同。


### 下载发布包
你也可以调用Valeria直接下载EB xelor发布包。
以S32G的 `2020.12` Linux环境发布包为例:
```
mkdir -p /workdir/valeria/s32g
cd /workdir/valeria/s32g
/workdir/EBxelor-2020.12/tools/valeria/valeria.py -b missing -M build \
-m /workdir/EBxelor-2020.12/config/valeria/s32g/manifests/\
buildmanifest_linuxbuild.xml \
-p /workdir/EBxelor-2020.12/config/valeria/s32g/profiles \
-r /workdir/EBxelor-2020.12/pkg \
-cr eb_core-releases \
-cdd \
EBxelor 2020.12
```
这个时候我们不使用 `-ccr` ，conan包不会被拷贝到另一个user/channel当中。
你需要使用用户 `EBxelor` ，channel `2020.12`, 仓库 `eb_core-releases` 。
当然，你也无法将包上传到 `eb_core-releases` 中。

::: tip 提示
如果本地源代码(目录 `/workdir/EBxelor-2020.12`) 与发布（例如 `EBxelor 2020.12` ）完全相同, 那么这些包将直接从Artifactory下载，而不会rebuild。

如果本地recipe有改动，那么这个recipe会被重新构建。
:::

以S32G的 `2020.12` Windows环境发布包为例:
(更多Windows环境下Conan配置信息，请参考  [EB Tresos](./eb_tresos.md) ):
```
cd valeria-build
python ../EBxelor-2020.12/tools/valeria/valeria.py -b missing -M build \
-m ../EBxelor-2020.12/config/valeria/s32g/manifests/\
buildmanifest_windowsbuild.xml \
-p ../EBxelor-2020.12/config/valeria/s32g/profiles \
-r ../EBxelor-2020.12/pkg \
-cr eb_core-releases \
-cdd \
EBxelor 2020.12
```

::: tip 提示
如果不想触发重新构建，你可以运行Valeria命令直接下载二进制文件，对于Windows，Manifest文件是 `buildmanifest_windowsbuild.xml` 对于Linux，则是 `buildmanifest_linuxbuild.xml` 。
:::