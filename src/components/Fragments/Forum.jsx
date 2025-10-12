import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../helper/authUtils";
import { useToast } from "../../hooks/useToast.jsx";
import { getForumThreads, createThread } from "../../helper/supabaseForum";

export default function Forum() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [sortBy, setSortBy] = useState("newest");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [discussionThreads, setDiscussionThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadForumThreads(currentPage);
    }, 1000); // 1000ms debounce

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [sortBy, currentPage, searchTerm]);

  const loadForumThreads = async (page) => {
    try {
      setLoading(true);
      setError(null);

      const { threads, totalCount } = await getForumThreads({
        page: page,
        pageSize: pageSize,
        sortBy: sortBy,
        searchTerm: searchTerm,
      });

      if (threads) {
        setDiscussionThreads(threads);
        setTotalPages(Math.ceil(totalCount / pageSize));
      } else {
        setDiscussionThreads([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Error loading forum threads:", err);
      setError("Gagal memuat thread forum. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} menit yang lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else if (diffDays < 7) {
      return `${diffDays} hari yang lalu`;
    } else {
      return postDate.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const getThreadColor = (threadId) => {
    const colorMap = {
      1: "bg-[#F1AD8D]",
      2: "bg-[#A9A6E5]",
      0: "bg-[#A2D1B0]",
    };
    return colorMap[threadId % 3];
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toastError(
        "Format file tidak didukung. Gunakan JPG, JPEG, PNG, atau GIF."
      );
      return;
    }

    // Validasi ukuran file (maks 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toastError("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    setFormData({ ...formData, image: file });
  };

  if (error) {
    return (
      <div className="min-h-screen p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl text-red-600">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-[#333] mb-2">
              Terjadi Kesalahan
            </h2>
            <p className="text-[#666] mb-6">{error}</p>
            <button
              onClick={loadForumThreads}
              className="px-6 py-2 bg-[#77B1E3] text-white rounded-md hover:bg-[#5A9BD3] transition-colors focus:outline-none"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Main Layout */}
      <div className="max-w-7xl mx-auto">
        {/* Unified Header Card with Create Button */}
        <div className="bg-[#A9A6E5] rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1 w-full lg:w-auto">
              <div className="flex items-center mb-3 sm:mb-4">
                <img
                  src="/Icon Kobi (maskot LogicBase)/kobiBingung.png"
                  alt="Kobi"
                  className="w-8 sm:w-10 mr-2 flex-shrink-0"
                />
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#333]">
                  Forum Diskusi
                </h1>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-xs sm:text-sm text-[#333] font-medium">
                  Urutkan berdasarkan:
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 pr-8 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-purple-700 bg-purple-700 text-white appearance-none cursor-pointer hover:bg-purple-800 transition-all duration-200"
                  >
                    <option value="newest">Terbaru</option>
                    <option value="popular">Paling Populer</option>
                    <option value="trending">Trending</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Cari thread..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-48 lg:w-60 px-3 py-2 border border-[#77B1E3] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#77B1E3] bg-white text-[#333] pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-purple-700"></div>
                  ) : (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <button
                className="w-full sm:w-auto bg-purple-700 text-white py-2.5 sm:py-2 lg:py-3 px-4 rounded-lg font-semibold hover:bg-purple-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base border-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 whitespace-nowrap min-h-[44px]"
                onClick={() => setShowCreateModal(true)}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>📝</span>
                  <span className="hidden sm:inline">Buat Thread Baru</span>
                  <span className="sm:hidden">Buat Thread</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Full Width */}
        <main className="space-y-3 sm:space-y-4">
          {/* Discussion Threads */}
          <div className="space-y-3 sm:space-y-4">
            {discussionThreads.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base px-4">
                  {searchTerm
                    ? `Tidak ada thread yang ditemukan untuk "${searchTerm}"`
                    : "Belum ada thread diskusi. Jadilah yang pertama membuat thread!"}
                </p>
              </div>
            ) : (
              discussionThreads.map((thread) => (
                <article
                  key={thread.id}
                  className={`rounded-xl shadow-lg p-4 sm:p-5 lg:p-6 cursor-pointer transition-all duration-300
                    transform hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 ${
                      thread.id % 3 === 1
                        ? "bg-[#F1AD8D] hover:bg-[#F19D7D]"
                        : thread.id % 3 === 2
                        ? "bg-[#A9A6E5] hover:bg-[#9996D5]"
                        : "bg-[#A2D1B0] hover:bg-[#92C1A0]"
                    }`}
                  onClick={() =>
                    navigate(`/threads/${thread.id}`, {
                      state: { color: getThreadColor(thread.id) },
                    })
                  }
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Author Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#77B1E3] rounded-full flex items-center justify-center text-white text-base sm:text-lg lg:text-xl">
                        {thread.author_avatar || "👤"}
                      </div>
                    </div>

                    {/* Thread Content */}
                    <div className="flex-1 min-w-0">
                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-[#333] mb-2">
                        <span className="font-medium text-[#333] truncate max-w-[120px] sm:max-w-none">
                          {thread.author_name}
                        </span>
                        <span className="hidden xs:inline">•</span>
                        <span className="text-xs">
                          {formatTimestamp(thread.created_at)}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-[#333] line-clamp-2 leading-tight">
                          {thread.title}
                        </h3>
                      </div>

                      <p className="text-[#333] mb-3 sm:mb-4 line-clamp-2 text-xs sm:text-sm lg:text-base leading-relaxed">
                        {thread.preview ||
                          thread.content?.substring(0, 200) + "..."}
                      </p>

                      {/* Thread Statistics */}
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#333]">
                        <span className="flex items-center gap-1">
                          💬 <span className="hidden xs:inline">Balasan:</span>{" "}
                          {thread.reply_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          👁️ <span className="hidden sm:inline">Dilihat:</span>{" "}
                          {thread.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          ❤️ <span className="hidden sm:inline">Suka:</span>{" "}
                          {thread.like_count || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-[#A9A6E5] rounded-xl shadow-lg p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex justify-center items-center gap-1 sm:gap-2 flex-wrap">
                  {[...Array(Math.min(5, totalPages)).keys()].map((number) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = number + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = number + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + number;
                    } else {
                      pageNumber = currentPage - 2 + number;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm border-none hover:text-white text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 min-w-[36px] min-h-[36px] ${
                          currentPage === pageNumber
                            ? "bg-purple-700"
                            : "bg-purple-800 hover:bg-purple-700"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="text-[#333] px-2">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm border-none text-white bg-purple-800 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 min-w-[36px] min-h-[36px]"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                <span className="text-xs sm:text-sm text-[#333] whitespace-nowrap">
                  Halaman {currentPage} dari {totalPages}
                </span>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#77B1E3] to-[#5A9BD3] text-white p-4 sm:p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-base sm:text-lg">📝</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold tracking-tight truncate">
                    Buat Thread Baru
                  </h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200 text-white hover:scale-110 focus:outline-none flex-shrink-0 ml-2"
                >
                  <span className="text-xl font-semibold">×</span>
                </button>
              </div>
              <p className="text-white/90 text-xs sm:text-sm mt-2">
                Bagikan pemikiran dan ide Anda dengan komunitas
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#77B1E3] rounded-full flex items-center justify-center text-white text-xs">
                        1
                      </span>
                      Judul Thread *
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#77B1E3] focus:border-transparent transition-all duration-200 placeholder:text-gray-400 text-sm sm:text-base"
                    placeholder="Masukkan judul thread yang menarik..."
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Buat judul yang jelas dan deskriptif
                  </p>
                </div>

                {/* Content Textarea */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-[#77B1E3] rounded-full flex items-center justify-center text-white text-xs">
                        2
                      </span>
                      Konten *
                    </span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    rows={5}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#77B1E3] focus:border-transparent transition-all duration-200 placeholder:text-gray-400 resize-vertical text-sm sm:text-base"
                    placeholder="Tulis konten thread Anda di sini dengan jelas dan detail..."
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Bagikan pemikiran dan ide Anda dengan jelas
                  </p>
                </div>

                {/* Image Upload (Optional) */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs">
                        3
                      </span>
                      Upload Gambar (Opsional)
                    </span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 sm:p-6 text-center transition-all duration-200 hover:border-[#77B1E3] hover:bg-gray-50">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="thread-image-upload"
                    />
                    <label
                      htmlFor="thread-image-upload"
                      className="cursor-pointer block"
                    >
                      {formData.image ? (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="relative mx-auto max-w-sm">
                            <img
                              src={URL.createObjectURL(formData.image)}
                              alt="Preview"
                              className="mx-auto h-32 sm:h-40 object-contain rounded-lg shadow-md w-full"
                            />
                            <div className="absolute -top-2 -right-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  setFormData({ ...formData, image: null });
                                  const fileInput = document.getElementById(
                                    "thread-image-upload"
                                  );
                                  if (fileInput) fileInput.value = "";
                                }}
                                className="w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg focus:outline-none"
                              >
                                <span className="text-sm">×</span>
                              </button>
                            </div>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm text-green-700 font-medium truncate">
                              ✅ {formData.image.name}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              File berhasil diupload
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 sm:space-y-4">
                          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-[#77B1E3]/10 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 sm:w-8 sm:h-8 text-[#77B1E3]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Seret dan lepas file di sini
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              atau klik untuk memilih file
                            </p>
                            <div className="bg-gray-100 rounded-lg p-2">
                              <p className="text-xs text-gray-500">
                                📷 Format: JPG, JPEG, PNG, GIF
                              </p>
                              <p className="text-xs text-gray-500">
                                📏 Maksimal: 5MB
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 font-medium hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 min-h-[44px]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#77B1E3] to-[#5A9BD3] text-white rounded-xl hover:from-[#6AA2D6] hover:to-[#4A8BC6] transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-[#77B1E3] focus:ring-offset-2 min-h-[44px]"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span className="text-sm sm:text-base">
                          Sedang Membuat...
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>📝</span>
                        <span className="text-sm sm:text-base">
                          Buat Thread
                        </span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      toastError("Anda harus login untuk membuat thread");
      return;
    }

    setSubmitting(true);

    try {
      const userName =
        user.user_metadata?.name || user.email?.split("@")[0] || "Anonymous";
      const userAvatar = user.user_metadata?.avatar || "👤";

      await createThread({
        title: formData.title,
        content: formData.content,
        authorName: userName,
        authorAvatar: userAvatar,
        image: formData.image,
      });

      success("Thread berhasil dibuat!");
      setShowCreateModal(false);
      setFormData({ title: "", content: "", image: null });
      loadForumThreads(); // Reload threads
    } catch (error) {
      console.error("Error creating thread:", error);
      toastError("Gagal membuat thread");
    } finally {
      setSubmitting(false);
    }
  }
}
