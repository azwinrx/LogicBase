import { NavLink } from "react-router-dom";

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {
  const menu = [
    { to: "/beranda", label: "Beranda", img: "/beranda.png" },
    { to: "/materi", label: "Materi", img: "/materi.png" },
    { to: "/riwayat", label: "Riwayat", img: "/riwayat.png" },
    { to: "/forum", label: "Forum", img: "/forum.png" },
  ];

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (setIsSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`
        w-60 h-screen bg-[#132238] text-white flex flex-col p-4 fixed z-50 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      {/* Close button for mobile */}
      <div className="flex items-center justify-between mb-4 lg:justify-start">
        <div className="flex items-center -ml-0.5 -mt-1 gap-7">
          <img
            src="/Icon Kobi (maskot LogicBase)/kobiMelambai.png"
            className="w-10 mr-2"
            alt="LogicBase Mascot"
          />
          <h1 className="text-2xl sm:text-3xl font-bold -ml-8">LogicBase</h1>
        </div>
        {setIsSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      <nav className="mt-6 lg:mt-10 flex flex-col gap-2">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-200 text-sm sm:text-base
              ${
                isActive
                  ? "bg-slate-400 text-[#132238] font-semibold"
                  : "hover:text-gray-300 hover:bg-slate-700/50"
              }`
            }
          >
            <img
              className="w-8 sm:w-10 flex-shrink-0"
              src={item.img}
              alt={`${item.label} icon`}
            />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
