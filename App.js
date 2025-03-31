import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FileScanner from './components/FileScanner';
import ScanResults from './components/ScanResults';
import Navigation from './components/Navigation';

function App() {
  // 虚拟的扫描结果数据
  const [scanResults] = useState({
    timestamp: new Date().toISOString(),
    vulnerabilities: [
      {
        type: 'XSS漏洞',
        severity: 'critical',
        location: 'src/components/Form.jsx:45',
        description: '发现潜在的跨站脚本攻击风险',
        details: '用户输入未经过滤直接插入DOM'
      },
      {
        type: 'SQL注入',
        severity: 'high',
        location: 'src/services/api.js:23',
        description: '检测到SQL注入漏洞',
        details: '使用参数化查询替代字符串拼接'
      },
      {
        type: 'CSRF攻击',
        severity: 'high',
        location: 'src/pages/UserProfile.jsx:78',
        description: '缺少CSRF令牌验证',
        details: '表单提交时未包含CSRF令牌'
      },
      {
        type: '文件上传漏洞',
        severity: 'critical',
        location: 'src/components/FileUpload.jsx:92',
        description: '文件类型验证不严格',
        details: '允许上传可执行文件类型'
      }
    ]
  });

  const [stats] = useState({
    totalScans: 128,
    criticalIssues: 42,
    resolvedIssues: 68,
  });

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <Navigation />
        <Routes>
          <Route 
            path="/" 
            element={
              <FileScanner 
                onScanComplete={(results) => {
                  console.log('扫描完成:', results);
                }}
              />
            } 
          />
          <Route 
            path="/results" 
            element={
              <ScanResults 
                scanResults={scanResults}
                stats={stats}
              />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 