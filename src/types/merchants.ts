export interface merchantsList {
  mchtCode: string;
  mchtName: string;
  status: string;
  bizType: string;
}

export interface merchantsDetailProps {
  mchtCode: string;
  mchtName: string;
  status: string;
  bizType: string;
  bizNo: string;
  address: string;
  phone: string;
  email: string;
  registeredAt: string;
  updatedAt: string;
}
