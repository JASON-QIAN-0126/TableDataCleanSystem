# DataClean 系统

一个基于React + Node.js + SQLite的数据清洗系统，支持用户认证和文件处理。

## 功能特性

### 前端功能
- 🎨 现代化的UI设计，支持深色/浅色主题切换
- 👤 用户认证系统（注册/登录）
- 📁 文件上传和管理
- 🔍 数据预览和搜索
- 📊 数据清洗结果展示
- 📥 文件下载功能

### 后端功能
- 🔐 JWT用户认证
- 💾 SQLite数据库存储
- 📤 文件上传处理
- 🛡️ 密码加密存储
- 🔒 路由保护

## 技术栈

### 前端
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router
- 自定义UI组件库

### 后端
- Node.js + Express
- SQLite3
- JWT认证
- bcryptjs密码加密
- Multer文件上传

## 快速开始

### 1. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 2. 启动服务

```bash
# 启动后端服务器 (端口 8000)
cd backend
npm run dev

# 启动前端开发服务器 (端口 5173)
cd frontend
npm run dev
```

### 3. 访问应用

打开浏览器访问: http://localhost:5173

## 项目结构

```
DataClean/
├── frontend/                 # 前端代码
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── mainpages/       # 页面组件
│   │   ├── assets/          # 静态资源
│   │   └── lib/             # 工具函数
│   ├── public/              # 公共文件
│   └── package.json
├── backend/                  # 后端代码
│   ├── routes/              # API路由
│   ├── middleware/          # 中间件
│   ├── config/              # 配置文件
│   ├── uploads/             # 上传文件目录
│   └── package.json
└── README.md
```

