# EB corbos AdaptiveCore

The EB corbos AdaptiveCore is based on the AUTOSAR Adaptive Platform specification and contains hardware-independent
Adaptive Platform components and the run-time environment for adaptive applications.
EB-specific enhancements that are compatible to the AUTOSAR Adaptive standard are implemented.
EB corbos AdaptiveCore is the software base for safe and secure high-performance controllers.

When building the EB ADG modules the Yocto SDK toolchain provided by the EB xelor is used.

The open source libraries needed by the ADG are also included.

## Building the ADG

**Prerequisite:**  
Conan is installed on your workplace, for details see [Docker](./docker.md)

In case you did not use [Valeria](./valeria.md) to build, please note that the conan profiles are using conan user and channel.
You need to create a file called `get_user_channel` in folder `config/valeria/r-car-h3/profiles` specifying user and channel. 
In this example we use user `EBxelor` and channel `2020.12`.
``` bash
CONAN_USER=EBxelor
CONAN_CHANNEL=2020.12
```

Step 1 +
Search all available EB corbos AdaptiveCore packages from the EB xelor artifactory
``` bash
conan search -r eb_core-releases eb_adg*
```

Step 2 +
Create an empty directory and install the eb_adg from the EB xelor artifactory.
Replace version number and user/channel in the call in case you want to download other versions.

For R-Car H3:
``` bash
mkdir eb_adg
cd eb_adg
conan install \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/host/A5x \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/host/eb_linux \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/build/linux_x86_64 \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/r-car-h3/profiles/build/soc_specific \
-r eb_core-releases eb_adg/0.5.1@EBxelor/2020.12
```

For NXP S32G:
``` bash
mkdir eb_adg
cd eb_adg
conan install \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/host/A53 \
--profile:host=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/host/eb_linux \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/build/linux_x86_64 \
--profile:build=\
/workdir/EBxelor-2020.12/config/valeria/s32g/profiles/build/soc_specific \
-r eb_core-releases eb_adg/0.5.1@EBxelor/2020.12
```


## Description of binary files
For a description of the files placed in the directories of the ADG modules please have a look into the ADG documentation.


## Building the ADG

For building the ADG the ara-cli is used.
The EB xelor Yocto SDK is defined as custom toolchain.

The ADG provides patch files to fix errors in the ADG modules.
They are located in
```
pkg/eb_adg/patch
```

For building the ADG additional modules are needed in the EB linux image.
Therefore some packages are added to the EB linux build and to the yocto-SDK
```
pkg/eb_linux/yocto/meta-ebcore/ \
recipes-images/images/core-image-eb-dev.bbappend
```

## ADG containers
The conan recipe `eb_adg_containers` takes the binaries from the `eb_adg` package and puts them into containers for EB corbos Linux.
With the flashing library, these containers can be installed on the target to start the ADG.

The installation of the containers also installs systemd service files for the ADG daemons.
They are started by default during startup.
You can check if the daemons are running using `systemctl`.
E.g. for the com daemon:
``` bash
systemctl status com-daemon-container
```
In case daemons are not starting, e.g. due to wrong configuration, you shall check the logs.
E.g. for the com daemon:
``` bash
journalctl -u com-daemon-container
```
