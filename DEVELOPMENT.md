# 开发指南

## 开发模式

项目现在支持两种开发模式，让你在开发过程中无需一直重新打包：

### 🚀 快速开发模式

```bash
npm run dev:fast
```

**特点：**
- 单次构建，无文件监听
- 开发模式优化：关闭压缩、内联source map
- ✅ **跳过zip包创建** - 节省时间和磁盘空间
- 构建速度快，适合快速测试

### ⚡ 监听开发模式

```bash
npm run dev
```

**特点：**
- 启动文件监听，自动重新构建
- 文件变化时自动更新扩展
- ✅ **跳过zip包创建** - 提高开发效率
- 适合持续开发

### 🔄 手动监听模式

```bash
npm run dev:watch
```

**特点：**
- 与 `npm run dev` 相同
- 提供的别名命令

## 开发流程

### 1. 初始设置
```bash
# 安装依赖
npm install

# 首次构建
npm run dev:fast
```

### 2. 加载扩展到Chrome
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `./dist` 目录

### 3. 开发循环
```bash
# 启动文件监听
npm run dev

# 现在你可以：
# 1. 修改源代码文件
# 2. 文件会自动重新构建
# 3. 在Chrome扩展页面点击"重新加载"
# 4. 测试你的更改
```

## 开发模式特性

### ✅ 开发模式优化
- **无压缩**：保持代码可读性，便于调试
- **内联Source Map**：直接在文件中包含调试信息
- **跳过zip包创建**：不创建生产环境的zip包
- **快速构建**：关闭tree-shaking等优化
- **详细日志**：显示开发模式状态

### 🔧 自动功能
- 自动复制静态文件（HTML、CSS、图标）
- 自动验证 manifest.json
- 自动处理TypeScript编译
- 自动转换ES模块为Chrome扩展兼容格式

## 生产构建

当你准备发布时，使用生产模式：

```bash
# 标准生产构建
npm run build

# 创建Chrome Web Store包
npm run build:zip
```

**生产模式特点：**
- 启用代码压缩
- 优化bundle大小
- 创建发布用的zip包
- 完整的类型检查

## 故障排除

### Chrome扩展不更新？
1. 在 `chrome://extensions/` 页面点击扩展的"重新加载"按钮
2. 检查控制台是否有构建错误
3. 确保dist目录已更新

### 构建错误？
1. 检查TypeScript类型错误：`npm run type-check`
2. 检查ESLint错误：`npm run lint`
3. 清理并重新构建：`npm run clean && npm run dev:fast`

### 文件监听不工作？
1. 确保没有其他vite进程在运行：`ps aux | grep vite`
2. 重启开发模式：停止当前进程，重新运行 `npm run dev`

## 开发技巧

### 🎯 快速测试流程
1. 修改代码
2. 等待自动构建完成（通常1-2秒）
3. 在Chrome扩展页面点击重新加载
4. 测试功能

### 🚀 提高开发效率
- 使用 `dev:fast` 进行快速一次性测试
- 使用 `dev` 进行持续开发
- 启用Chrome开发者工具调试
- 使用内联source map进行源码调试

### 📝 代码组织
- 保持文件小于500行（项目规范）
- 遵循DRY、KISS、SOLID原则
- 使用英文注释
- 及时提交代码变更 