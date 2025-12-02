import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axios";
import type { Transaction, TransactionsResponse } from "../types/transaction";
import MonthlyChart from "./charts/MonthlyChart";

export default function TransactionSummary() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const month = 11; //11월로 설정

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
    fetchTransactions();
  }, []);

  // 월이 11월이고, 성공한 거래만 필터링
  const successTransaction = useMemo(
    () =>
      transactions.filter((tx) => {
        const date = new Date(tx.paymentAt);
        const txMonth = date.getMonth() + 1;
        return tx.status === "SUCCESS" && txMonth == month;
      }),
    [transactions, month]
  );

  // 총 거래 금액 계산
  const totalAmount = successTransaction.reduce((sum, tx) => {
    return sum + parseFloat(tx.amount);
  }, 0);

  // 평균 거래 금액
  const averageAmount =
    successTransaction.length > 0
      ? Math.floor(totalAmount / successTransaction.length)
      : 0;

  // 차트 데이터로 변환
  const chartData: { date: string; total: number }[] = useMemo(() => {
    const dailyTotals: Record<string, number> = successTransaction.reduce(
      (acc, tx) => {
        const date = new Date(tx.paymentAt);
        const key = `${date.getMonth() + 1}/${date.getDate()}`;
        const amount = parseFloat(tx.amount);
        acc[key] = (acc[key] ?? 0) + amount;
        return acc;
      },
      {} as Record<string, number>
    );

    const result: { date: string; total: number }[] = Object.entries(
      dailyTotals
    )
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => {
        const [am, ad] = a.date.split("/").map(Number);
        const [bm, bd] = b.date.split("/").map(Number);
        return (
          new Date(2025, am - 1, ad).getTime() -
          new Date(2025, bm - 1, bd).getTime()
        );
      });

    return result;
  }, [successTransaction]);

  return (
    <div className="bg-[#EAEAEA] rounded-lg p-2">
      <h1 className="text-2xl mb-2">📌이번 달의 거래 요약</h1>
      <div className="flex items-center  justify-center">
        <div className="text-xl">
          <h1>{month}월</h1>
          <ul className="leading-9">
            <li>
              성공 거래 건수:{" "}
              <span className="font-bold">{successTransaction.length} </span>건
            </li>
            <li>
              총 거래 금액:{" "}
              <span className="font-bold">{totalAmount.toLocaleString()}</span>
              원
            </li>
            <li>
              평균 결제 금액:{" "}
              <span className="font-bold">
                {averageAmount.toLocaleString()}{" "}
              </span>
              원
            </li>
          </ul>
        </div>

        <div className="w-[80%]">
          <h1 className="text-center">이번 달 총 매출</h1>
          <MonthlyChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
