export default function LoginPage() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6">Đăng nhập</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
