// src/components/layout/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 right-0 left-0 lg:left-64 h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-full px-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} RACE. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
            Privacy Policy
          </a>
          <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;