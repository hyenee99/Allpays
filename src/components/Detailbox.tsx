interface boxProps {
  title: string;
  content: string;
}
export default function DetailBox({ title, content }: boxProps) {
  return (
    <div className="flex justify-between bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
      <span className="text-gray-500 font-semibold">{title}</span>
      <span className="text-gray-800">{content ?? "-"}</span>
    </div>
  );
}
