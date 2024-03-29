# 系统分析
本章会介绍如何使用一些工具来进行测试，理解EB xelor软件所执行的动作。

// eap://E6A93D5D-3300-4900-B618-F959546D16DC/doc

## DLT Viewer
DLT Viewer 是GENIVI提供的带GUI界面的运行时DLT消息虚拟化 https://github.com/GENIVI/dlt-viewer[open-source software]

和其他软件一样，DLT viewer也由Conan打包，开发者可以很容易的获取。目前支持 Linux 和 Windows 系统。

::: tip 提示
DLT Viewer needs a graphical server to run, which the current Docker
image used for development purposes does not offer. You will be able
to retrieve the package, but must step out of the container before
using it. You will _also_ need to install Qt libraries into your Linux
host, e.g. for an Ubuntu-based distro:
`sudo apt-get install qt5-default libqt5serialport5-dev`
:::

对于DLT以及DLT viewer使用方法，请参阅
https://github.com/GENIVI/dlt-viewer/blob/v2.20.0/doc/dlt_viewer_user_manual.pdf[
official user guide.]

DLT viewer的安装:

### Installing DLT Viewer on Linux

We assume you already [Obtain](obtain.md) You should
then use the following command _after_ [Docker](docker.md)

Then, assuming you would like to install in `my_dltviewer_install/`:

```
conan install \
    -if my_dltviewer_install  \
    -pr config/valeria/native/profiles/linux_x86_64 \
    -pr config/valeria/native/profiles/gcc \
    -r eb_core-releases \
    eb_dltviewer/0.1.1@EBxelor/2020.12
```

All binaries (ELF executable, libraries, and DLT Viewer plugins)
are laid flat into `my_dltviewer_install/`. To run it, you will
need to update `LD_LIBRARY_PATH` (e.g. in your bashrc):

```
cd my_dltviewer_install/
LD_LIBRARY_PATH="$LD_LIBRARY_PATH":$(pwd) ./dlt-viewer
```

::: tip 提示
You won't be able to install DLT Viewer to a standard path like
`/usr/bin/` from the (unprivileged and chrooted) Docker container.
Hence the local deployment instead. Feel free to manually copy
binaries in your system afterwards, though.
:::

### Compiling DLT Viewer on Linux
The EB xelor Docker environment is already equipped for building
DLT Viewer natively. Use Valeria with a simple build manifest
for the "native" target, or use Conan directly.

### Installing DLT Viewer on Windows

We assume you already [Obtain](obtain.md)
We also assume you already intall on Windows.
If not, please do this beforehand.

Then, assuming you would like to install in `C:\DltViewer\`:

```
conan install \
    -if "C:\DltViewer" \
    -pr config/valeria/native/profiles/windows_x86_64 \
    -pr config/valeria/native/profiles/visual_studio \
    -r eb_core-releases \
    eb_dltviewer/0.1.1@EBxelor/2020.12
```

You can then launch DLT Viewer directly by double-clicking on
the executable, as usual.

### Compiling DLT Viewer on Windows

At the moment, no Windows Docker environment is available
for developers, so you will have to use the CI ("native"
Windows build manifest for Valeria), or install the toolchains
yourself.

When opting for the latter, here is what you need to do:

* Install Qt 5.12.4
  (http://download.qt.io/official_releases/qt/5.12/5.12.4/qt-opensource-windows-x86-5.12.4.exe.mirrorlist[
  link to official installer])
* Install Visual Studio 2017 Community 15.9
  (https://my.visualstudio.com/Downloads?q=Visual%20Studio%202017[
  you can find it in this list]) Using the graphical installer wizard:
    * Tick "Desktop development with C _plus plus_" on the panel you're
   first shown (toolsets selections)
    * This should be enough to get all necessary components
* Use the regular Conan workflow in a Powershell

Before starting, you should set `QTDIR` and `MSVC_DIR` to
the appropriate install paths. On Powershell, you can do this
using `$env:QTDIR = "path"` and `$env:MSVC_DIR = "path"`. For the
record, if you kept default you should have something like the
following:

```
C:\Qt\Qt5.12.4\5.12.4\msvc2017_64
C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\VC
```

You may then call `conan source|install|build|package` as usual.

### Sample project file

DLT Viewer stores both global and project-specific settings in
_.dlp_ files. Those describe the expected ECUs, how to connect
to them, and possibly additional filters and plugins.

You can find a generic project file in
_/tools/dlt_viewer/DLT_DefaultCfg.dlp_ in the project
sources. We suggest you start from it to build your own
detailed configuration, to suit your needs. This project file
offers:

* Default settings
* Listing of ECUs
    * "Adaptive" virtual machines (_alpha_ and _beta_)
    * "Classic" firmware (_real-time reference app_)
* Basic filters
    * System journal, Execution Manager activity and "Get Software Version" requests for Adaptive virtual machines
    * All warnings
    * All errors / fatal errors

### DLT identifiers for EB xelor

The following are essential identifiers describing ECUs and
a few applications. They form a small basis, and should be
made more diverse in the future. Please update them if you
happen to change or add some.

|ECU ID|Description|
|--|--|
|RTRA|Real-Time Reference Application|
|ALPH|Linux Adaptive AUTOSAR VM "alpha"|
|BETA|Linux Adaptive AUTOSAR VM "alpha"|

|ECU ID|APP ID|CTX ID|Description|
|--|--|--|--|
|RTRA|CYCL|TIMG|Cyclic counter transferred over the various networks, and also over DLT|
|ALPH|SH|_N/A_|Demo application "SensorHandler"|
|ALPH|LOG|JOUR|EB Linux journal|
|ALPH|Adaptive Core|_N/A_|Please refer to the appropriate section in ADG user's manual, which can be found [here](https://gitext.elektrobitautomotive.com/EB-corbos-AdaptiveCore/ara-corbos-AdaptiveCore-deliveries) at the moment|
|BETA|SP|_N/A_|Demo application "SensorPreprocessor"|
|BETA|LOG|JOUR|EB Linux journal|
|BETA|Adaptive Core|_N/A_|Please refer to the appropriate section in ADG user's manual, which can be found [here](https://gitext.elektrobitautomotive.com/EB-corbos-AdaptiveCore/ara-corbos-AdaptiveCore-deliveries) at the moment|

### Licensing

It _shall_ be possible to:

* Use DLT Viewer _internally_
* Redistribute DLT Viewer for use _internally_ and by _customers_
    * Customers can be provided the full binary package (DLT Viewer + Qt libraries)
    * Customers can be provided only DLT Viewer binary + guidance regarding Qt installation

For more details about licensing, please take a look at the
`_/pkg/eb_dltviewer/LICENSE.adoc_` file stored along the package source.
