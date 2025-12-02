import { useEffect, useState } from "react";
import type { Transaction, TransactionsResponse } from "../types/transaction";
import axiosInstance from "../api/axios";
import type { statusProps, typeProps } from "../types/common";

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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get<TransactionsResponse>(
          "/payments/list"
        );
        if (res.data.status === 200) {
          setTransactions(res.data.data);
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
  }, []);
  console.log(typeList);

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

  return (
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
        {transactions.map((item, index) => (
          <tr key={index}>
            <td className="border p-2">{item.paymentCode}</td>
            <td className="border p-2">{item.mchtCode}</td>
            <td className="border p-2">
              {Math.floor(parseFloat(item.amount)).toLocaleString()}
            </td>
            <td className="border p-2">{item.currency}</td>
            <td className="border p-2">{getTypeDescription(item.payType)}</td>
            <td className="border p-2">{getStatusDescription(item.status)}</td>
            <td className="border p-2">{formatDate(item.paymentAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
