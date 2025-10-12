import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchMateri } from "../../helper/supabaseMateri.js";
import { useAuth } from "../../helper/authUtils.js";
import { useSearch } from "../../helper/useSearch.js";

export default function Header({ setIsSidebarOpen }) {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const { user, logout } = useAuth();
  const { updateSearchTerm } = useSearch();

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      // Update search context for filtering
      updateSearchTerm(search.trim());

      if (search.trim()) {
        setIsSearching(true);
        try {
          const results = await searchMateri(search.trim(), 5);
          setSuggestions(results);
          setShowDropdown(results.length > 0);
        } catch (error) {
          console.error("Error searching materials:", error);
          setSuggestions([]);
          setShowDropdown(false);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
        setIsSearching(false);
      }
    }, 300); // 300ms debounce for better responsiveness

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [search, updateSearchTerm]);

  // Format tanggal bergabung
  const formatJoinDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setShowProfile(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    // Search logic is handled by useEffect with debounce
  };

  // Handler pencarian saat tekan Enter
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && search.trim()) {
      // Just close dropdown, search filtering is handled by useEffect
      setShowDropdown(false);
      inputRef.current?.blur(); // Remove focus from input
    }
  };

  // Redirect ke detail materi saat sugesti diklik
  const handleSuggestionClick = (slug) => {
    setSearch("");
    setSuggestions([]);
    setShowDropdown(false);
    updateSearchTerm(""); // Clear search context
    navigate(`/materi/${slug}`);
  };

  // Tutup dropdown jika klik di luar
  const handleBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 150); // Slightly longer delay to allow click on suggestions
  };

  // Tampilkan profile hanya jika pencarian tidak aktif
  const handleProfileClick = () => {
    if (!search) {
      setShowProfile((prev) => !prev);
    }
  };

  return (
    <header className="w-full bg-[#132238] text-white p-4 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile hamburger menu */}
      {setIsSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors mr-4"
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      <div className="flex-1"></div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Kobi mascot - hide on very small screens */}
        <img
          src="/Icon Kobi (maskot LogicBase)/KobiMengajak.svg"
          className="h-16 sm:h-20 lg:h-24 absolute right-48 sm:right-56 lg:right-64 hidden sm:block"
          alt="Kobi Mascot"
        />

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari materi..."
            className="p-2 rounded-md text-black pr-10 w-40 sm:w-48 lg:w-auto text-sm sm:text-base"
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            onBlur={handleBlur}
          />
          {/* Loading indicator */}
          {isSearching && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
          {/* Dropdown hasil pencarian */}
          {showDropdown && suggestions.length > 0 && !isSearching && (
            <div className="absolute left-0 mt-1 w-full bg-white text-black rounded shadow-lg z-30 max-h-60 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 cursor-pointer hover:bg-sky-100 border-b text-sm"
                  onMouseDown={() => handleSuggestionClick(item.slug)}
                >
                  {item.nama_materi}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Icon profile */}
        <div className="relative">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center cursor-pointer"
            onClick={handleProfileClick}
          >
            <img
              src="/Icon Kobi (maskot LogicBase)/kobiSenang.svg"
              alt="Profile"
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover"
            />
          </div>
          {showProfile && !search && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white text-black rounded shadow-lg z-20 p-4">
              <div
                className="absolute -top-0.5 left-2 rounded-full text-gray-500 hover:text-gray-800 text-2xl cursor-pointer"
                onClick={() => setShowProfile(false)}
                aria-label="Close"
              >
                &times;
              </div>
              <div className="flex items-center gap-3 mb-4 border-b pb-2 mt-2">
                <img
                  src="/Icon Kobi (maskot LogicBase)/kobiSenang.svg"
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base sm:text-lg truncate">
                    {user?.user_metadata?.name ||
                      user?.email?.split("@")[0] ||
                      "Nama Pengguna"}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {user?.email || "user@email.com"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Bergabung sejak: {formatJoinDate(user?.created_at)}
                  </div>
                </div>
              </div>
              <button
                className="w-full px-4 py-2 bg-[#132238] text-white rounded hover:bg-slate-500 text-sm sm:text-base"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
