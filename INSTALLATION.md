# 安装指南 - Safe Area Simulator

## 快速开始

### 步骤 1: 准备图标文件

在安装插件之前，你需要创建PNG格式的图标文件：

1. 项目中已包含 `icons/icon.svg` 作为图标源文件
2. 你需要将SVG转换为以下PNG格式：
   - `icons/icon16.png` (16x16像素)
   - `icons/icon48.png` (48x48像素)
   - `icons/icon128.png` (128x128像素)

#### 转换方法：

**方法1 - 在线工具（推荐）：**
1. 访问 https://svgtopng.com/
2. 上传 `icons/icon.svg`
3. 分别导出16x16、48x48、128x128的PNG文件
4. 将文件重命名并保存到 `icons/` 目录

**方法2 - 使用Inkscape命令行：**
```bash
inkscape -w 16 -h 16 icons/icon.svg -o icons/icon16.png
inkscape -w 48 -h 48 icons/icon.svg -o icons/icon48.png
inkscape -w 128 -h 128 icons/icon.svg -o icons/icon128.png
```

### 步骤 2: 安装到Chrome

1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目根目录（包含 `manifest.json` 的目录）
6. 插件安装完成！

### 步骤 3: 开始使用

1. 点击浏览器工具栏中的插件图标
2. 开启"Enable"开关
3. 从下拉菜单中选择要模拟的设备
4. 在当前网页中查看安全边距效果

## 验证安装

安装成功后，你应该能看到：

- ✅ 插件图标出现在Chrome工具栏
- ✅ 点击图标打开插件弹窗
- ✅ 弹窗显示设备选择器和开关
- ✅ 开启插件后，网页控制台显示相关日志

## 故障排除

### 图标不显示
- 确保已创建所有必需的PNG图标文件
- 检查图标文件名是否正确（icon16.png, icon48.png, icon128.png）

### 插件无法加载
- 检查 `manifest.json` 语法是否正确
- 确保所有JavaScript文件都存在
- 查看Chrome扩展程序页面的错误信息

### 安全边距不生效
- 确保插件已开启
- 检查网页是否支持CSS变量
- 查看浏览器控制台是否有错误信息
- 某些网站的CSP策略可能阻止插件运行

### 开发调试

如果需要调试插件：

1. 在 `chrome://extensions/` 页面点击插件的"详细信息"
2. 开启"允许访问文件URL"（如果需要在本地HTML文件上测试）
3. 点击"背景页"查看后台脚本日志
4. 在网页上右键 → 检查 → Console 查看内容脚本日志

## 更新插件

修改代码后：

1. 在 `chrome://extensions/` 页面点击插件的刷新按钮
2. 或者重新加载插件（删除后重新安装）

## 卸载插件

在 `chrome://extensions/` 页面点击"移除"按钮即可卸载插件。 