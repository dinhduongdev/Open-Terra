import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
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
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/70 via-teal-900/60 to-cyan-900/70"></div>
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-2 h-2 bg-white rounded-full top-1/4 left-1/4 animate-ping" style={{ animationDuration: '3s' }}></div>
          <div className="absolute w-3 h-3 bg-emerald-300 rounded-full top-1/3 right-1/4 animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute w-2 h-2 bg-teal-300 rounded-full bottom-1/4 left-1/3 animate-ping" style={{ animationDuration: '5s' }}></div>
          <div className="absolute w-4 h-4 bg-cyan-300 rounded-full top-2/3 right-1/3 animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>

        {/* Content overlay */}
        <div className="relative z-10 flex items-center justify-center w-full p-12">
          <div className="text-white text-center max-w-4xl animate-fade-in">
            <h2 className="text-7xl font-bold mb-8 drop-shadow-2xl animate-float bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent animate-gradient">
              Nền Tảng Thành Phố Thông Minh
            </h2>
            <p className="text-2xl opacity-90 drop-shadow-md leading-relaxed animate-slide-up" style={{ animationDelay: '0.3s' }}>
              Tham gia cùng chúng tôi để xây dựng thành phố thông minh
            </p>
            <div className="mt-10 pt-8 border-t border-white/30 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-xl opacity-80">
                Đăng ký ngay để trải nghiệm các dịch vụ thông minh
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-[480px] flex items-center justify-center p-8 bg-gray-50">
        <RegisterForm />
      </div>
    </div>
  );
}
