import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState, useMemo } from "react";
import { AuthContext } from "../../helper/authUtils";
import { getCoursesWithProgress } from "../../helper/supabaseMateri";
import { useSearch } from "../../helper/useSearch.js";

const pastelColors = [
  "#A2D1B0",
  "#77B1E3",
  "#F1AD8D",
  "#A9A6E5",
  "#613A3A",
  "#E37777",
];

const iconMap = {
  Percabangan: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M469.334 426.666V85.333H42.667v341.333zm-42.667-42.667H85.334V128h341.333zM256 277.333h21.334v-85.334H256zm0 21.333h85.334v-21.333H256zm-64-85.333h64v-21.334h-64zm0 42.666V149.333h-85.333v106.666zm0 106.667v-21.333h149.334v21.333h64V255.999h-64v64H192v-21.333h-85.333v64z"
      />
    </svg>
  ),
  Perulangan: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M12 4V2.21c0-.45-.54-.67-.85-.35l-2.8 2.79c-.2.2-.2.51 0 .71l2.79 2.79c.32.31.86.09.86-.36V6c3.31 0 6 2.69 6 6c0 .79-.15 1.56-.44 2.25c-.15.36-.04.77.23 1.04c.51.51 1.37.33 1.64-.34c.37-.91.57-1.91.57-2.95c0-4.42-3.58-8-8-8m0 14c-3.31 0-6-2.69-6-6c0-.79.15-1.56.44-2.25c.15-.36.04-.77-.23-1.04c-.51-.51-1.37-.33-1.64.34C4.2 9.96 4 10.96 4 12c0 4.42 3.58 8 8 8v1.79c0 .45.54.67.85.35l2.79-2.79c.2-.2.2-.51 0-.71l-2.79-2.79a.5.5 0 0 0-.85.36z"
      />
    </svg>
  ),
  Perbandingan: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 448 512"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M426.1 94.4c16.8-5.6 25.8-23.7 20.2-40.5s-23.7-25.8-40.5-20.2l-384 128C8.8 166 0 178.2 0 192s8.8 26 21.9 30.4l384 128c16.8 5.6 34.9-3.5 40.5-20.2s-3.5-34.9-20.2-40.5l-293-97.7zM32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32z"
      />
    </svg>
  ),
  Aritmatika: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M170.667 64H128v64H64v42.667h64v64h42.667v-64h64V128h-64zm23.922 234.667l30.17 30.17-45.256 45.256 45.254 45.254-30.17 30.17-45.254-45.255-45.254 45.255-30.17-30.17 45.255-45.254-45.256-45.257 30.17-30.17 45.255 45.255zM277.333 128H448v42.667H277.333zm85.334 192c11.782 0 21.333-9.55 21.333-21.333s-9.55-21.334-21.333-21.334-21.334 9.551-21.334 21.334S350.884 320 362.667 320M448 384v-42.667H277.333V384zm-64 42.667c0 11.782-9.55 21.333-21.333 21.333s-21.334-9.55-21.334-21.333 9.551-21.334 21.334-21.334S384 414.884 384 426.667"
      />
    </svg>
  ),
  "Gerbang Logika": (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        fillRule="evenodd"
        d="M22 12h-4M2 9h5m-5 6h5M6 5c10.667 2.1 10.667 12.6 0 14q2.709-7 0-14"
      />
      <path fillRule="evenodd" d="M14 12a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
    </svg>
  ),
  Algoritma: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.5 2v2m3-2v2M8 6.5H6m2 3H6m12-3h-2m2 3h-2M13.333 4h-2.666C9.41 4 8.78 4 8.39 4.39C8 4.782 8 5.41 8 6.668v2.666c0 1.257 0 1.886.39 2.277c.391.39 1.02.39 2.277.39h2.666c1.257 0 1.886 0 2.277-.39c.39-.391.39-1.02.39-2.277V6.667c0-1.257 0-1.886-.39-2.276C15.219 4 14.59 4 13.333 4" />
      <path d="M3.617 21.924c.184.076.417.076.883.076s.699 0 .883-.076a1 1 0 0 0 .54-.541C6 21.199 6 20.966 6 20.5s0-.699-.076-.883a1 1 0 0 0-.541-.54C5.199 19 4.966 19 4.5 19s-.699 0-.883.076a1 1 0 0 0-.54.541C3 19.801 3 20.034 3 20.5s0 .699.076.883a1 1 0 0 0 .541.54Zm7.5 0c.184.076.417.076.883.076s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883s0-.699-.076-.883a1 1 0 0 0-.541-.54C12.699 19 12.466 19 12 19s-.699 0-.883.076a1 1 0 0 0-.54.541c-.077.184-.077.417-.077.883s0 .699.076.883a1 1 0 0 0 .541.54Z" />
      <path d="M12 19v-7m-7.5 7c0-1.404 0-2.107.337-2.611a2 2 0 0 1 .552-.552C5.893 15.5 6.596 15.5 8 15.5h8c1.404 0 2.107 0 2.611.337c.218.146.406.334.552.552c.337.504.337 1.207.337 2.611" />
      <path d="M18.617 21.924c.184.076.417.076.883.076s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883s0-.699-.076-.883a1 1 0 0 0-.541-.54C20.199 19 19.966 19 19.5 19s-.699 0-.883.076a1 1 0 0 0-.54.541c-.077.184-.077.417-.077.883s0 .699.076.883a1 1 0 0 0 .541.54Z" />
    </svg>
  ),
  Array: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16 20q-.425 0-.712-.288T15 19t.288-.712T16 18h2V6h-2q-.425 0-.712-.288T15 5t.288-.713T16 4h2q.825 0 1.413.588T20 6v12q0 .825-.587 1.413T18 20zM6 20q-.825 0-1.412-.587T4 18V6q0-.825.588-1.412T6 4h2q.425 0 .713.288T9 5t-.288.713T8 6H6v12h2q.425 0 .713.288T9 19t-.288.713T8 20z"
      />
    </svg>
  ),
  "Tipe Data": (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6a8 3 0 1 0 16 0A8 3 0 1 0 4 6" />
      <path d="M4 6v6a8 3 0 0 0 16 0V6" />
      <path d="M4 12v6a8 3 0 0 0 16 0v-6" />
    </svg>
  ),
  Function: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clipPath="url(#clipFn)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M4.312 4.29a.764.764 0 0 1 1.103-.62a.75.75 0 1 0 .67-1.34a2.264 2.264 0 0 0-3.268 1.836L2.706 5.5H1.75a.75.75 0 0 0 0 1.5h.83l-.392 4.71a.764.764 0 0 1-1.103.62a.75.75 0 0 0-.67 1.34a2.264 2.264 0 0 0 3.268-1.836L4.086 7H5.25a.75.75 0 1 0 0-1.5H4.21zm6.014 2.23a.75.75 0 0 0-1.152.96l.85 1.02l-.85 1.02a.75.75 0 0 0 1.152.96L11 9.672l.674.808a.75.75 0 0 0 1.152-.96l-.85-1.02l.85-1.02a.75.75 0 0 0-1.152-.96L11 7.328zM8.02 4.55a.75.75 0 0 1 .43.969l-.145.378a7.25 7.25 0 0 0 0 5.205l.145.378a.75.75 0 0 1-1.4.539l-.145-.378a8.75 8.75 0 0 1 0-6.282l.145-.378a.75.75 0 0 1 .97-.431m5.961 0a.75.75 0 0 1 .97.43l.145.379a8.75 8.75 0 0 1 0 6.282l-.146.378a.75.75 0 1 1-1.4-.538l.146-.379a7.25 7.25 0 0 0 0-5.205l-.146-.378a.75.75 0 0 1 .431-.97"
        />
      </g>
      <defs>
        <clipPath id="clipFn">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  ),
  OOP: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        d="M14 2h-4c-3.28 0-4.919 0-6.081.814a4.5 4.5 0 0 0-1.105 1.105C2 5.08 2 6.72 2 10s0 4.919.814 6.081a4.5 4.5 0 0 0 1.105 1.105C5.08 18 6.72 18 10 18h4c3.28 0 4.919 0 6.081-.814a4.5 4.5 0 0 0 1.105-1.105C22 14.92 22 13.28 22 10s0-4.919-.814-6.081a4.5 4.5 0 0 0-1.105-1.105C18.92 2 17.28 2 14 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16 8l1.227 1.057c.515.445.773.667.773.943s-.258.498-.773.943L16 12M8 8L6.773 9.057C6.258 9.502 6 9.724 6 10s.258.498.773.943L8 12m5-5l-2 6"
      />
      <path d="m14.656 22l-.42-.419a3.1 3.1 0 0 1-.58-3.581M9 22l.42-.419A3.1 3.1 0 0 0 10 18m-3 4h10" />
    </svg>
  ),
  Class: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 9.2h11.1m0 12.955V5.5H5.5v16.645zM5.5 15.678h11.1m-5.545 13.867h11.1m0 12.955V25.845h-11.1l-.01 16.655zm-11.1-6.478h11.1m8.323-16.644H42.5m0 12.944V15.678H30.478v16.644zm-12.022-6.477H42.5m-25.9-6.928q6.478.771 13.878 3.7m-8.323 10.167q3.7-2.617 8.323-3.7" />
    </svg>
  ),
  Variable: (
    <svg
      className="w-24 h-24 mb-2 text-white mx-auto"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5h2V4H1.5l-.5.5v8l.5.5H4v-1H2V5zm12.5-1H12v1h2v7h-2v1h2.5l.5-.5v-8l-.5-.5zm-2.74 2.57L12 7v2.51l-.3.45-4.5 2h-.46l-2.5-1.5-.24-.43v-2.5l.3-.46 4.5-2h.46l2.5 1.5zM5 9.71l1.5.9V9.28L5 8.38v1.33zm.58-2.15l1.45.87 3.39-1.5-1.45-.87-3.39 1.5zm1.95 3.17l3.5-1.56v-1.4l-3.5 1.55v1.41z"
      />
    </svg>
  ),
};

export default function Course() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const { searchTerm } = useSearch();

  useEffect(() => {
    if (user) {
      getCoursesWithProgress(user.id).then(setCourses);
    }
  }, [user]);

  // Filter courses based on search term
  const filteredCourses = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      return courses;
    }

    return courses.filter((course) =>
      course.nama_materi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [courses, searchTerm]);

  const handleClick = (slug) => {
    navigate(`/materi/${slug}`);
  };

  return (
    <div>
      <div className="flex items-center justify-start mb-4 sm:mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          Jelajahi Materi
        </h1>
        <img
          src="/Icon Kobi (maskot LogicBase)/kobiMelambai.png"
          alt="Kobi"
          className="w-8 sm:w-10 ml-1"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, idx) => {
            const progress = course.progress || 0;
            const statusText =
              progress === 100 ? "Selesai" : `${progress}% Selesai`;

            return (
              <div
                key={course.id}
                onClick={() => handleClick(course.slug)}
                className="relative p-4 sm:p-6 rounded-lg shadow-md cursor-pointer w-full max-w-full sm:max-w-52 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:rotate-1 min-h-[180px] sm:min-h-[200px] flex flex-col justify-between"
                style={{
                  backgroundColor: pastelColors[idx % pastelColors.length],
                }}
              >
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="mb-2">
                    {iconMap[course.nama_materi] && iconMap[course.nama_materi]}
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold mb-2 text-white px-2 leading-tight">
                    {course.nama_materi}
                  </h2>
                </div>

                <div className="mt-auto">
                  <p className="text-sm text-white mb-2">{statusText}</p>
                  <div className="w-full bg-white/30 h-2 rounded">
                    <div
                      className="bg-white h-2 rounded transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        ) : searchTerm && searchTerm.trim() !== "" ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-base sm:text-lg px-4">
              Tidak ada materi yang ditemukan untuk "{searchTerm}"
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
