interface buttonProps {
  content: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  disabled?: boolean;
}
export default function Button({
  content,
  width = 200,
  height = 40,
  onClick,
  disabled = false,
}: buttonProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl text-white cursor-pointer 
        bg-[#000054] hover:bg-[#010199]
        ${disabled ? "opacity-50 cursor-not-allowed hover:bg-[#000054]" : ""}
      `}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {content}
    </button>
  );
}
