## 安装和开发

```bash
# 安装依赖（建议使用cnpm或yarn）
npm install

# 开发模式 localhost:4000
**不传对应文件夹名默认编译所有文件**
npm run dev '文件夹名'
或
npm start '文件夹名'

# 构建
由于打包会自动上传图片，请先使用tinypng压缩图片，减少资源体积
npm run build '文件夹名' --replace='时间戳' 打包到测试环境，添加一个replace时间戳参数，用来覆盖cdn，只在dev环境下有效
npm run build-prod '文件夹名' 打包到线上环境

# 自动生成入口文件
npm run build:file

# 打包单个组件(css嵌入到js中)
npm run build pack '文件夹名'
bundle文件夹下创建对应的入口文件，引入组件然后将类绑定在window.CREATE下

# 上传文件到cdn
由于打包会自动上传图片，请先使用tinypng压缩图片，减少资源体积
npm run upload '文件夹名' 上传文件到测试环境
npm run upload-prod '文件夹名' 上传文件到线上环境
例如：npm run upload 'dist/'
将dist/目录下的所有文件包含子文件夹都上传到/config/index.js里配置的build.cdnDir目录下

## 项目结构
|--bin                  // 脚本目录
|--build                // 项目构建相关文件
|--config
|   |--entry.js         // 自动生成的入口文件
|   |--index.js         // 配置文件
|--dist                 // 打包输出目录
|--gulp                 // gulp输出目录,旧游戏项目使用
|--mock                 // mock数据目录
|--src
|   |--common
|       |--css          // 公用css
|       |--images       // 常用图片
|       |--js           // 公用js
|       |--layout       // 公用的html模块
|       |--lib          // js类库
|   |--components       // 页面通用js组件
|   |--pages            // h5页面目录
|--static               // express 静态目录
|--.eslintignore        // eslint忽略配置
|--.eslintrc.js         // eslint规则
|--.gitignore           // git忽略配置
|--app.js               // express服务器
|--gulpfile.js          // gulp配置
|--postcss.config.js    // postcss配置
|--tsconfig.json        // typescript配置
```
