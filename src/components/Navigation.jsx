import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiUpload, FiBarChart2, FiShield } from 'react-icons/fi';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white">
              <FiShield className="w-6 h-6 text-purple-400" />
              <span>漏洞扫描器</span>
            </Link>
            <div className="flex space-x-1">
              <Link
                to="/"
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <FiUpload className="mr-2" />
                文件扫描
              </Link>
              <Link
                to="/results"
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === '/results'
                    ? 'bg-purple-500/20 text-purple-300 shadow-lg shadow-purple-500/10'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <FiBarChart2 className="mr-2" />
                扫描结果
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 