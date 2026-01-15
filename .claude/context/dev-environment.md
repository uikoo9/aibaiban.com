# 开发环境配置

## 网络代理设置

### 问题
在使用 WebFetch 或需要访问 GitHub 等国外资源时，可能会遇到网络连接问题。

### 解决方案

**设置代理环境变量**：
```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
export all_proxy=socks5://127.0.0.1:7890
```

### 使用场景

1. **Bash 命令访问外网**
```bash
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890 && curl https://api.github.com/repos/xxx/xxx
```

2. **npm/pnpm 安装依赖**
```bash
export https_proxy=http://127.0.0.1:7890 && pnpm install
```

3. **Git 操作**
```bash
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

### 取消代理

```bash
unset https_proxy
unset http_proxy
unset all_proxy
```

或对于 Git：
```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 其他环境配置

待补充...

## 更新记录
- 2026-01-14: 添加网络代理配置说明
