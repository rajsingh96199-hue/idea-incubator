import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-6 w-full bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
}
