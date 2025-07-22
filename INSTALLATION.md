# Chrome Safe Area Plugin 安装指南

## 📦 构建扩展

首先确保项目已正确构建：

```bash
# 安装依赖
npm install

# 构建扩展
npm run build
```

构建完成后，扩展文件将位于 `./dist` 目录。

## 🚀 安装方式

### 方式一：开发者模式安装（推荐）

1. **打开Chrome扩展管理页面**
   - 在Chrome浏览器中输入：`chrome://extensions/`
   - 或者：Chrome菜单 → 更多工具 → 扩展程序

2. **启用开发者模式**
   - 在右上角打开"开发者模式"开关

3. **加载扩展**
   - 点击"加载已解压的扩展程序"
   - 选择项目根目录下的 `dist` 文件夹
   - 点击"选择文件夹"

4. **验证安装**
   - 扩展应该出现在扩展列表中
   - 浏览器工具栏会显示扩展图标

### 方式二：ZIP 包安装

如果你有打包好的 ZIP 文件：

1. 解压 ZIP 文件到任意目录
2. 按照方式一的步骤，选择解压后的文件夹

## 🔧 图标文件准备

项目中已包含所需的图标文件：
- `icons/icon16.png` (16x16像素)
- `icons/icon48.png` (48x48像素) 
- `icons/icon128.png` (128x128像素)

如果需要重新生成图标：

```bash
# 自动生成所有尺寸的图标
npm run generate-icons
```

### 手动转换图标（可选）

如果自动生成失败，可以手动转换：

**在线工具转换：**
1. 访问 https://svgtopng.com/
2. 上传 `icons/icon.svg`
3. 分别导出16x16、48x48、128x128的PNG文件

**使用ImageMagick（命令行）：**
```bash
# 安装 ImageMagick (macOS)
brew install imagemagick

# 生成不同尺寸的图标
convert icons/icon.svg -resize 16x16 icons/icon16.png
convert icons/icon.svg -resize 48x48 icons/icon48.png
convert icons/icon.svg -resize 128x128 icons/icon128.png
```

## ✅ 使用验证

安装成功后：

1. **打开任意网页**（如 https://example.com）
2. **点击扩展图标**（在浏览器工具栏）
3. **选择设备类型**（如 iPhone 15 Pro）
4. **启用模拟**，查看页面是否出现安全边距效果

## 🐛 常见问题

### 扩展无法加载
- 确保选择的是 `dist` 文件夹而不是其他目录
- 检查 `dist/manifest.json` 文件是否存在
- 重新运行 `npm run build`

### 图标显示异常
- 运行 `npm run generate-icons` 重新生成图标
- 检查 `icons/` 目录下是否有完整的PNG文件

### 功能不工作
- 刷新目标网页
- 检查浏览器控制台是否有错误信息
- 尝试禁用后重新启用扩展

## 📝 开发模式

如果你是开发者，可以使用开发模式：

```bash
# 启动开发监听模式
npm run dev

# 代码检查
npm run validate
```

## 📦 创建发布包

如果您需要创建用于分发的扩展包：

```bash
# 构建并创建 ZIP 包
npm run build:zip

# 或者仅基于现有构建创建 ZIP 包
npm run package
```

### ZIP 包特性
- **自动命名**: 包含版本号和时间戳
- **最大压缩**: 优化文件大小
- **集中管理**: 存放在 `packages/` 目录
- **即用即发**: 可直接用于 Chrome Web Store 或企业分发

### 发布用途
生成的 ZIP 文件可以：
- 手动分发给其他用户加载
- 提交到 Chrome Web Store（需要开发者账号）
- 在企业环境中批量部署
- 作为版本备份存档

---

*如有问题，请查看项目 README.md 或提交 Issue* 