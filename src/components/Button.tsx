interface buttonProps {
  content: string;
  width?: number;
  height?: number;
  onClick?: () => void;
}
export default function Button({
  content,
  width = 200,
  height = 40,
  onClick,
}: buttonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-[#000054] text-white hover:bg-[#010199] cursor-pointer rounded-2xl"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {content}
    </button>
  );
}
