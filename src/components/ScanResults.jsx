import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiDownload, FiActivity, FiShield, FiClock, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const ScanResults = ({ scanResults = { vulnerabilities: [] }, stats = {} }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  // 准备图表数据
  const severityData = [
    { name: '严重', value: scanResults.vulnerabilities.filter(v => v.severity === 'critical').length },
    { name: '高危', value: scanResults.vulnerabilities.filter(v => v.severity === 'high').length },
    { name: '中危', value: scanResults.vulnerabilities.filter(v => v.severity === 'medium').length },
    { name: '低危', value: scanResults.vulnerabilities.filter(v => v.severity === 'low').length }
  ].filter(item => item.value > 0);

  const vulnerabilityTypeData = scanResults.vulnerabilities.reduce((acc, vuln) => {
    acc[vuln.type] = (acc[vuln.type] || 0) + 1;
    return acc;
  }, {});

  const COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'];

  const handleExport = () => {
    // TODO: 实现实际的导出功能
    const scanId = scanResults.scanId;
    window.location.href = `/api/v1/scan/${scanId}/report?format=json`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {/* 顶部统计区域 */}
        <div className="mb-12">
          <div className="flex items-center space-x-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-1 relative min-w-[280px] h-40 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 transition-shadow duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent"></div>
              <div className="relative h-full p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 text-base">总扫描次数</span>
                  <FiActivity className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-3">{stats.totalScans || 0}</div>
                  <div className="flex items-center text-purple-300 text-sm space-x-2">
                    <FiTrendingUp className="w-4 h-4" />
                    <span>较上周增长 {stats.scansTrend || 0}%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 relative min-w-[280px] h-40 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-red-500/10 transition-shadow duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-transparent"></div>
              <div className="relative h-full p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-red-300 text-base">严重漏洞</span>
                  <FiAlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-3">{stats.criticalIssues || 0}</div>
                  <div className="flex items-center text-red-300 text-sm space-x-2">
                    <FiTrendingDown className="w-4 h-4" />
                    <span>较上周减少 {stats.criticalIssuesTrend || 0}%</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 relative min-w-[280px] h-40 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-green-500/10 transition-shadow duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent"></div>
              <div className="relative h-full p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-green-300 text-base">已修复漏洞</span>
                  <FiShield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <div className="text-5xl font-bold text-white mb-3">{stats.resolvedIssues || 0}%</div>
                  <div className="flex items-center text-green-300 text-sm space-x-2">
                    <FiTrendingUp className="w-4 h-4" />
                    <span>修复率提升 {stats.resolvedIssuesTrend || 0}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 图表区域 */}
        {(severityData.length > 0 || Object.keys(vulnerabilityTypeData).length > 0) && (
          <div className="grid grid-cols-2 gap-8 mb-12">
            {severityData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FiAlertCircle className="mr-2" />
                    漏洞严重程度分布
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedTimeRange('week')}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        selectedTimeRange === 'week' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      本周
                    </button>
                    <button
                      onClick={() => setSelectedTimeRange('month')}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                        selectedTimeRange === 'month' ? 'bg-purple-500/20 text-purple-300' : 'text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      本月
                    </button>
                  </div>
                </div>
                <div className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '0.5rem',
                          color: '#F3F4F6'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {Object.keys(vulnerabilityTypeData).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold mb-8 flex items-center">
                  <FiActivity className="mr-2" />
                  漏洞类型分布
                </h2>
                <div className="h-[360px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(vulnerabilityTypeData).map(([type, count]) => ({ type, count }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="type" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '0.5rem',
                          color: '#F3F4F6'
                        }}
                      />
                      <Bar dataKey="count" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* 扫描结果列表 */}
        {scanResults.vulnerabilities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 mb-12 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiAlertCircle className="mr-2" />
                  详细扫描结果
                </h2>
                <div className="flex items-center text-sm text-gray-400">
                  <FiClock className="mr-1" />
                  {new Date(scanResults.timestamp).toLocaleString()}
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                className="flex items-center px-6 py-3 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors duration-200"
              >
                <FiDownload className="mr-2" />
                导出报告
              </motion.button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {scanResults.vulnerabilities.map((vuln, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border ${
                    vuln.severity === 'critical' 
                      ? 'bg-red-500/10 border-red-500/30 hover:shadow-lg hover:shadow-red-500/5' 
                      : 'bg-yellow-500/10 border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/5'
                  } transition-shadow duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{vuln.type}</h3>
                    <span className={`px-4 py-1.5 rounded-full text-sm ${
                      vuln.severity === 'critical' 
                        ? 'bg-red-500/20 text-red-300' 
                        : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {vuln.severity === 'critical' ? '严重' : '高危'}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{vuln.description}</p>
                  <div className="space-y-4">
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">位置</p>
                      <p className="text-gray-300">{vuln.location}</p>
                    </div>
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">详情</p>
                      <p className="text-gray-300">{vuln.details}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 无数据显示 */}
        {scanResults.vulnerabilities.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50 text-center"
          >
            <FiActivity className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">暂无扫描结果</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScanResults; 