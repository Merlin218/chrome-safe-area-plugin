# Safe Area Simulator - Chrome浏览器插件

一个专为前端开发者设计的Chrome浏览器插件，用于在网页中模拟不同移动设备的安全边距（safe area insets），帮助开发者更好地测试和优化响应式设计。

## 功能特性

- ✨ **设备模拟**: 支持iPhone、Android等主流移动设备的安全边距模拟
- 🎯 **实时切换**: 无需刷新页面即可切换不同设备的安全边距
- 🎨 **可视化预览**: 插件弹窗中提供设备安全边距的直观预览
- ⚙️ **自定义设置**: 支持自定义安全边距数值
- 🚀 **CSS变量注入**: 自动向网页注入`--safe-area-inset-*`CSS变量
- 👀 **调试模式**: 可选的可视化调试覆盖层
- 💾 **状态保持**: 自动保存设置，重新打开页面时保持当前配置

## 支持的设备

### iPhone系列
- iPhone 15 Pro Max / Pro / 15
- iPhone 14 Pro Max / Pro / 14
- iPhone 13 Pro Max / Pro / 13 / Mini
- iPhone 12 Pro Max / 12 Pro / 12 / Mini
- iPhone XR / 11
- iPhone X / XS

### Android设备
- Samsung Galaxy S22 / S21
- Google Pixel 4 / 3 XL / XL

### 横屏模式
- iPhone 14 Pro (Landscape)
- iPhone 14 (Landscape)

## 安装方法

### 开发模式安装

1. 下载或克隆此项目到本地
```bash
git clone <repository-url>
cd chrome-safe-area-plugin
```

2. 打开Chrome浏览器，访问 `chrome://extensions/`

3. 开启"开发者模式"（页面右上角）

4. 点击"加载已解压的扩展程序"

5. 选择项目文件夹

6. 插件安装完成，会在扩展程序栏显示插件图标

## 使用方法

### 基本使用

1. **开启插件**: 点击插件图标，在弹窗中开启"Enable"开关

2. **选择设备**: 从下拉菜单中选择要模拟的设备型号

3. **查看效果**: 安全边距会立即应用到当前网页

4. **切换设备**: 随时可以切换到其他设备型号

### 自定义安全边距

1. 在插件弹窗中展开"Custom Safe Area"部分

2. 输入自定义的安全边距数值（单位：像素）

3. 点击"Apply Custom"按钮应用设置

### CSS开发集成

插件会自动向网页注入以下CSS变量：

```css
:root {
  --safe-area-inset-top: 59px;
  --safe-area-inset-bottom: 34px;
  --safe-area-inset-left: 0px;
  --safe-area-inset-right: 0px;
}
```

### 在CSS中使用

```css
/* 使用CSS变量 */
.header {
  padding-top: var(--safe-area-inset-top);
}

.footer {
  padding-bottom: var(--safe-area-inset-bottom);
}

/* 使用工具类（插件会自动注入） */
.safe-area-container {
  @apply safe-area-inset-all;
}

/* 兼容原生env()函数 */
.container {
  padding: env(safe-area-inset-top) env(safe-area-inset-right) 
           env(safe-area-inset-bottom) env(safe-area-inset-left);
}
```

### JavaScript事件监听

插件会触发自定义事件，方便JavaScript代码响应安全边距变化：

```javascript
document.addEventListener('safeAreaInsetsChanged', (event) => {
  const { top, bottom, left, right, enabled } = event.detail;
  console.log('Safe area insets changed:', { top, bottom, left, right, enabled });
  
  // 执行自定义逻辑
  updateLayout(top, bottom, left, right);
});
```

## 工具类

插件提供了便用的CSS工具类：

```css
/* 单独设置某一边的安全边距 */
.safe-area-inset-top
.safe-area-inset-bottom
.safe-area-inset-left
.safe-area-inset-right

/* 设置所有边的安全边距 */
.safe-area-inset-all
```

## 调试功能

插件提供可视化调试功能：

- **调试覆盖层**: 当启用安全边距时，会显示半透明的红色区域标识安全边距
- **控制台日志**: 在浏览器控制台中查看安全边距变化日志
- **设备预览**: 插件弹窗中的小型设备预览图

## 技术原理

1. **CSS变量注入**: 通过Content Script向页面动态注入CSS变量
2. **实时通信**: Popup与Content Script通过Chrome消息API实时通信
3. **状态管理**: 使用Chrome Storage API保存用户设置
4. **样式覆盖**: 通过动态样式表覆盖网页的安全边距设置

## 浏览器兼容性

- Chrome 88+
- 基于Chromium的浏览器（Edge、Opera等）

## 开发

### 项目结构

```
chrome-safe-area-plugin/
├── manifest.json          # 插件配置文件
├── popup.html             # 插件弹窗HTML
├── popup.css              # 插件弹窗样式
├── popup.js               # 插件弹窗逻辑
├── content.js             # 内容脚本
├── background.js          # 后台脚本
├── devices.js             # 设备配置数据
├── icons/                 # 插件图标
└── README.md              # 项目说明
```

### 修改设备数据

在`devices.js`文件中添加新的设备配置：

```javascript
newDevice: {
  name: "设备名称",
  safeAreaInsets: {
    top: 顶部边距,
    bottom: 底部边距,
    left: 左侧边距,
    right: 右侧边距
  }
}
```

## 常见问题

**Q: 为什么安全边距没有生效？**
A: 确保插件已开启，并且当前网页支持CSS变量。某些网站可能有CSP限制。

**Q: 可以同时模拟多个设备吗？**
A: 目前每次只能模拟一个设备的安全边距。

**Q: 横屏和竖屏的安全边距有什么区别？**
A: 横屏时通常顶部和底部边距较小，左右边距较大（刘海屏设备）。

**Q: 如何在React/Vue项目中使用？**
A: 直接使用CSS变量或监听`safeAreaInsetsChanged`事件来响应变化。

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

**注意**: 此插件仅用于开发测试目的，不会影响移动设备上的实际安全边距行为。 