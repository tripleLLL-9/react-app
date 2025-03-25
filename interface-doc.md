# 漏洞扫描系统接口文档

## 1. 文件扫描接口
```
POST /api/v1/scan
```
![文件扫描界面](./docs/images/file-scan.png)

对应UI位置：
- 文件上传区域：用户可以拖拽或点击上传文件
- 漏洞类型选择：包含XSS攻击、SQL注入等选项
- 开始扫描按钮：触发文件扫描请求

## 2. 获取统计数据接口
```
GET /api/v1/stats?timeRange=week
```
![统计数据界面](./docs/images/stats.png)

对应UI位置：
- 顶部三个统计卡片：总扫描次数、严重漏洞、已修复漏洞
- 漏洞严重程度分布图表
- 漏洞类型分布图表

## 3. 导出报告接口
```
GET /api/v1/scan/{scanId}/report?format=json
```
![导出报告按钮](./docs/images/export.png)

对应UI位置：
- 扫描结果页面右上角的"导出报告"按钮

## 4. 获取扫描结果接口
```
GET /api/v1/scan/{scanId}
```
![扫描结果界面](./docs/images/scan-results.png)

对应UI位置：
- 扫描结果详细列表
- 每个漏洞的详细信息卡片
- 漏洞位置和描述信息 