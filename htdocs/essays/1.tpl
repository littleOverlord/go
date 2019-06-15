<h3>前言</h3>
<p>其实Vue官方从2.6.X版本开始就部分使用Ts重写了。</p>
<p>我个人对更严格类型限制没有积极的看法，毕竟各类转类型的骚写法写习惯了。</p>
<p>然鹅最近的一个项目中，是TypeScript+ Vue，毛计喇，学之...…真香！</p>
<p>注意此篇标题的“前”，本文旨在讲Ts混入框架的使用，不讲Class API</p>
<h3>1. 使用官方脚手架构建</h3>
<pre>npm install -g @vue/cli<br /># OR <br />yarn global add @vue/cli</pre>
<p>新的Vue CLI工具允许开发者 使用 TypeScript 集成环境 创建新项目。</p>
<p>只需运行vue create my-app。</p>
<p>然后，命令行会要求选择预设。使用箭头键选择Manually select features。</p>
<p>接下来，只需确保选择了TypeScript和Babel选项，如下图：</p>
<p><img src="temp/16b47a57d82715e9" /></p>
<p>完成此操作后，它会询问你是否要使用class-style component syntax。</p>
<p></p>然后配置其余设置，使其看起来如下图所示。</p>
<p><img src="temp/16b47a57d83e1974" /></p>
<p>Vue CLI工具现在将安装所有依赖项并设置项目。</p>
<p><img src="temp/16b47a57dd7f8c66" /></p>
<p>接下来就跑项目喇。</p>
<p><img src="temp/16b47a57daeaf341" /></p>
<p>总之，先跑起来再说。</p>
<h3>2. 项目目录解析</h3>
<p>通过tree指令查看目录结构后可发现其结构和正常构建的大有不同。</p>
<p><img src="temp/16b47a57e05c4d0f" /></p>
<p>这里主要关注shims-tsx.d.ts和 shims-vue.d.ts两个文件</p>
<p>两句话概括：</p>
<ul>
<li>shims-tsx.d.ts，允许你以.tsx结尾的文件，在Vue项目中编写jsx代码</li>
<li>shims-vue.d.ts 主要用于 TypeScript 识别.vue 文件，Ts默认并不支持导入 vue 文件，这个文件告诉ts 导入.vue 文件都按VueConstructor&lt;Vue&gt;处理。</li>
</ul>