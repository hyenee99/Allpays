import { useEffect, useMemo, useState } from "react";
import type { merchantsList } from "../types/merchants";
import axiosInstance from "../api/axios";
import Button from "./Button";
import type { statusProps } from "../types/common";
import { useNavigate } from "react-router-dom";
import type { Transaction, TransactionsResponse } from "../types/transaction";

export default function MerchantsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [list, setList] = useState<merchantsList[]>([]);
  const [mchtStatusList, setMchtStatusList] = useState<statusProps[]>([]);
  const [searchText, setSearchText] = useState("");
  const [statusSelected, setStatusSelected] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBySales, setSortBySales] = useState("");
  const itemsPerPage = 10; // 한 페이지당 10개 보여주기
  const month = 11; //11월로 설정
  const navigate = useNavigate();

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

    const fetchList = async () => {
      try {
        const res = await axiosInstance.get("/merchants/list");
        if (res.data.status === 200) {
          setList(res.data.data);
          setCurrentPage(1);
        }
      } catch (err) {
        console.log("가맹점 목록 조회 실패", err);
      }
    };

    const fetchMchtStatusList = async () => {
      try {
        const res = await axiosInstance.get("/common/mcht-status/all");
        if (res.data.status === 200) {
          setMchtStatusList(res.data.data);
        }
      } catch (err) {
        console.log("가맹점 상태 코드 조회 실패", err);
      }
    };

    fetchTransactions();
    fetchList();
    fetchMchtStatusList();
  }, [statusSelected, searchText]);

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

  // 가맹점별 매출 저장
  const salesData = useMemo(() => {
    const totals = successTransaction.reduce((acc, tx) => {
      const key = tx.mchtCode;
      const amount = parseInt(tx.amount);
      acc[key] = (acc[key] ?? 0) + amount;
      return acc;
    }, {} as Record<string, number>);

    return totals;
  }, [successTransaction]);

  // 필터링된 가맹점
  const filteredMerchantsList = useMemo(() => {
    return list
      .filter((merchant) => {
        if (statusSelected) {
          return merchant.status === statusSelected;
        }
        return true;
      })
      .filter((merchant) => {
        const text = searchText.toLowerCase();
        return (
          merchant.mchtCode.toLowerCase().includes(text) ||
          merchant.mchtName.includes(text)
        );
      });
  }, [list, statusSelected, searchText]);

  // 필터링된 리스트에 매출액 붙이기
  const merchantsWithSales = useMemo(() => {
    return filteredMerchantsList.map((m) => ({
      ...m,
      sales: salesData[m.mchtCode] ?? 0,
    }));
  }, [filteredMerchantsList, salesData]);

  // 정렬 옵션 적용
  const sortedList = useMemo(() => {
    if (sortBySales === "asc") {
      return [...merchantsWithSales].sort((a, b) => a.sales - b.sales);
    }
    if (sortBySales === "desc") {
      return [...merchantsWithSales].sort((a, b) => b.sales - a.sales);
    }
    return merchantsWithSales;
  }, [merchantsWithSales, sortBySales]);

  // 표시할 데이터 계산하기
  const totalPages = Math.ceil(sortedList.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return sortedList.slice(start, end);
  }, [sortedList, currentPage]);

  // 가맹점 상태 코드 매치 함수
  const getStautsDescription = (status: string) => {
    const found = mchtStatusList.find((item) => item.code === status);
    return found ? found.description : status;
  };

  return (
    <>
      <div className="p-2 w-full flex flex-col">
        <div className="flex justify-end gap-3 max-md:flex-col">
          {/* 가맹점 상태 선택 */}
          <select
            className="border rounded-md w-40 h-10 text-center cursor-pointer"
            value={statusSelected}
            onChange={(e) => setStatusSelected(e.target.value)}
          >
            <option value="">가맹점 상태</option>
            {mchtStatusList.map((item) => (
              <option key={item.code} value={item.code}>
                {item.description}
              </option>
            ))}
          </select>

          <select
            className="border rounded-md w-40 h-10 text-center cursor-pointer"
            value={sortBySales}
            onChange={(e) => setSortBySales(e.target.value)}
          >
            <option value="">정렬 없음</option>
            <option value="asc">매출 낮은순</option>
            <option value="desc">매출 높은순</option>
          </select>

          {/* 검색창 */}
          <input
            type="text"
            className="border rounded-md w-70 h-10 p-2"
            placeholder="🔎검색어 입력 (가맹점 코드 / 가맹점명)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="font-semibold flex justify-end max-md:justify-start">
          총 {filteredMerchantsList.length} 건
        </div>
      </div>
      {/* 가맹점 조회 테이블  */}
      <table className="w-full border rounded-lg overflow-hidden">
        <thead className="bg-[#EAEAEA]">
          <tr>
            <th className="border p-2">코드</th>
            <th className="border p-2">가맹점명</th>
            <th className="border p-2">상태</th>
            <th className="border p-2">업종</th>
            <th className="border p-2">매출</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => {
            const sales = salesData[item.mchtCode] ?? 0;

            return (
              <tr
                key={index}
                className="hover:bg-[#EAEAEA] cursor-pointer hover:font-semibold"
                onClick={() => {
                  navigate("/merchants/detail", {
                    state: { code: item.mchtCode },
                  });
                }}
              >
                <td className="border p-2">{item.mchtCode}</td>
                <td className="border p-2">{item.mchtName}</td>
                <td className="border p-2">
                  {getStautsDescription(item.status)}
                </td>
                <td className="border p-2">{item.bizType}</td>
                <td className="border p-2">{sales.toLocaleString()}</td>
              </tr>
            );
          })}
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
