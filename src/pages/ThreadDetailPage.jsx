import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  getThreadById,
  getThreadComments,
  addComment,
  incrementViewCount,
  toggleThreadLike,
  getUserLikedThreads,
} from "../helper/supabaseForum";
import { useAuth } from "../helper/authUtils";
import { useToast } from "../hooks/useToast.jsx";
import Dashboard from "../components/Layout/Dashboard";

export default function ThreadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const location = useLocation();
  const { color } = location.state || {};

  const getButtonColor = (backgroundColor) => {
    const colorMap = {
      "bg-[#F1AD8D]": "bg-orange-800",
      "bg-[#A9A6E5]": "bg-purple-800",
      "bg-[#A2D1B0]": "bg-green-800",
    };
    return colorMap[backgroundColor] || "bg-[#77B1E3]"; // fallback color
  };

  const buttonColor = getButtonColor(color);

  const [thread, setThread] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [likedThreads, setLikedThreads] = useState({});
  const [likingThreads, setLikingThreads] = useState({});

  useEffect(() => {
    loadThreadData();
    loadUserLikes();
  }, [id]);

  const loadThreadData = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      // Load thread data
      const threadData = await getThreadById(id);

      if (!threadData) {
        setLoadError("Thread tidak ditemukan");
        toastError("Thread tidak ditemukan");
        return;
      }
      setThread(threadData);

      // Increment view count (silent operation, don't block UI)
      incrementViewCount(id).catch((err) => {
        console.warn("Failed to increment view count:", err);
      });

      // Load comments
      const commentsData = await getThreadComments(id);
      setComments(commentsData);
    } catch (err) {
      console.error("Error loading thread:", err);
      setLoadError("Gagal memuat thread. Silakan coba lagi.");
      toastError("Gagal memuat thread");
    } finally {
      setLoading(false);
    }
  };

  // Load user's liked threads status
  const loadUserLikes = async () => {
    if (!user) return;

    try {
      const likedThreadIds = await getUserLikedThreads(user.id);

      const likedMap = {};
      likedThreadIds.forEach((threadId) => {
        likedMap[threadId] = true;
      });

      setLikedThreads(likedMap);
    } catch (err) {
      console.error("Error loading user likes:", err);
    }
  };

  // Handle like/unlike action
  const handleLike = async (e) => {
    e.preventDefault();

    if (!user) {
      toastError("Anda harus login untuk memberikan like");
      return;
    }

    // Set loading state for this specific thread
    setLikingThreads((prev) => ({ ...prev, [thread.id]: true }));

    try {
      const result = await toggleThreadLike(thread.id, user.id);

      // Update liked status
      setLikedThreads((prev) => ({
        ...prev,
        [thread.id]: result.action === "added",
      }));

      // Update like count in the thread data
      setThread((prev) => ({
        ...prev,
        like_count: result.newCount,
      }));

      if (result.action === "added") {
        success("Thread disukai!");
      } else {
        success("Like dihapus");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      toastError("Gagal memberikan like");
    } finally {
      // Clear loading state
      setLikingThreads((prev) => ({ ...prev, [thread.id]: false }));
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!user) {
      toastError("Anda harus login untuk berkomentar");
      return;
    }

    if (!commentContent.trim()) {
      toastError("Komentar tidak boleh kosong");
      return;
    }

    setSubmittingComment(true);

    try {
      const userName =
        user.user_metadata?.name || user.email?.split("@")[0] || "Anonymous";
      const userAvatar = user.user_metadata?.avatar || "👤";

      const newComment = await addComment(id, {
        content: commentContent.trim(),
        authorName: userName,
        authorAvatar: userAvatar,
      });

      setComments((prev) => [...prev, newComment]);
      setCommentContent("");
      success("Komentar berhasil ditambahkan!");
    } catch (err) {
      console.error("Error adding comment:", err);
      toastError("Gagal menambahkan komentar");
    } finally {
      setSubmittingComment(false);
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

  if (loading) {
    return (
      <Dashboard>
        <div className="min-h-screen p-4 lg:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#77B1E3]"></div>
              <p className="mt-4 text-[#666]">Memuat thread...</p>
            </div>
          </div>
        </div>
      </Dashboard>
    );
  }

  if (loadError || !thread) {
    return (
      <Dashboard>
        <div className="min-h-screen p-4 lg:p-6">
          <div className="max-w-5xl mx-auto text-center py-12">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl text-red-600">⚠️</span>
              </div>
              <h2 className="text-xl font-semibold text-[#333] mb-2">
                Terjadi Kesalahan
              </h2>
              <p className="text-[#666] mb-6">
                {loadError || "Thread tidak ditemukan"}
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/forum")}
                className="w-full sm:w-auto px-6 py-2 bg-[#77B1E3] text-white rounded-md hover:bg-[#5A9BD3] transition-colors"
              >
                Kembali ke Forum
              </button>

              <button
                onClick={loadThreadData}
                className="w-full sm:w-auto px-6 py-2 border border-[#77B1E3] text-[#77B1E3] rounded-md hover:bg-[#77B1E3] hover:text-white transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </Dashboard>
    );
  }

  return (
    <Dashboard>
      <div className="min-h-screen p-3 sm:p-4 lg:p-6">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/forum")}
            className={`mb-4 sm:mb-6 flex items-center text-xs sm:text-sm font-bold text-white ${buttonColor} hover:opacity-90 transition-colors px-3 sm:px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50`}
          >
            ← Kembali ke Forum
          </button>

          {/* Thread Content */}
          <div
            className={`${
              color || "bg-white"
            } rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6`}
          >
            {/* Thread Header */}
            <div className="mb-4 sm:mb-6">
              {/* Meta Information di paling atas */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#77B1E3] rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                    {thread.author_avatar || "👤"}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#333]">
                  <span className="font-medium text-[#333] truncate max-w-[120px] sm:max-w-none">
                    {thread.author_name}
                  </span>
                  <span className="hidden xs:inline">•</span>
                  <span className="text-xs">
                    {formatTimestamp(thread.created_at)}
                  </span>
                </div>
              </div>

              {/* Judul Thread */}
              <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-[#333] mb-3 sm:mb-4 leading-tight">
                {thread.title}
              </h1>

              {/* Thread Stats */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm text-[#666]">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  💬 <span className="hidden sm:inline">Komentar:</span>{" "}
                  {thread.reply_count || 0}
                </span>
                <span className="flex items-center gap-1 whitespace-nowrap">
                  👁️ <span className="hidden lg:inline">Dilihat:</span>{" "}
                  {thread.view_count || 0}
                </span>
                <div
                  onClick={handleLike}
                  disabled={likingThreads[thread.id]}
                  className={`flex items-center gap-1 transition-all cursor-pointer duration-200 px-2 sm:px-3 py-1 rounded-md min-h-[32px] ${
                    likedThreads[thread.id]
                      ? "text-red-500 hover:text-red-600"
                      : "text-[#333] hover:text-red-500"
                  } disabled:opacity-50 disabled:cursor-not-allowed ${
                    color || "bg-white"
                  } border-none focus:outline-none whitespace-nowrap`}
                >
                  {likingThreads[thread.id] ? (
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  ) : likedThreads[thread.id] ? (
                    "❤️"
                  ) : (
                    "🤍"
                  )}
                  <span>{thread.like_count || 0}</span>
                </div>
              </div>
            </div>

            <hr className="my-3 sm:my-4 border-gray-500 border-2 rounded-md" />

            {/* Thread Body */}
            <div className="prose max-w-none mb-4 sm:mb-6">
              <div className="text-[#333] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                {thread.content}
              </div>
            </div>

            {/* Thread Image */}
            {thread.image_url && (
              <div className="mb-4 sm:mb-6">
                <img
                  src={thread.image_url}
                  alt="Gambar thread"
                  className="max-w-full h-auto rounded-lg shadow-md"
                  style={{ maxHeight: "400px" }}
                />
              </div>
            )}

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                {thread.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 sm:px-3 py-1 bg-[#77B1E3] text-white text-xs sm:text-sm rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div
            className={`${
              color || "bg-white"
            } rounded-xl shadow-lg p-4 sm:p-6 lg:p-8`}
          >
            <h2 className="text-lg sm:text-xl font-bold text-[#333] mb-4 sm:mb-6">
              Komentar ({comments.length})
            </h2>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-6 sm:mb-8">
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#77B1E3] rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                      {user.user_metadata?.avatar ||
                        user.email?.charAt(0).toUpperCase() ||
                        "👤"}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <textarea
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      placeholder="Tulis komentar Anda..."
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#77B1E3] resize-none text-sm sm:text-base"
                      disabled={submittingComment}
                    />

                    <div className="flex justify-end mt-2 sm:mt-3">
                      <button
                        type="submit"
                        disabled={submittingComment || !commentContent.trim()}
                        className={`px-4 sm:px-6 py-2 ${buttonColor} text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-sm sm:text-base min-h-[40px]`}
                      >
                        {submittingComment ? "Mengirim..." : "Kirim Komentar"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="text-center py-3 sm:py-4 mb-4 sm:mb-6 bg-gray-50 rounded-lg">
                <p className="text-[#666] text-sm sm:text-base">
                  <a href="/login" className="text-[#77B1E3] hover:underline">
                    Login
                  </a>{" "}
                  untuk meninggalkan komentar
                </p>
              </div>
            )}

            {/* Comments List */}
            {comments.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-[#666]">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <p className="text-sm sm:text-base">
                  Belum ada komentar. Jadilah yang pertama berkomentar!
                </p>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 sm:gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#A9A6E5] rounded-full flex items-center justify-center text-white text-sm sm:text-base">
                        {comment.author_avatar || "👤"}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                          <span className="font-medium text-[#333] text-sm sm:text-base truncate">
                            {comment.author_name}
                          </span>
                          <span className="text-xs text-[#666]">
                            {formatTimestamp(comment.created_at)}
                          </span>
                        </div>

                        <p className="text-[#333] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Graceful degradation - show cached content even if comments fail */}
            {thread && comments.length === 0 && (
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-yellow-800 text-xs sm:text-sm">
                  Komentar tidak dapat dimuat, tetapi Anda masih dapat membaca
                  thread ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
