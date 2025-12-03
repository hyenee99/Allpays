import { useEffect, useMemo, useState } from "react";
import PayTypeChart from "../components/charts/PayTypeChart";
import HistoryTable from "../components/HistoryTable";
import type { Transaction, TransactionsResponse } from "../types/transaction";
import axiosInstance from "../api/axios";
import type { typeProps } from "../types/common";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
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
    fetchTypeList();
  }, []);

  // 바 그래프 타입 변환
  const barData = useMemo(() => {
    const counts: Record<string, number> = {};
    transactions.forEach((tx) => {
      counts[tx.payType] = (counts[tx.payType] ?? 0) + 1;
    });

    const total = transactions.length;

    return typeList
      .map((types) => ({
        payType: types.description,
        percentage: total > 0 ? ((counts[types.type] ?? 0) / total) * 100 : 0,
      }))
      .filter((item) => item.percentage > 0);
  }, [transactions, typeList]);

  return (
    <div className="w-full">
      <div>
        <h1 className="text-2xl mb-2">🧾결제 수단별 통계</h1>
        <PayTypeChart data={barData} />
      </div>
      <div>
        <h1 className="text-2xl mb-2">🧾전체 거래 내역 조회</h1>
        <HistoryTable />
      </div>
    </div>
  );
}
