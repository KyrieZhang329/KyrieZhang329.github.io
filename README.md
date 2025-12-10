# Personal Homepage - 个人主页

## 项目结构 / Project Structure

```
my-website/
├── index.html              # 首页 HTML
├── README.md               # 项目说明文件
└── assets/                 # 资源文件夹
    ├── css/                # 存放样式表
    │   └── style.css       # 从 HTML 中提取出来的 CSS
    ├── js/                 # 存放脚本
    │   └── main.js         # 从 HTML 中提取出来的 JS
    └── images/             # 存放图片（本地化）
        ├── avatar.jpg      # 个人头像
        ├── xdu-logo.png    # 西电 Logo
        └── hsas-logo.png   # 高中部 Logo
```

## 本地图片替换指南 / Local Images Setup

### 需要替换的图片清单

| 图片位置 | 当前来源 | 本地路径 | 说明 |
|--------|--------|--------|------|
| 头像 | https://s21.ax1x.com/2025/11/19/pZFFwQS.jpg | `assets/images/avatar.jpg` | 个人头像，圆形显示 |
| 西电 Logo | https://s21.ax1x.com/2025/11/26/pZAWDxO.png | `assets/images/xdu-logo.png` | 西安电子科技大学 Logo |
| 高中部 Logo | https://s21.ax1x.com/2025/11/26/pZAWwPx.png | `assets/images/hsas-logo.png` | SUSTech 高中部 Logo |

### 替换步骤

1. **创建 images 文件夹**（如果不存在）：
   ```
   assets/images/
   ```

2. **将您的图片文件放入文件夹**：
   - 将您的头像文件放入 `assets/images/` 并命名为 `avatar.jpg`
   - 将西电 Logo 放入 `assets/images/` 并命名为 `xdu-logo.png`
   - 将高中部 Logo 放入 `assets/images/` 并命名为 `hsas-logo.png`

3. **无需修改 HTML**：
   - HTML 文件已经更新为使用本地路径
   - 图片会自动从 `assets/images/` 加载

### 图片要求

- **avatar.jpg**：建议尺寸 120px × 120px 或更大（圆形显示）
- **xdu-logo.png** 和 **hsas-logo.png**：建议尺寸 40px × 40px 或更大
- 支持格式：JPG、PNG、GIF、WebP

