import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between fixed top-0 left-0 z-10 w-full h-16 bg-[#000054] text-white font-semibold text-2xl p-3">
      <h1>Allpays</h1>
      <nav>
        <ul className="flex gap-4 text-xl cursor-pointer font-medium max-md:text-sm">
          <li
            className="hover:font-semibold"
            onClick={() => {
              navigate("/");
            }}
          >
            HOME
          </li>
          <li
            className="hover:font-semibold"
            onClick={() => {
              navigate("/transactions");
            }}
          >
            거래내역조회
          </li>
          <li
            className="hover:font-semibold"
            onClick={() => {
              navigate("/merchants");
            }}
          >
            가맹점 관리
          </li>
        </ul>
      </nav>
    </div>
  );
}
