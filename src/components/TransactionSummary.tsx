import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";

interface Transaction {
  paymentCode: string;
  mchtCode: string;
  amount: string;
  currency: string;
  payType: string;
  status: string;
  paymentAt: string;
}

interface TransactionsResponse {
  status: number;
  message: string;
  data: Transaction[];
}
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
  const successTransaction = transactions.filter((tx) => {
    const date = new Date(tx.paymentAt);
    const txMonth = date.getMonth() + 1;
    return tx.status === "SUCCESS" && txMonth == month;
  });

  // 총 거래 금액 계산
  const totalAmount = successTransaction.reduce((sum, tx) => {
    return sum + parseFloat(tx.amount);
  }, 0);

  // 평균 거래 금액
  const averageAmount =
    successTransaction.length > 0
      ? Math.floor(totalAmount / successTransaction.length)
      : 0;

  return (
    <div className="bg-[#EAEAEA] rounded-lg p-2">
      <div>
        <h1 className="text-2xl mb-2">📌이번 달의 거래 요약</h1>
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
      </div>
    </div>
  );
}
