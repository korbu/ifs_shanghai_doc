# 网络配置指南

EB xelor provides EB corbos Virtual Ethernet Switch to enable internal and external Ethernet communication of RT_RefApp and all VMs running on Hypervisor.

## EB xelor 网络设置

EB xelor contains RT_RefApp and VMs running on Hypervisor as the Ethernet user. This chapter lists all Ethernet user Network settings.

**RT_RefApp 网络设置**:
* **IP 地址**: 
    * *IPv4*: 192.168.7.73
    * *IPv6*: fd00::eb:73/64
* **MAC 地址**: AA:BB:CC:DD:00:33
* **测试机 IP 地址**: 
    * *IPv4*: 192.168.7.100
    * *IPv6*: fd00::eb:100/64

::: tip 提示
The test machine's Ethernet interface settings must be consistent with which of RT_RefApp:
Ethernet interface: 1000Mb/s as speed with FUll duplex.
:::

Currently we have 3 Adaptive AUTOSAR VMs running on Hypervisor:

- **vm-hub 网络设置**: 
    * **IPv4**: 192.168.7.1
    * **IPv6**: fd00::eb:1/64
    * **MAC 地址**: AA:BB:CC:DD:00:34
- **vm-alpha 网络设置**: 
    * **IPv4**: 192.168.7.2
    * **IPv6**: fd00::eb:2/64
    * **MAC 地址**: AA:BB:CC:DD:00:35
- **vm-beta 网络设置**: 
    * **IPv4**: 192.168.7.3
    * **IPv6**: fd00::eb:3/64
    * **MAC 地址**: AA:BB:CC:DD:00:36

## EB corbos vSwitch 介绍
EB corbos Virtual Ethernet Switch 是 EB corbos 产品线的一部分，也可以使用在 EB tresos 项目中。
本节介绍 EB corbos vSwitch 如何为RT_RefApp和不同的VMs之间提供网络通信。

::: tip 提示
EB corbos vSwitch 工作模式和RT_RefApp的调度和内存配置有关。
RT_RefApp操作系统负责配置并保护虚拟机的Virtual Ethernet driver 和 Virtio device proxy的内存分区。
:::

**EB corbos Virtual Ethernet Switch包含以下组件:**
```
TODO: Wait to insert a structure photo of vSwitch from EA document
```
- **Virtual Ethernet driver**. 每个虚拟机和RT_RefApp都需要有各自的Virtual Ethernet driver以保证以太网通信。
Virtual Ethernet driver是虚拟机和RT_RefApp 以太网协议栈的底层驱动。
它不会和以太网控制器硬件通信，而是和EB corbos vSwitch通信，包含以下实体:
    * **Reception buffer queue**: The reception buffer queue is used for receiving Ethernet packets and must be configured as non-cached(Which is configured in MkMemoryProtection of OS). Each Virtual Ethernet driver can have one or more reception buffer queues  (separated to receive external and internal traffic). 
    * **Transmission buffer queue**: The transmission buffer queue is used for transmitting of Ethernet packets and must be configured as non-cached(Which is configured in MkMemoryProtection of OS). There can be one or more transmission buffer queues with own QoS configurations. 
    * **Control queue**: The control queue is used to communicate to the local MAC addresses (unicast address and multicast addresses) from the Virtual Ethernet driver to the EB corbos vSwitch. 
- **VirtIO device proxy**. VirtIO device proxy是Hypervisor的一个独立应用。每一个Adaptive AUTOSAR虚拟机都需要有一个VirtIO device proxy 
(RT_RefApp和Classic AUTOSAR虚拟机不需要)。 VirtIO device proxy会将所有VirtIO设备配置空间访问转换成与EB corbos vSwitch的shared memory通信。
- **EB corbos Virtual Ethernet Switch**. EB corbos vSwitch 在RT_RefApp中实现，直接控制硬件设备SysDMA和EthCtrl。
它包含以下实例:
    * **Reception buffers (external)**: A buffer queue for receiving multicast and broadcast Ethernet packets from the external Ethernet bus. 
    * **Reception Dispatcher**: Handle all received Ethernet packets (Both from external Ethernet bus or from internal VMs or RT_RefApp).
    * **Transmission Dispatcher**: Detect and forward new Ethernet packets which are ready to transmit in the transmission buffer queues of every Virtual Ethernet driver.
- **System DMA** is used for copying ethernet packets from EB corbos vSwitch to different VMs. 
- **Ethernet controller** is the hardware unit for sending and receiving of ethernet packets to and from the external Ethernet bus. 
- **Hypervisor**: The Hypervisor allocates memory ressources from the global DRAM and maps the appropriate memory regions for the Virtual Ethernet driver and VirtIO device proxy instance to the 
different execution environments in order to provide memory separation (for the purpose that different virtual machines may host potentially different guest operating systems).  
The Hypervisor handles interrupts and exceptions of the virtual machines (e.g. when a new ethernet packet is available in the reception buffer queue of a virtual machine,   
the Hypervisor triggers the according interrupt for the Virtual Ethernet driver in that virtual machine).