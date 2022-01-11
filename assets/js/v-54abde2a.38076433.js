"use strict";(self.webpackChunkifs_shanghai_doc=self.webpackChunkifs_shanghai_doc||[]).push([[610],{6711:(a,e,n)=>{n.r(e),n.d(e,{data:()=>s});const s={key:"v-54abde2a",path:"/zh/eb_corbos_starterkit/ara_cli.html",title:"ara-cli简介",lang:"zh-CN",frontmatter:{},excerpt:"",headers:[{level:2,title:"开始使用",slug:"开始使用",children:[{level:3,title:"创建新工程",slug:"创建新工程",children:[]},{level:3,title:"移植已有工程",slug:"移植已有工程",children:[]},{level:3,title:"配置工程",slug:"配置工程",children:[]},{level:3,title:"运行plugets",slug:"运行plugets",children:[]},{level:3,title:"工程构建",slug:"工程构建",children:[]},{level:3,title:"工程验证",slug:"工程验证",children:[]}]},{level:2,title:"使用QEMU",slug:"使用qemu",children:[]},{level:2,title:"使用R-Car H3",slug:"使用r-car-h3",children:[]},{level:2,title:"Working with a target host",slug:"working-with-a-target-host",children:[]},{level:2,title:"使用容器",slug:"使用容器",children:[]},{level:2,title:"使用UCM包",slug:"使用ucm包",children:[]},{level:2,title:"Perform system and user space tracing with LTTng and perf",slug:"perform-system-and-user-space-tracing-with-lttng-and-perf",children:[]},{level:2,title:"Working with an application binary",slug:"working-with-an-application-binary",children:[]},{level:2,title:"Working with ADG modules",slug:"working-with-adg-modules",children:[]},{level:2,title:"构建EB Linux镜像",slug:"构建eb-linux镜像",children:[]},{level:2,title:"Starterkit",slug:"starterkit",children:[]},{level:2,title:"Troubleshooting",slug:"troubleshooting",children:[]},{level:2,title:"卸载Starkerkit",slug:"卸载starkerkit",children:[]}],filePathRelative:"zh/eb_corbos_starterkit/ara_cli.md",git:{updatedTime:1631970279e3,contributors:[{name:"Qian Chen",email:"KimChan2013@users.noreply.github.com",commits:1}]}}},9804:(a,e,n)=>{n.r(e),n.d(e,{default:()=>t});const s=(0,n(6252).uE)('<h1 id="ara-cli简介" tabindex="-1"><a class="header-anchor" href="#ara-cli简介" aria-hidden="true">#</a> ara-cli简介</h1><p>ara-cli is a Python-based command line tool used to run different build and verification operations. ara-cli offers a set of hooks, which combine multi-step operations into a single hook. A hook usually calls a set of tasks in order and with predefined parameters. Additionally, it is also possible to call individual tasks with ara-cli. The set of available hooks and tasks can be listed with the following command: ara-cli You can get help with a task or hook if you add the --help parameter after a hook or a task name. ara-cli Build --help</p><h2 id="开始使用" tabindex="-1"><a class="header-anchor" href="#开始使用" aria-hidden="true">#</a> 开始使用</h2><p>AP应用相关的操作由 <code>ara-cli Application</code> 命令完成，相关参数可由 <code>ara-cli Application --help</code> 查看。</p><h3 id="创建新工程" tabindex="-1"><a class="header-anchor" href="#创建新工程" aria-hidden="true">#</a> 创建新工程</h3><p>你可以通过 <code>ara-cli Application</code> 命令创建新工程</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>ara-cli Application --create-project --app ~/workspace/adg/demo --target-os <span class="token operator">&lt;</span>target_os<span class="token operator">&gt;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>然后，生成CMakeList：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>ara-cli Application --generate-cmake --app ~/workspace/adg/demo --target-os <span class="token operator">&lt;</span>target_os<span class="token operator">&gt;</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="移植已有工程" tabindex="-1"><a class="header-anchor" href="#移植已有工程" aria-hidden="true">#</a> 移植已有工程</h3><h4 id="修改cmkelists-txt" tabindex="-1"><a class="header-anchor" href="#修改cmkelists-txt" aria-hidden="true">#</a> 修改CMkeLists.txt</h4><p>添加project定义：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>project<span class="token punctuation">(</span>demo\n VERSION <span class="token number">1.0</span>.0\n LANGUAGES CXX\n<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>添加include文件</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>include<span class="token punctuation">(</span>Options.cmake<span class="token punctuation">)</span>\ninclude<span class="token punctuation">(</span>InstallPaths.cmake<span class="token punctuation">)</span>\ninclude<span class="token punctuation">(</span>Test.cmake<span class="token punctuation">)</span>\ninclude<span class="token punctuation">(</span>CommonTargets<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>根据项目需求，添加对应的包信息：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>find_package<span class="token punctuation">(</span>ara_TSyn REQUIRED<span class="token punctuation">)</span>\nfind_package<span class="token punctuation">(</span>ara_HealthMgr REQUIRED<span class="token punctuation">)</span>\nfind_package<span class="token punctuation">(</span>ara_DLT REQUIRED<span class="token punctuation">)</span>\nfind_package<span class="token punctuation">(</span>ara_PM REQUIRED<span class="token punctuation">)</span>\nfind_package<span class="token punctuation">(</span>ara_EM REQUIRED<span class="token punctuation">)</span>\nfind_package<span class="token punctuation">(</span>ara_PSP REQUIRED<span class="token punctuation">)</span>\nfind_package<span class="token punctuation">(</span>ara_Com REQUIRED<span class="token punctuation">)</span>\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>然后，生成CMakeList：</p><div class="language-bash ext-sh line-numbers-mode"><pre class="language-bash"><code>ara-cli Application --generate-cmake --app ~/existing_project --target-os <span class="token operator">&lt;</span>target_os<span class="token operator">&gt;</span>.\n</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="使用eb-corbos-starterkit的示例demo" tabindex="-1"><a class="header-anchor" href="#使用eb-corbos-starterkit的示例demo" aria-hidden="true">#</a> 使用EB corbos Starterkit的示例demo</h4><p>TBD</p><h3 id="配置工程" tabindex="-1"><a class="header-anchor" href="#配置工程" aria-hidden="true">#</a> 配置工程</h3><p>TBD</p><h3 id="运行plugets" tabindex="-1"><a class="header-anchor" href="#运行plugets" aria-hidden="true">#</a> 运行plugets</h3><p>TBD</p><h3 id="工程构建" tabindex="-1"><a class="header-anchor" href="#工程构建" aria-hidden="true">#</a> 工程构建</h3><p>TBD</p><h3 id="工程验证" tabindex="-1"><a class="header-anchor" href="#工程验证" aria-hidden="true">#</a> 工程验证</h3><p>TBD</p><h2 id="使用qemu" tabindex="-1"><a class="header-anchor" href="#使用qemu" aria-hidden="true">#</a> 使用QEMU</h2><p>TBD</p><h2 id="使用r-car-h3" tabindex="-1"><a class="header-anchor" href="#使用r-car-h3" aria-hidden="true">#</a> 使用R-Car H3</h2><p>TBD</p><h2 id="working-with-a-target-host" tabindex="-1"><a class="header-anchor" href="#working-with-a-target-host" aria-hidden="true">#</a> Working with a target host</h2><p>TBD</p><h2 id="使用容器" tabindex="-1"><a class="header-anchor" href="#使用容器" aria-hidden="true">#</a> 使用容器</h2><p>TBD</p><h2 id="使用ucm包" tabindex="-1"><a class="header-anchor" href="#使用ucm包" aria-hidden="true">#</a> 使用UCM包</h2><p>TBD</p><h2 id="perform-system-and-user-space-tracing-with-lttng-and-perf" tabindex="-1"><a class="header-anchor" href="#perform-system-and-user-space-tracing-with-lttng-and-perf" aria-hidden="true">#</a> Perform system and user space tracing with LTTng and perf</h2><p>TBD</p><h2 id="working-with-an-application-binary" tabindex="-1"><a class="header-anchor" href="#working-with-an-application-binary" aria-hidden="true">#</a> Working with an application binary</h2><p>TBD</p><h2 id="working-with-adg-modules" tabindex="-1"><a class="header-anchor" href="#working-with-adg-modules" aria-hidden="true">#</a> Working with ADG modules</h2><p>TBD</p><h2 id="构建eb-linux镜像" tabindex="-1"><a class="header-anchor" href="#构建eb-linux镜像" aria-hidden="true">#</a> 构建EB Linux镜像</h2><p>TBD</p><h2 id="starterkit" tabindex="-1"><a class="header-anchor" href="#starterkit" aria-hidden="true">#</a> Starterkit</h2><p>TBD</p><h2 id="troubleshooting" tabindex="-1"><a class="header-anchor" href="#troubleshooting" aria-hidden="true">#</a> Troubleshooting</h2><p>TBD</p><h2 id="卸载starkerkit" tabindex="-1"><a class="header-anchor" href="#卸载starkerkit" aria-hidden="true">#</a> 卸载Starkerkit</h2><p>TBD</p>',53),t={render:function(a,e){return s}}}}]);