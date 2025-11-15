import React from 'react';
import { Heart, Github } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="flex items-center gap-2 justify-center md:justify-start">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for Uttarakhand Tourism
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Powered by Google Gemini AI
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
              <span className="text-sm">GitHub</span>
            </a>
            <p className="text-sm text-gray-400">
              © 2024 Uttarakhand Tourism AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

