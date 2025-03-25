import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiActivity } from 'react-icons/fi';

const FileScanner = ({ onScanComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [vulnerabilityTypes, setVulnerabilityTypes] = useState({
    Arbitraryfile_access_CWE_22: false,
    Authentication_bypass_CWE_287: false,
    Buffer_overflow_CWE_119: false,
    Command_injection_CWE_78: false,
    Integer_overflow_CWE_190: false,
    others: false
  });
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setError(null);
  };

  const handleVulnerabilityTypeChange = (type) => {
    setVulnerabilityTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('请先选择要扫描的文件');
      return;
    }

    setIsScanning(true);
    setError(null);
    setLogs([]);

    try {
      // TODO: 实现实际的文件扫描逻辑
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('vulnerabilityTypes', JSON.stringify(vulnerabilityTypes));

      // 这里将来需要调用实际的API
      const response = await fetch('/api/v1/scan', {
        method: 'POST',
        body: formData
      });

      const scanResults = await response.json();
      onScanComplete(scanResults);
      
    } catch (err) {
      setError('扫描过程中发生错误');
      addLog('扫描过程中发生错误: ' + err.message, 'error');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* 文件上传区域 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FiUpload className="mr-2" />
            文件扫描
          </h2>
          <div
            className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors duration-300"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              setSelectedFile(file);
            }}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                  <FiUpload className="w-8 h-8 text-purple-400" />
                </div>
                <span className="text-gray-300 text-lg">
                  {selectedFile ? selectedFile.name : '点击或拖拽文件到此处'}
                </span>
                {selectedFile && (
                  <span className="text-sm text-gray-400 mt-2">
                    文件大小: {(selectedFile.size / 1024).toFixed(2)} KB
                  </span>
                )}
              </motion.div>
            </label>
          </div>

          {/* 漏洞类型选择 */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {Object.entries(vulnerabilityTypes).map(([type, checked]) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleVulnerabilityTypeChange(type)}
                className={`p-4 rounded-xl flex items-center justify-between ${
                  checked 
                    ? 'bg-purple-500/20 border-purple-500/50' 
                    : 'bg-gray-700/20 border-gray-700'
                } border transition-colors duration-200`}
              >
                <span className="text-gray-300">
                  {type === 'Arbitraryfile_access_CWE_22' && '任意文件访问（CWE-22）'}
                  {type === 'Authentication_bypass_CWE_287' && '认证绕过（CWE-287）'}
                  {type === 'Buffer_overflow_CWE_119' && '缓冲区溢出（CWE-119）'}
                  {type === 'Command_injection_CWE_78' && '命令注入（CWE-78）'}
                  {type === 'Integer_overflow_CWE_190' && '整数溢出（CWE-190）'}
                  {type === 'others' && '其他'}
                </span>
                <div className={`w-4 h-4 rounded-full ${
                  checked ? 'bg-purple-500' : 'bg-gray-600'
                }`} />
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleScan}
            disabled={isScanning}
            className={`w-full mt-6 py-4 rounded-xl text-white font-semibold transition-all duration-200 ${
              isScanning
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700'
            }`}
          >
            {isScanning ? (
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <FiActivity className="w-5 h-5" />
                </motion.div>
                扫描中...
              </div>
            ) : (
              '开始扫描'
            )}
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* 日志区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FiActivity className="mr-2" />
            扫描日志
          </h2>
          <div className="h-64 overflow-y-auto space-y-2">
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start space-x-2 p-2 rounded-lg ${
                  log.type === 'error' ? 'bg-red-500/10' :
                  log.type === 'warning' ? 'bg-yellow-500/10' :
                  log.type === 'success' ? 'bg-green-500/10' :
                  'bg-gray-700/10'
                }`}
              >
                <span className="text-gray-500 text-sm">{log.timestamp}</span>
                <span className={`flex-1 ${
                  log.type === 'error' ? 'text-red-300' :
                  log.type === 'warning' ? 'text-yellow-300' :
                  log.type === 'success' ? 'text-green-300' :
                  'text-gray-300'
                }`}>
                  {log.message}
                </span>
              </motion.div>
            ))}
            {logs.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                暂无日志记录
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FileScanner;