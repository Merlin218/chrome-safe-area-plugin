# 🚀 快速启动 - Safe Area Simulator

## 一分钟上手指南

### ✅ 图标已自动生成！

所有PNG图标已通过`pnpm install`自动生成完成：
- ✅ `icons/icon16.png` (429B)
- ✅ `icons/icon48.png` (1.2KB)  
- ✅ `icons/icon128.png` (2.6KB)

### 第一步：安装插件

1. 打开Chrome，访问 `chrome://extensions/`
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择项目根目录

### 第二步：测试功能

1. 在浏览器中打开 `test.html` 文件
2. 点击插件图标，开启"Enable"
3. 选择iPhone 14 Pro等设备
4. 观察页面变化

## 🎯 主要功能

- **设备模拟**: 支持20+主流设备的安全边距
- **实时切换**: 无需刷新即可切换设备
- **CSS变量**: 自动注入 `--safe-area-inset-*` 变量
- **可视化**: 插件界面提供设备预览
- **自定义**: 支持自定义安全边距数值

## 📁 文件说明

```
chrome-safe-area-plugin/
├── manifest.json          # 插件配置
├── popup.html/css/js      # 插件界面
├── content.js             # 内容脚本（注入CSS）
├── background.js          # 后台脚本
├── devices.js             # 设备数据
├── test.html              # 测试页面
└── icons/                 # 插件图标（已自动生成）
    ├── icon.svg           # 源图标
    ├── icon16.png         # 16x16 PNG
    ├── icon48.png         # 48x48 PNG
    └── icon128.png        # 128x128 PNG
```

## 🛠️ 开发命令

```bash
# 重新生成图标（如果需要）
pnpm run generate-icons

# 清理图标文件
pnpm run clean-icons

# 安装说明
pnpm run install:extension

# 测试说明
pnpm run test
```

## 🔧 自动图标生成

项目使用Sharp库自动生成PNG图标：

- 🎨 源文件：`icons/icon.svg`
- 🔄 自动转换：SVG → PNG (16/48/128px)
- ⚡ 安装时触发：`pnpm install` 自动生成
- 🛠️ 手动生成：`pnpm run generate-icons`

## ❓ 常见问题

**Q: 插件图标不显示？**
A: 图标已自动生成，如果仍有问题，运行 `pnpm run generate-icons`

**Q: 安全边距不生效？**
A: 确保插件已开启，检查CSS变量是否正确使用。

**Q: 如何添加新设备？**
A: 编辑 `devices.js` 文件，添加新的设备配置。

**Q: 重新生成图标？**
A: 运行 `pnpm run clean-icons && pnpm run generate-icons`

---

**插件已完全就绪！**🎉 现在你可以立即安装并使用它来模拟移动设备的安全边距了。 