import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axios";
import type { Transaction, TransactionsResponse } from "../types/transaction";
import MonthlyChart from "./charts/MonthlyChart";
import StatusPieChart from "./charts/PieChart";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import type { statusProps } from "../types/common";

export default function TransactionSummary() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statusList, setStatusList] = useState<statusProps[]>([]);
  const navigate = useNavigate();
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

    fetchTransactions();
    fetchStatusList();
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

  // 라인 차트 데이터로 변환
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

  // 파이 그래프 데이터 변환
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    transactions.forEach((tx) => {
      counts[tx.status] = (counts[tx.status] ?? 0) + 1;
    });
    return statusList
      .map((status) => ({
        name: status.description,
        value: counts[status.code] ?? 0,
      }))
      .filter((item) => item.value > 0);
  }, [transactions, statusList]);

  // 경로로 이동
  const handleClick = () => {
    navigate("/transactions");
  };

  return (
    <div className="bg-[#EAEAEA] rounded-lg p-3">
      {/* 거래 요약 */}
      <h1 className="text-2xl mb-2 max-md:text-xl">📌이번 달의 거래 요약</h1>
      <div className="flex items-center justify-center max-md:flex-col max-md:gap-3">
        <div className="text-xl max-md:text-lg">
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

        {/* 총 매출 및 결제 상태 그래프 */}
        <div className="w-[80%] flex flex-col">
          <h1 className="text-center text-xl max-md:text-lg">
            이번 달 총 매출
          </h1>
          <MonthlyChart data={chartData} />

          <h1 className="text-center text-xl max-md:text-lg">결제 상태</h1>
          <div className="flex justify-center items-center max-md:flex-col">
            <StatusPieChart data={pieData} />

            <div className="w-[30%] flex flex-col gap-3 items-center max-md:w-full max-md:gap-1">
              <h1 className="text-xl max-md:text-lg">
                {transactions.length} 건 중 {successTransaction.length} 건의
                결제 성공
              </h1>
              <p className="text-[#4F46E5]">
                (성공률{" "}
                {transactions.length > 0
                  ? (
                      (successTransaction.length / transactions.length) *
                      100
                    ).toFixed(1)
                  : 0}
                %)
              </p>
              <Button content="거래내역 조회하기" onClick={handleClick} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
