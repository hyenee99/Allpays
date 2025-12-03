import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../api/axios";
import type { merchantsDetailProps } from "../types/merchants";
import type { statusProps } from "../types/common";
import { formatDate } from "../utils/fomatDate";

export default function MerhchantsDetail() {
  const location = useLocation();
  const state = location.state;
  const mchtCode = state.code;
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
  }, []);

  // 가맹점 상태 코드 매치 함수
  const getStautsDescription = (status: string) => {
    const found = mchtStatusList.find((item) => item.code === status);
    return found ? found.description : status;
  };
  return (
    <div>
      <p>주소 {detail?.address}</p>
      <p>사업자번호 {detail?.bizNo}</p>
      <p>업종{detail?.bizType}</p>
      <p>이메일{detail?.email}</p>
      <p>코드{detail?.mchtCode}</p>
      <p>가맹점명{detail?.mchtName}</p>
      <p>전화번호{detail?.phone}</p>
      <p>등록일{formatDate(detail?.registeredAt ?? "")}</p>
      <p>업데이트일{formatDate(detail?.updatedAt ?? "")}</p>
      <p>상태{getStautsDescription(detail?.status ?? "")}</p>
    </div>
  );
}
