/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/Smart-City.jpg')",
            opacity: 0.8,
          }}
        >
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/70 via-indigo-900/60 to-purple-900/70"></div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-2 h-2 bg-white rounded-full top-1/4 left-1/4 animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute w-3 h-3 bg-blue-300 rounded-full top-1/3 right-1/4 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute w-2 h-2 bg-purple-300 rounded-full bottom-1/4 left-1/3 animate-ping" style={{ animationDuration: '5s' }}></div>
          <div className="absolute w-4 h-4 bg-indigo-300 rounded-full top-2/3 right-1/3 animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-white text-center max-w-4xl animate-fade-in">
            <h2 className="text-7xl font-bold mb-8 drop-shadow-2xl animate-float bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent animate-gradient">
              Nền Tảng Thành Phố Thông Minh
            </h2>
            <p className="text-2xl opacity-90 drop-shadow-md leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
              Quản lý thông minh, Thành phố hiện đại
            </p>
            <div className="mt-10 pt-8 border-t border-white/30 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-xl opacity-80">
                Giải pháp toàn diện cho thành phố thông minh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-[480px] flex items-center justify-center p-8 bg-gray-50">
        <LoginForm />
      </div>
    </div>
  );
}
