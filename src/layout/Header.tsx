export default function Header() {
  return (
    <div className="flex items-center justify-between fixed top-0 left-0 z-10 w-full h-16 bg-[#000054] text-white font-semibold text-2xl p-3">
      <h1>Allpays</h1>
      <nav>
        <ul className="flex gap-4 text-xl cursor-pointer font-medium">
          <li className="hover:font-semibold">HOME</li>
          <li className="hover:font-semibold">거래내역조회</li>
        </ul>
      </nav>
    </div>
  );
}
