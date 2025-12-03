import { useEffect, useMemo, useState } from "react";
import type { merchantsList } from "../types/merchants";
import axiosInstance from "../api/axios";
import Button from "./Button";
import type { statusProps } from "../types/common";

export default function MerchantsTable() {
  const [list, setList] = useState<merchantsList[]>([]);
  const [searchText, setSearchText] = useState("");
  const [mchtStatusList, setMchtStatusList] = useState<statusProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 10개 보여주기

  useEffect(() => {
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

    fetchList();
    fetchMchtStatusList();
  }, []);
  console.log(list);

  // 필터링된 가게
  const filteredMerchantsList = useMemo(() => {
    return list.filter((merchant) => {
      const text = searchText.toLowerCase();
      return (
        merchant.mchtCode.toLowerCase().includes(text) ||
        merchant.mchtName.includes(text)
      );
    });
  }, [list, searchText]);

  // 표시할 데이터 계산하기
  const totalPages = Math.ceil(filteredMerchantsList.length / itemsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredMerchantsList.slice(start, end);
  }, [filteredMerchantsList, currentPage]);

  // 가맹점 상태 코드 매치 함수
  const getStautsDescription = (status: string) => {
    const found = mchtStatusList.find((item) => item.code === status);
    return found ? found.description : status;
  };

  return (
    <>
      <div className="p-2 w-full flex flex-col">
        <div className="flex justify-end gap-3 max-md:flex-col">
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
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.mchtCode}</td>
              <td className="border p-2">{item.mchtName}</td>
              <td className="border p-2">
                {getStautsDescription(item.status)}
              </td>
              <td className="border p-2">{item.bizType}</td>
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
