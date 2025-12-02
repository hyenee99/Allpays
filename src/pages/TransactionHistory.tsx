import HistoryTable from "../components/HistoryTable";

export default function TransactionHistory() {
  return (
    <div>
      <h1 className="text-2xl mb-2">🧾전체 거래 내역 조회</h1>
      <HistoryTable />
    </div>
  );
}
