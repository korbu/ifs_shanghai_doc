"use strict";(self.webpackChunkifs_shanghai_doc=self.webpackChunkifs_shanghai_doc||[]).push([[668],{1820:(e,a,s)=>{s.r(a),s.d(a,{data:()=>n});const n={key:"v-538a889c",path:"/zh/eb_corbos_starterkit/installation.html",title:"安装",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"准备系统",slug:"准备系统",children:[]},{level:2,title:"解压安装包",slug:"解压安装包",children:[{level:3,title:"ADG-2.2（包含2.2）之前的版本",slug:"adg-2-2-包含2-2-之前的版本",children:[]},{level:3,title:"ADG-2.3 之后的版本，以qemu-x86为例",slug:"adg-2-3-之后的版本-以qemu-x86为例",children:[]}]},{level:2,title:"准备环境",slug:"准备环境",children:[]},{level:2,title:"添加环境变量",slug:"添加环境变量",children:[]},{level:2,title:"安装EB corbos Studio",slug:"安装eb-corbos-studio",children:[]},{level:2,title:"运行EB corbos Studio",slug:"运行eb-corbos-studio",children:[{level:3,title:"命令行操作",slug:"命令行操作",children:[]},{level:3,title:"点击图标操作",slug:"点击图标操作",children:[]},{level:3,title:"安装了多个corbos/adg版本",slug:"安装了多个corbos-adg版本",children:[]}]},{level:2,title:"选择workspace",slug:"选择workspace",children:[]},{level:2,title:"准备adg demo",slug:"准备adg-demo",children:[]}],filePathRelative:"zh/eb_corbos_starterkit/installation.md",git:{updatedTime:1632147602e3,contributors:[{name:"Qian Chen",email:"KimChan2013@users.noreply.github.com",commits:2},{name:"Kim Chan",email:"KimChan2013@users.noreply.github.com",commits:1}]}}},4413:(e,a,s)=>{s.r(a),s.d(a,{default:()=>A});var n=s(6252);const r=(0,n.uE)('<h1 id="安装" tabindex="-1"><a class="header-anchor" href="#安装" aria-hidden="true">#</a> 安装</h1><h2 id="准备系统" tabindex="-1"><a class="header-anchor" href="#准备系统" aria-hidden="true">#</a> 准备系统</h2><p>安装<code>Ubuntu 18.04</code>或者<code>Ubuntu 20.04</code>（如需在windows系统上使用EB corbos Starterkit, 需要先安装虚拟机），将EB corbos Starterkit安装包（示例版本为adg-eblinux-standard-delivery.tar.gz) 放置到 <code>~/Downloads</code> 。</p><h2 id="解压安装包" tabindex="-1"><a class="header-anchor" href="#解压安装包" aria-hidden="true">#</a> 解压安装包</h2><h3 id="adg-2-2-包含2-2-之前的版本" tabindex="-1"><a class="header-anchor" href="#adg-2-2-包含2-2-之前的版本" aria-hidden="true">#</a> ADG-2.2（包含2.2）之前的版本</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -p /tmp/delivery\n<span class="token builtin class-name">cd</span> /tmp/delivery\n<span class="token function">tar</span> xf ~/Downloads/adg-eblinux-standard-delivery.tar.gz\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="adg-2-3-之后的版本-以qemu-x86为例" tabindex="-1"><a class="header-anchor" href="#adg-2-3-之后的版本-以qemu-x86为例" aria-hidden="true">#</a> ADG-2.3 之后的版本，以qemu-x86为例</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code><span class="token function">mkdir</span> -p /tmp/delivery\n<span class="token builtin class-name">cd</span> /tmp/delivery\n<span class="token function">tar</span> xf ~/Downloads/ask-ADG-2.3-eblinux-bin.tar.gz\n<span class="token function">tar</span> xf ~/Downloads/ask-ADG-2.3-eblinux-qemu-x86.tar.gz\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="准备环境" tabindex="-1"><a class="header-anchor" href="#准备环境" aria-hidden="true">#</a> 准备环境</h2><p>执行installer脚本</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>./adg-standard-installer-ADG-2.2.sh\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>或者</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>adg-ADG-2.3-installer.sh\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div>',13),l=(0,n.Uk)("路径选择时建议使用默认路径 "),i=(0,n._)("code",null,"~/ara/eb",-1),d=(0,n.Uk)("，直接按下Enter即可。 执行完毕界面如下图所示。 "),t=["src"],o=(0,n.uE)('<h2 id="添加环境变量" tabindex="-1"><a class="header-anchor" href="#添加环境变量" aria-hidden="true">#</a> 添加环境变量</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>gedit ~/.bashrc\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>在 <code>~/.bashrc</code> 最后一行添加如下环境变量：<br><code>export workspace=~/ara/eb/workspace/</code></p><h2 id="安装eb-corbos-studio" tabindex="-1"><a class="header-anchor" href="#安装eb-corbos-studio" aria-hidden="true">#</a> 安装EB corbos Studio</h2><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>ara-cli SdkMgr --overwrite --activate --update-packages adg.*.tar.gz\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div>',5),c=(0,n.Uk)("在最后可根据自己的当前环境选择相应的 "),h=(0,n._)("code",null,"platform:",-1),u=(0,n.Uk)(" 比如 "),b=(0,n._)("code",null,"qemu-x86",-1),p=["src"],g=(0,n.uE)('<h2 id="运行eb-corbos-studio" tabindex="-1"><a class="header-anchor" href="#运行eb-corbos-studio" aria-hidden="true">#</a> 运行EB corbos Studio</h2><h3 id="命令行操作" tabindex="-1"><a class="header-anchor" href="#命令行操作" aria-hidden="true">#</a> 命令行操作</h3><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>corbos-studio-launcher --target-os eblinux\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="点击图标操作" tabindex="-1"><a class="header-anchor" href="#点击图标操作" aria-hidden="true">#</a> 点击图标操作</h3><p>图标路径： <code>~/ara/eb/tools/studio/ADG-2.2/EB_corbos_Studio</code></p><h3 id="安装了多个corbos-adg版本" tabindex="-1"><a class="header-anchor" href="#安装了多个corbos-adg版本" aria-hidden="true">#</a> 安装了多个corbos/adg版本</h3><p>默认会打开最新安装的EB corbos Stuido版本，如果有特殊需求，可以修改<code>~/.ara/config.ini</code>文件的配置</p><h2 id="选择workspace" tabindex="-1"><a class="header-anchor" href="#选择workspace" aria-hidden="true">#</a> 选择workspace</h2>',8),m=(0,n.Uk)("自行选择workspace路径，下图是示例路径："),v=(0,n._)("code",null,"~/ara/eb/workspace",-1),k=["src"],_=(0,n._)("h2",{id:"准备adg-demo",tabindex:"-1"},[(0,n._)("a",{class:"header-anchor",href:"#准备adg-demo","aria-hidden":"true"},"#"),(0,n.Uk)(" 准备adg demo")],-1),x=(0,n.Uk)("adg demo路径为： "),f=(0,n._)("code",null,"~/ara/eb/adaptivecore/source/git/ara_Demos/impl/demonstrator/templates/demos/",-1),w=(0,n._)("br",null,null,-1),D=(0,n.Uk)(" 把5个demos拷贝进workspace。"),B=(0,n._)("br",null,null,-1),E=(0,n.Uk)(" 下图是示例路径 "),U=(0,n._)("code",null,"~/ara/eb/workspace/adg/demo",-1),y=["src"],A={render:function(e,a){return(0,n.wg)(),(0,n.iD)(n.HY,null,[r,(0,n._)("p",null,[l,i,d,(0,n._)("img",{src:e.$withBase("/images/eb_corbos_starterkit/installation/run_installer_sh.png"),alt:"执行安装脚"},null,8,t)]),o,(0,n._)("p",null,[c,h,u,b,(0,n._)("img",{src:e.$withBase("/images/eb_corbos_starterkit/installation/select_platform.png"),alt:"选择平台"},null,8,p)]),g,(0,n._)("p",null,[m,v,(0,n._)("img",{src:e.$withBase("/images/eb_corbos_starterkit/installation/select_workspace.png"),alt:"选择工作区"},null,8,k)]),_,(0,n._)("p",null,[x,f,w,D,B,E,U,(0,n._)("img",{src:e.$withBase("/images/eb_corbos_starterkit/installation/prepare_adg_demo.png"),alt:"准备Demo"},null,8,y)])],64)}}}}]);