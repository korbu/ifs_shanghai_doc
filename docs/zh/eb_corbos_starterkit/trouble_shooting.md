# 常见问题
## Some IP通讯失败 
在qemu中执行
``` bash
ps ww | grep com_daemon
```
查看com_daemon是否把配置文件加上。
<img :src="$withBase('/images/eb_corbos_starterkit/trouble_shooting/check_config.png')" alt="检查配置">

`/usr/bin/com_daemon` 应该是-m 选项， 来指定load的manifest file,  
如果不是，则需要执行
``` bash
systemctl restart com-daemon-container
```
来重启com-daemon
<img :src="$withBase('/images/eb_corbos_starterkit/trouble_shooting/restart_com_daemon.png')" alt="检查配置">

## qemu 与外部网络通信 
需要将`qemu`的网卡作为master 来桥接， 执行
``` bash
sudo ip link set ens33 master ara_br
```
其中`ens33`是host 的网卡

## ipv4 支持
EB corbos studio 默认支持ipv6 , 如果想使用ipv4 , 需要手动启动com-daemon，配置相应的ipv4 地址。以qemu1 为例：

登陆到qemu 
``` bash
ssh -o StrictHostKeyChecking=no root@fd00::eb:1
```

查看com_daemon 默认指令
``` bash
ps ww | grep com_daemon 
```
<img :src="$withBase('/images/eb_corbos_starterkit/trouble_shooting/com_daemon.png')" alt="检查配置">

可以看到默认的ipv6 地址， 需要将其改成ipv4 地址:  

进入adaptivecore-container 
``` bash
runc exec -t adaptivecore-container sh
```

查看ip 地址：
``` bash
ifconfig 
```
<img :src="$withBase('/images/eb_corbos_starterkit/trouble_shooting/ifconfig.png')" alt="检查配置">

可以看到ipv4 地址： `192.168.7.126` 

启动com_daemon：
``` bash
 /usr/bin/com_daemon -d -i 192.168.7.126 -n eth0 \
-m /etc/adaptive/ara_Com/daemon_1/sensor_manager_someip_machine1.json -c 255 \
-e /var/run/adaptive/ara_Com/ara_com_sm -g /var/run/adaptive/ara_Com/ara_com_gw_1_
```

::: tip 提示 
1. 命令是进到 adaptivecore-container 里执行操作，-i 后的地址是adaptive-container 的ip地址
2. -m 后面加的是someip manifest文件路径，注意是adaptivecore-container内的文件路径，
默认我们会做`mount`操作， 上述路径就是`deploy`默认路径， 只需要改文件名即可
:::