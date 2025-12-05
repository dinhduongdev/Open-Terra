interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
      <p className="text-red-700 font-semibold mb-2 flex items-center gap-2">
        <span className="text-xl">❌</span>
        Lỗi tải dữ liệu
      </p>
      <p className="text-red-600">{message}</p>
    </div>
  );
}
