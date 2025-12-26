# 域名配置指南 - whatismyname.org

## 📋 概述

本指南将帮助您将自定义域名 `whatismyname.org` 连接到 Vercel 部署。

---

## 🎯 前提条件

1. ✅ 拥有域名 `whatismyname.org` 的管理权限
2. ✅ 可以访问域名注册商的 DNS 管理面板
3. ✅ Vercel 项目已成功部署

---

## 🔧 步骤 1: 在 Vercel 添加域名

### 1.1 访问 Vercel Dashboard

1. 打开 [Vercel Dashboard](https://vercel.com/7and1s-projects/app)
2. 进入项目 `app`
3. 点击 **Settings** → **Domains**

### 1.2 添加域名

1. 在输入框中输入: `whatismyname.org`
2. 点击 **Add**
3. Vercel 会显示需要配置的 DNS 记录

---

## 🌐 步骤 2: 配置 DNS 记录

Vercel 会要求您添加以下 DNS 记录（具体值请以 Vercel 显示的为准）：

### 选项 A: 使用 A 记录（推荐）

在您的域名注册商 DNS 管理中添加：

```
类型: A
名称: @
值: 76.76.21.21
TTL: 自动或 3600
```

### 选项 B: 使用 CNAME 记录

```
类型: CNAME
名称: @
值: cname.vercel-dns.com.
TTL: 自动或 3600
```

### 添加 www 子域名（可选但推荐）

```
类型: CNAME
名称: www
值: cname.vercel-dns.com.
TTL: 自动或 3600
```

---

## ⚙️ 步骤 3: 常见域名注册商配置示例

### Cloudflare

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 选择域名 `whatismyname.org`
3. 进入 **DNS** → **Records**
4. 点击 **Add record**
5. 添加上述 A 或 CNAME 记录
6. **重要**: 确保 Proxy status 为 **DNS only**（灰色云朵）

### Namecheap

1. 登录 [Namecheap](https://www.namecheap.com/myaccount/login/)
2. 进入 **Domain List** → 点击 **Manage**
3. 选择 **Advanced DNS** 标签
4. 点击 **Add New Record**
5. 添加上述记录

### GoDaddy

1. 登录 [GoDaddy](https://sso.godaddy.com)
2. 进入 **My Products** → **DNS**
3. 点击域名旁边的 **DNS**
4. 在 DNS Management 页面添加记录

### Aliyun (阿里云)

1. 登录 [阿里云控制台](https://dns.console.aliyun.com)
2. 进入 **云解析 DNS** → **域名解析**
3. 找到 `whatismyname.org`，点击 **解析设置**
4. 点击 **添加记录**
5. 添加上述记录

---

## ⏱️ 步骤 4: 等待 DNS 传播

- **传播时间**: 通常 5-30 分钟，最长可能需要 48 小时
- **检查方法**:

  ```bash
  # 检查 A 记录
  dig whatismyname.org

  # 或使用在线工具
  # https://www.whatsmydns.net/#A/whatismyname.org
  ```

---

## ✅ 步骤 5: 在 Vercel 验证域名

1. 返回 Vercel Dashboard → **Domains**
2. 等待域名状态变为 **Valid Configuration** ✓
3. Vercel 会自动配置 SSL 证书（Let's Encrypt）
4. 通常 1-2 分钟后 HTTPS 即可生效

---

## 🔒 步骤 6: 验证 HTTPS

访问以下 URL 确认一切正常：

- https://whatismyname.org
- https://www.whatismyname.org

**检查项**:

- ✅ 网站可访问
- ✅ HTTPS 证书有效（浏览器地址栏显示锁图标）
- ✅ 自动重定向到 HTTPS（如果访问 HTTP）

---

## 🎨 步骤 7: 更新环境变量（可选）

如果您希望应用内部链接使用自定义域名：

```bash
# 更新 Vercel 环境变量
vercel env rm NEXT_PUBLIC_BASE_URL production --yes
printf 'https://whatismyname.org' | vercel env add NEXT_PUBLIC_BASE_URL production

# 重新部署
vercel --prod
```

---

## 🐛 故障排除

### 问题 1: 域名显示 "Invalid Configuration"

**原因**: DNS 记录未正确配置或尚未传播

**解决方案**:

1. 检查 DNS 记录是否正确
2. 等待 DNS 传播（使用 `dig` 命令检查）
3. 如果使用 Cloudflare，确保 Proxy 已关闭

### 问题 2: SSL 证书错误

**原因**: Vercel 正在配置证书

**解决方案**:

- 等待 5-10 分钟后重试
- 在 Vercel Dashboard 检查证书状态

### 问题 3: www 子域名不工作

**原因**: 未添加 www CNAME 记录

**解决方案**:

1. 在 DNS 中添加 www CNAME 记录
2. 在 Vercel 也添加 `www.whatismyname.org` 域名

---

## 📊 验证清单

完成以下检查确保配置成功：

- [ ] DNS A/CNAME 记录已添加
- [ ] DNS 传播完成（`dig whatismyname.org` 返回正确 IP）
- [ ] Vercel 显示 "Valid Configuration"
- [ ] HTTPS 证书已自动配置
- [ ] https://whatismyname.org 可访问
- [ ] https://www.whatismyname.org 可访问（如已配置）
- [ ] 所有页面正常加载
- [ ] API 功能正常（测试搜索功能）

---

## 📞 需要帮助？

如遇到问题：

1. **Vercel 文档**: https://vercel.com/docs/concepts/projects/domains
2. **DNS 检查工具**: https://www.whatsmydns.net
3. **SSL 检查工具**: https://www.ssllabs.com/ssltest/

---

**最后更新**: 2025-12-15
