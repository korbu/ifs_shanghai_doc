# 配置

## Conan 仓库
在`config/conan/config/remotes.txt`文件中，默认配置的是EB Artifactory仓库，根据实际需要进行更改。
如果你只想从EB下载二进制包，那么只需要保留这个路径：
```
https://artifactory-central.elektrobit.com/api/conan/eb_core-releases-conan
```

## Git
如果你使用内部release的脚本获取源码，你可以选择你喜欢的方式进行获取，例如使用ssh key，而不是用户名/密码进行认证。

使用git时，请配置以下：
``` bash
git config --global color.ui auto
git config --global user.name "Firstname Lastname"
git config --global user.email "my.email@address.com"
```
