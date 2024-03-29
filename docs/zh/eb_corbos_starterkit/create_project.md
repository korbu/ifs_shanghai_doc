# 从头创建一个新工程
以添加一个加法服务为例，服务端提供两个int入参，并返回int值的接口`add2nums`。
最终实现两数相加，在VM1和VM2进行someip通信。

## 创建一个新的工程
``` bash
ara-cli Application --create-project --app ~/ara/eb/workspace/adg/demo/AddService --target-os eblinux
ara-cli Application --create-project --app ~/ara/eb/workspace/adg/demo/AddClient --target-os eblinux
```

## 导入新建的项目
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/import_new_project.png')" alt="导入新创建的项目">

注意：如果新导入项目没有Build Targets，需要关闭项目重新打开.  
右击AddService→Close Project  
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/close_project.png')" alt="关闭项目">


## 修改CMakeList
定义变量：
``` makefile
# This must be explicitly set when the project installs files for just 1 component (not devel)
set(CPACK_COMPONENTS_ALL runtime)  
```
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/modify_CMakelist.png')" alt="修改CMakeList">

## 修改project_config.json
### 修改deploy-files一栏的内容
需要将`<project name>`替换为你自己项目的名称。
``` json
"deploy-files": [
    {
        "items": [
            {
                "deploy-files-list": ["generated/config/<project name>_someip_machine1.json"],
                "deploy-files-dest": "/data/target/etc/adaptive/ara_Com/daemon_1"
            }
        ],
        "skip": "False"
    }
]
```
json文件最终会deploy到qemu里的`/data/target/etc/adaptive/ara_Com/daemon_1`目录

### 修改target-host为我们想要depoly的qemu地址
``` json
"target-host": [
    {
        "ip": "fd00::eb:2"
    }
],
```
"target-host" 里添加想deploy的目标ip, 现在qemu1是`fd00::eb:1`, qemu2是`fd00::eb:2`。

## Model文件夹内容
+ 拷贝Sensor_handel model文件夹下的：system.arxml和machine.arxml（原来的arxml需要先备份一下，之后会用到）到我们的项目里。这两个arxml是跟随环境定制的
+ 修改ExecutionManager.ecuconfig: (调用dlt的接口时需要用到share memory)
    <img :src="$withBase('/images/eb_corbos_starterkit/create_project/ExecutionManager_ecuconfig.png')" alt="EM配置">
+ 因为service.arxml里面用到了一些基本类型，从Senson_handler model里拷贝impltypes.arxml到我们项目中。  
+ 写我们的定义的服务接口add2nums：service.arxml，和deployment_udp.arxml。可以参照之前demo写。  

::: tip 注意
一个服务里可以同时有method, event, field接口。  
如果觉得需要划分功能，可以用多个功能相应的service.arxml和deployment_udp.arxml。  
下图为接口入参配置。  
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/interface_parameter_configuration.png')" alt="接口参数配置">
AddService_Interface为我们定义的一个Interface。
:::

下图为返回值配置：  
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/return_value_configuration.png')" alt="返回值信息">

Interfaceid 和instanceid和methodid在Deployment_udp.arxml中定义。  
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/Deployment_udp.png')" alt="部署信息">

ServiceInterface指向的是service.arxml中定义的Interface。  
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/ServiceInterface.png')" alt="Service接口">

SdServerConfig指向的Config中定义了我们服务的一些属性。  
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/SdServerConfig.png')" alt="SD Server端配置">

add2nums要指向到我们定义的函数接口。

如果不知道某项配置的指向可以点击倒三角然后跳转到定义处。  
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/other_configuration.png')" alt="其他配置">

## 在impl下面实现自己的代码
参考我们demo的实现代码。
Service端主要接口：OfferService，StopOfferService  
Client端主要接口：FindService

## 根据model生成配置文件
点击pluget里的插件 `AraComBindingGenerator.pluget` 生成SOA需要的源文件和头文件在项目 `generated` 文件夹里。  
点击pluget里的插件 `AraComManifestGenerator.pluget` 根据 `deployment_udp.arxml` 生成 配置文件 `**_someip_machine1.json` 在generated，用于VM之间通信。  
点击pluget 里的插件 `araEmManifestGen.pluget` 生成em所需要的一些配置文件，在做这一步时，`machine.arxml` 需要替换为之前备份的machine.arxml。

## 启动qemu1&qemu2
数字1代表qemu1.
``` bash
ara-network -a -N 1
```
<img :src="$withBase('/images/eb_corbos_starterkit/demo_ara_com/network_bridge.png')" alt="网络设置">

``` bash
ara-cli RunQemu --start 1 --target-os eblinux
```
<img :src="$withBase('/images/eb_corbos_starterkit/demo_ara_com/run_qemu.png')" alt="启动QEMU">

## 编译生成container，部署到qemu里
逐步点击Build Targets里的 Build ，CreateAppContainer，DeployAppContainer，DeployTargetFiles。

## 执行程序
``` bash
runc list 
```
查看已经运行container  
QEMU1:   
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/new_runc_list_qemu1.png')" alt="QEMU1">  
QEMU2:  
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/new_runc_list_qemu2.png')" alt="QEMU2">

重启com_daemon使其添加我们的someip配置文件(两个qemu都要做)。  
Qemu里执行：
```
systemctl restart com-daemon-container  
```
Qemu里执行：
```
ps ww | grep com_daemon  
```
可以看到qemu里com_daemon的启动参数里添加上了我们的配置文件。  
``` bash
/usr/bin/com_daemon -d -i fd00::eb:f5 fe80::8cd9:b4ff:fe7c:4548 -n eth0 -m /etc/adaptive/ara_Com/daemon_1/addclient_someip_machine1.json -c 255 -e /var/run/adaptive/ara_Com/ara_com_sm -g /var/run/adaptive/ara_Com/ara_com_gw_1_ --add_config /required_service_instances/*/maximum_number_of_instances=3
```

运行：  
Qemu1运行：
``` bash
runc exec -t AddService /opt/AddService/bin/AddService  
```
Qemu2运行：  
``` bash
runc exec -t AddClient /opt/AddClient/bin/AddClient  
```

下图可以看出qemu1的service和qemu2的client建立了连接，并且调用函数成功。  
<img :src="$withBase('/images/eb_corbos_starterkit/create_project/new_log.png')" alt="成功通信">

## 停止qemu
``` bash
ara-cli RunQemu --stop 1
```