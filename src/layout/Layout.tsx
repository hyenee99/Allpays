import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="pt-19 p-3 min-h-screen flex flex-col">{children}</div>
    </>
  );
}
