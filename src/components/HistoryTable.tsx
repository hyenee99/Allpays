import { useEffect, useMemo, useState } from "react";
import type { Transaction, TransactionsResponse } from "../types/transaction";
import axiosInstance from "../api/axios";
import type { statusProps, typeProps } from "../types/common";
import Button from "./Button";

// 날짜 형식 변환 함수
function formatDate(dateString: string) {
  const date = new Date(dateString);

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}
export default function HistoryTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statusList, setStatusList] = useState<statusProps[]>([]);
  const [typeList, setTypeList] = useState<typeProps[]>([]);
  const [selected, setSelected] = useState("");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 10개 보여주기

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get<TransactionsResponse>(
          "/payments/list"
        );
        if (res.data.status === 200) {
          setTransactions(res.data.data);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("거래 내역 조회 실패", err);
      }
    };

    const fetchStatusList = async () => {
      try {
        const res = await axiosInstance.get("common/payment-status/all");
        if (res.data.status === 200) {
          setStatusList(res.data.data);
        }
      } catch (err) {
        console.error("거래 상태 조회 실패", err);
      }
    };

    const fetchTypeList = async () => {
      try {
        const res = await axiosInstance.get("common/paymemt-type/all");
        if (res.data.status === 200) {
          setTypeList(res.data.data);
        }
      } catch (err) {
        console.log("결제 수단 조회 실패", err);
      }
    };

    fetchTransactions();
    fetchStatusList();
    fetchTypeList();
  }, [selected, searchText]);

  // 거래 상태 매치 함수
  const getStatusDescription = (status: string) => {
    const found = statusList.find((item) => item.code === status);
    return found ? found.description : status;
  };

  // 결제 수단 매치 함수
  const getTypeDescription = (type: string) => {
    const payType = typeList.find((item) => item.type === type);
    return payType ? payType.description : type;
  };

  // 필터링된 거래내역
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (selected) {
          return tx.status === selected;
        }
        return true;
      })
      .filter((tx) => {
        if (!searchText.trim()) return true;

        const text = searchText.toLowerCase();
        return (
          tx.paymentCode.toLowerCase().includes(text) ||
          tx.mchtCode.toLowerCase().includes(text)
        );
      });
  }, [transactions, selected, searchText]);

  // 표시할 데이터 계산하기
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, currentPage]);

  return (
    <>
      {/* 필터링 기능  */}
      <div className="p-2 w-full flex flex-col">
        <div className="flex justify-end gap-3 max-md:flex-col">
          <select
            className="border rounded-md w-40 h-10 text-center cursor-pointer"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">결제 상태</option>
            {statusList.map((item) => (
              <option key={item.code} value={item.code}>
                {item.description}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="border rounded-md w-70 h-10 p-2"
            placeholder="🔎검색어 입력 (결제 코드 / 가맹점 코드)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="font-semibold flex justify-end max-md:justify-start">
          총 {filteredTransactions.length} 건
        </div>
      </div>

      {/* 거래 내역 테이블  */}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-[#EAEAEA]">
          <tr>
            <th className="border p-2">결제코드</th>
            <th className="border p-2">가맹점코드</th>
            <th className="border p-2">결제금액</th>
            <th className="border p-2">통화</th>
            <th className="border p-2">결제수단</th>
            <th className="border p-2">결제상태</th>
            <th className="border p-2">결제일시</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.paymentCode}</td>
              <td className="border p-2">{item.mchtCode}</td>
              <td className="border p-2">
                {Math.floor(parseFloat(item.amount)).toLocaleString()}
              </td>
              <td className="border p-2">{item.currency}</td>
              <td className="border p-2">{getTypeDescription(item.payType)}</td>
              <td className="border p-2">
                {getStatusDescription(item.status)}
              </td>
              <td className="border p-2">{formatDate(item.paymentAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {currentData.length > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4 mb-4">
          <Button
            content="이전"
            width={100}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          />

          <span className="px-2">
            <span className="font-semibold">{currentPage}</span> / {totalPages}
          </span>

          <Button
            content="다음"
            width={100}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </div>
      )}
    </>
  );
}
