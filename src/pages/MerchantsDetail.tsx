import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";
import type { merchantsDetailProps } from "../types/merchants";
import type { statusProps } from "../types/common";
import { formatDate } from "../utils/fomatDate";
import DetailBox from "../components/Detailbox";

export default function MerhchantsDetail() {
  const location = useLocation();
  const state = location.state;
  const mchtCode = state.code;
  const sales = state.sales;
  const [detail, setDetail] = useState<merchantsDetailProps>();
  const [mchtStatusList, setMchtStatusList] = useState<statusProps[]>([]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosInstance.get(`/merchants/details/${mchtCode}`);
        if (res.data.status === 200) {
          setDetail(res.data.data);
        }
      } catch (err) {
        console.log("가맹점 상세 조회 실패", err);
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
    fetchDetail();
    fetchMchtStatusList();
  }, [mchtCode]);

  // 가맹점 상태 코드 매치 함수
  const getStautsDescription = (status: string) => {
    const found = mchtStatusList.find((item) => item.code === status);
    return found ? found.description : status;
  };

  if (!detail) return null;
  const data = [
    { title: "가맹점 코드", content: detail.mchtCode },
    { title: "가맹점명", content: detail.mchtName },
    { title: "주소", content: detail.address },
    { title: "사업자번호", content: detail.bizNo },
    { title: "업종", content: detail.bizType },
    { title: "이메일", content: detail.email },
    { title: "전화번호", content: detail.phone },
    { title: "등록일", content: formatDate(detail.registeredAt) },
    { title: "업데이트일", content: formatDate(detail.updatedAt) },
    { title: "상태", content: getStautsDescription(detail.status) },
    { title: "매출", content: sales.toLocaleString() },
  ];

  return (
    <div className="bg-[#EAEAEA] w-[40%] p-2 rounded-xl m-auto flex flex-col justify-center gap-2 shadow-md">
      {data.map((item, index) => (
        <DetailBox key={index} title={item.title} content={item.content} />
      ))}
    </div>
  );
}
