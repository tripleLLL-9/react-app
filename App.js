import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FileScanner from './components/FileScanner';
import ScanResults from './components/ScanResults';
import Navigation from './components/Navigation';

function App() {
  // 初始化扫描结果和统计数据的状态
  const [scanResults, setScanResults] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // 定义一个异步函数来获取扫描结果和统计数据
    const fetchScanResults = async () => {
      try {
        // 假设后端 API 端点为 /api/scan-results
        const response = await fetch('/api/scan-results');
        if (!response.ok) {
          throw new Error('网络响应异常');
        }
        const data = await response.json();
        // 更新扫描结果和统计数据的状态
        setScanResults(data.scanResults);
        setStats(data.stats);
      } catch (error) {
        console.error('获取扫描结果时出错:', error);
      }
    };

    // 调用异步函数来获取数据
    fetchScanResults();
  }, []);

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
              // 只有当扫描结果和统计数据都存在时才渲染 ScanResults 组件
              scanResults && stats ? (
                <ScanResults 
                  scanResults={scanResults}
                  stats={stats}
                />
              ) : (
                <div>正在加载扫描结果...</div>
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;