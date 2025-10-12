import { useContext, useState, useEffect } from "react";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { AuthContext } from "../../helper/authUtils";
import { getCoursesWithProgress } from "../../helper/supabaseMateri";
import { useNavigate } from "react-router-dom";

// Re-usable components defined within the file

const pastelColors = [
  "#A2D1B0",
  "#77B1E3",
  "#F1AD8D",
  "#A9A6E5",
  "#A2CFD1",
  "#E37777",
];

const ProgressBar = ({ progress }) => (
  <div className="w-full bg-black/10 rounded-full h-2.5">
    <div
      className="bg-white/80 h-2.5 rounded-full transition-all duration-500"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const StatusBadge = ({ status }) => {
  const baseStyle = "px-3 py-1 text-xs font-semibold rounded-full";
  let specificStyle = "";
  switch (status) {
    case "Completed":
      specificStyle = "bg-green-800/20 text-green-900";
      break;
    case "In Progress":
      specificStyle = "bg-sky-800/20 text-sky-900";
      break;
    default:
      specificStyle = "bg-slate-800/20 text-slate-900";
  }
  return <span className={`${baseStyle} ${specificStyle}`}>{status}</span>;
};

const SkeletonCard = () => (
  <div className="bg-slate-800/50 rounded-xl p-6 ring-1 ring-slate-700">
    <div className="animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-slate-700 rounded w-3/4"></div>
        <div className="h-5 bg-slate-700 rounded-full w-16"></div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-2.5 bg-slate-700 rounded-full w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-8"></div>
      </div>
      <div className="mt-6 border-t border-slate-700 pt-4">
        <div className="h-6 w-1/2 mx-auto bg-slate-700 rounded"></div>
      </div>
    </div>
  </div>
);

// Main Riwayat Component

export default function Riwayat() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      async function loadCourses() {
        // Set loading to true only if there are no courses yet
        if (courses.length === 0) {
          setLoading(true);
        }
        const coursesData = await getCoursesWithProgress(user.id);
        const finishedOnly = coursesData.filter((c) => c.progress === 100);
        setCourses(finishedOnly);
        setLoading(false);
      }
      loadCourses();
    }
  }, [user]);

  const handleCourseClick = (slug) => {
    navigate(`/materi/${slug}`);
  };

  return (
    <div>
      <div className="flex items-center justify-start mb-4 sm:mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          Riwayat Aktivitas
        </h1>
        <img
          src="/Icon Kobi (maskot LogicBase)/kobiMelambai.png"
          alt="Kobi"
          className="w-8 sm:w-10 ml-1 flex-shrink-0"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div
          style={{ backgroundColor: pastelColors[2] }}
          className="text-center py-12 sm:py-16 rounded-xl px-4"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-black/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">📚</span>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-black mb-2">
            Belum ada materi yang selesai
          </h3>
          <p className="text-slate-800 text-sm sm:text-base">
            Mulai kursus untuk melihat riwayat Anda di sini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {courses.map((course, index) => (
            <div
              key={course.id}
              style={{
                backgroundColor: pastelColors[index % pastelColors.length],
              }}
              className="rounded-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl cursor-pointer min-h-[240px] sm:min-h-[260px]"
              onClick={() => handleCourseClick(course.slug)}
            >
              <div className="p-4 sm:p-6 flex-1">
                <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight flex-1 min-w-0">
                    {course.nama_materi}
                  </h2>
                  <div className="flex-shrink-0">
                    <StatusBadge status={course.status} />
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6 line-clamp-3 leading-relaxed">
                  {course.deskripsi || "No description available."}
                </p>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1">
                    <ProgressBar progress={course.progress} />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
                    {course.progress}%
                  </span>
                </div>
              </div>
              <div
                style={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                className="px-4 sm:px-6 py-3 sm:py-4 rounded-b-xl"
              >
                <div className="w-full flex justify-center items-center gap-2 text-xs sm:text-sm font-semibold text-white">
                  <span className="text-center">
                    {course.status === "Completed"
                      ? "Review Materi"
                      : "Lanjutkan Belajar"}
                  </span>
                  <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
