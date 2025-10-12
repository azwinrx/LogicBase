"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  Bars3Icon, // Icon hamburger menu untuk mobile navigation
  XMarkIcon, // Icon X untuk close mobile menu
  CodeBracketIcon, // Icon bracket code untuk logo dan representasi coding
  AcademicCapIcon, // Icon topi akademik untuk dashboard belajar/edukasi
  TrophyIcon, // Icon trophy untuk misi/achievement/quiz interaktif
  UserGroupIcon, // Icon grup user untuk tim bantuan/komunitas
  BookOpenIcon, // Icon buku terbuka untuk materi pembelajaran
  StarIcon, // Icon bintang untuk impian/visi dan tracking pemahaman
  HeartIcon, // Icon hati untuk impian/visi yang penuh kasih
  RocketLaunchIcon, // Icon roket untuk misi/tujuan yang ambisius
} from "@heroicons/react/24/outline";
import "../../App.css";

const navigation = [
  { name: "Tentang", href: "#about" },
  { name: "Fitur", href: "#features" },
  { name: "Statistik", href: "#stats" },
  { name: "Kontak", href: "#contact" },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pastelColors = [
    "#A2D1B0", // Soft green - sama dengan halaman materi
    "#77B1E3", // Light blue - sama dengan halaman materi
    "#F1AD8D", // Peach orange - sama dengan halaman materi
    "#A9A6E5", // Lavender purple - sama dengan halaman materi
    "#A2CFD1", // Mint blue - soft dan ramah anak
    "#E37777", // Coral pink - sama dengan halaman materi
  ];

  return (
    <div
      className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
      style={{
        backgroundColor: "#FFF8E1", // Light cream yellow - netral dan kontras dengan semua elemen colorful
      }}
    >
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-4 sm:p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-2">
              <span className="sr-only">LogicBase</span>
              <img
                src="/Icon Kobi (maskot LogicBase)/kobiMelambai.png"
                alt="LogicBase Logo"
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain align-middle"
              />
              <span className="text-2xl sm:text-3xl font-bold text-slate-800">
                LogicBase
              </span>
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-800 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm/6 font-semibold text-slate-700 hover:text-purple-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center space-x-4">
            <a
              href="/signup"
              className="text-sm font-semibold text-purple-600 hover:text-purple-500"
            >
              Daftar
            </a>
            <a
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all duration-300"
              style={{ backgroundColor: pastelColors[5] }}
            >
              Masuk
            </a>
          </div>
        </nav>
        <Dialog
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
          className="lg:hidden"
        >
          <div className="fixed inset-0 z-50" />
          <DialogPanel
            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
            style={{ backgroundColor: pastelColors[0] }}
          >
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5 flex items-center space-x-2">
                <span className="sr-only">LogicBase</span>
                <img
                  src="/Icon Kobi (maskot LogicBase)/KobiMengajak.svg"
                  alt="LogicBase Logo"
                  className="h-8 w-auto object-contain align-middle"
                />
                <span className="text-lg font-bold text-slate-800">
                  LogicBase
                </span>
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200 focus:outline-none"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6 space-y-2">
                  <a
                    href="/signup"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                  >
                    Sign up
                  </a>
                  <a
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 focus:outline-none"
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>

      <div className="relative isolate px-4 sm:px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 to-indigo-500 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        {/* Hero Section */}
        <div className="mx-auto max-w-4xl py-12 sm:py-16 md:py-24 lg:py-32">
          <div className="hidden sm:mb-6 sm:flex sm:justify-center">
            <div
              className="relative rounded-full px-4 py-2 text-sm leading-6 text-slate-800 ring-1 ring-purple-400/30 hover:ring-purple-400/50 transition-all duration-300"
              style={{ backgroundColor: `${pastelColors[3]}77` }}
            >
              🎉 Tempat Seru Belajar Coding untuk Anak-Anak{" "}
              <a href="#about" className="font-semibold text-purple-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Yuk Lihat! <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-slate-800">
              Hai Selamat Datang di{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                LogicBase
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-6 sm:leading-8 text-slate-700 max-w-3xl mx-auto px-4 sm:px-0">
              Tempat seru untuk belajar logika dasar coding! Kita akan belajar
              cara berpikir komputer melalui materi yang mudah dipahami, lalu
              menguji pemahaman dengan quiz yang menyenangkan. Bergabunglah
              dengan ribuan teman-teman lainnya yang sudah mulai belajar logika
              coding!
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <a
                href="#about"
                className="w-full sm:w-auto rounded-md px-6 py-3 text-sm sm:text-base font-semibold text-slate-800 shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transform hover:scale-105 transition-all duration-200 text-center"
                style={{ backgroundColor: pastelColors[0] }}
              >
                🎯 Ayo Mulai Belajar!
              </a>
              <a
                href="#features"
                className="text-sm sm:text-base font-semibold leading-6 text-slate-800 hover:text-purple-600 transition-colors"
              >
                Lihat Fitur Keren <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div
          id="about"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 scroll-mt-20"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 lg:text-4xl">
              Tentang LogicBase
            </h2>
            <p className="mt-3 text-base sm:text-lg leading-6 sm:leading-8 text-slate-700">
              LogicBase adalah tempat yang super seru untuk anak-anak belajar
              logika dasar coding! Di sini kita akan belajar cara berpikir
              seperti programmer melalui materi yang mudah dipahami, lalu
              menguji pemahaman dengan quiz yang seru!
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-4xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div
                className="rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: pastelColors[1] }}
              >
                <div className="flex items-center justify-center gap-x-3 mb-4">
                  <HeartIcon className="h-8 w-8 flex-none text-slate-800" />
                  <h3 className="text-xl font-semibold text-slate-800">
                    Impian Kami
                  </h3>
                </div>
                <p className="text-slate-700">
                  Kami ingin semua anak-anak di Indonesia bisa belajar logika
                  dasar coding dengan cara yang menyenangkan! LogicBase dibuat
                  supaya kalian bisa memahami cara berpikir programmer dan siap
                  menghadapi masa depan yang penuh teknologi.
                </p>
              </div>

              <div
                className="rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: pastelColors[2] }}
              >
                <div className="flex items-center justify-center gap-x-3 mb-4">
                  <RocketLaunchIcon className="h-8 w-8 flex-none text-slate-800" />
                  <h3 className="text-xl font-semibold text-slate-800">
                    Misi Kami
                  </h3>
                </div>
                <p className="text-slate-700">
                  Mengajarkan logika dasar coding kepada anak-anak dengan cara
                  yang seru dan mudah dipahami! Kita akan belajar melalui materi
                  teks yang menarik, lalu menguji pemahaman dengan quiz
                  interaktif bersama teman-teman.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          id="features"
          className="mx-auto max-w-7xl px-6 lg:px-8 pb-12 sm:pb-16 scroll-mt-20"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Fitur-Fitur Keren LogicBase
            </h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              LogicBase punya sistem belajar yang seru! Kalian akan membaca
              materi tentang logika coding yang mudah dipahami, lalu menguji
              pemahaman dengan quiz yang menyenangkan!
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-2xl sm:mt-12 lg:mt-16 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
              <div
                className="flex flex-col rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: pastelColors[0] }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-800">
                  <BookOpenIcon className="h-8 w-8 flex-none text-slate-800" />
                  Materi Logika Coding
                </dt>
                <dd className="mt-3 flex flex-auto flex-col text-base leading-7 text-slate-700">
                  <p className="flex-auto">
                    Materi pembelajaran logika dasar coding yang disusun dengan
                    bahasa sederhana dan mudah dipahami. Setiap topik dijelaskan
                    step by step dengan contoh yang menarik.
                  </p>
                </dd>
              </div>

              <div
                className="flex flex-col rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: pastelColors[1] }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-800">
                  <TrophyIcon className="h-8 w-8 flex-none text-slate-800" />
                  Quiz Interaktif
                </dt>
                <dd className="mt-3 flex flex-auto flex-col text-base leading-7 text-slate-700">
                  <p className="flex-auto">
                    Setelah membaca materi, kalian akan mengerjakan quiz untuk
                    menguji pemahaman. Quiz dibuat menyenangkan dengan berbagai
                    jenis soal yang menantang!
                  </p>
                </dd>
              </div>

              <div
                className="flex flex-col rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: pastelColors[2] }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-800">
                  <AcademicCapIcon className="h-8 w-8 flex-none text-slate-800" />
                  Dashboard Belajar
                </dt>
                <dd className="mt-3 flex flex-auto flex-col text-base leading-7 text-slate-700">
                  <p className="flex-auto">
                    Tempat keren untuk melihat progres belajar kalian! Di sini
                    kalian bisa lihat materi apa saja yang sudah dipelajari dan
                    skor quiz yang sudah dikerjakan.
                  </p>
                </dd>
              </div>

              <div
                className="flex flex-col rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: pastelColors[3] }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-800">
                  <UserGroupIcon className="h-8 w-8 flex-none text-slate-800" />
                  Tim Bantuan
                </dt>
                <dd className="mt-3 flex flex-auto flex-col text-base leading-7 text-slate-700">
                  <p className="flex-auto">
                    Ada kakak-kakak yang siap membantu kalau kalian kebingungan
                    dengan materi! Kalian juga bisa bertanya ke teman-teman lain
                    yang juga sedang belajar.
                  </p>
                </dd>
              </div>

              <div
                className="flex flex-col rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: pastelColors[4] }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-800">
                  <CodeBracketIcon className="h-8 w-8 flex-none text-slate-800" />
                  Belajar Logika Bertahap
                </dt>
                <dd className="mt-3 flex flex-auto flex-col text-base leading-7 text-slate-700">
                  <p className="flex-auto">
                    Sistem pembelajaran yang tersusun dari dasar sampai mahir.
                    Mulai dari konsep sederhana hingga logika yang lebih
                    kompleks, semua dijelaskan dengan mudah!
                  </p>
                </dd>
              </div>

              <div
                className="flex flex-col rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: pastelColors[5] }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-800">
                  <StarIcon className="h-8 w-8 flex-none text-slate-800" />
                  Tracking Pemahaman
                </dt>
                <dd className="mt-3 flex flex-auto flex-col text-base leading-7 text-slate-700">
                  <p className="flex-auto">
                    Setiap quiz akan memberikan feedback dan skor untuk melacak
                    tingkat pemahaman kalian. Kalian bisa melihat progress dan
                    area yang perlu dipelajari lebih lanjut!
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Stats Section */}
        <div
          id="stats"
          className="py-12 sm:py-16 scroll-mt-20 rounded-3xl"
          style={{ backgroundColor: pastelColors[3] }}
        >
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
                  📊 Statistik Keren LogicBase
                </h2>
                <p className="mt-3 text-lg leading-8 text-slate-700">
                  Wah, banyak banget anak-anak yang sudah bergabung dan belajar
                  logika coding di LogicBase! Lihat angka-angka keren tentang
                  sistem belajar materi + quiz ini!
                </p>
              </div>
              <dl className="mt-8 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                <div
                  className="flex flex-col p-6"
                  style={{ backgroundColor: pastelColors[0] }}
                >
                  <dt className="text-sm font-semibold leading-6 text-slate-700">
                    👦👧 Anak-Anak Aktif
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-slate-800">
                    2,500+
                  </dd>
                  <p className="text-xs text-slate-700 mt-1">
                    Anak-anak yang belajar setiap bulan
                  </p>
                </div>
                <div
                  className="flex flex-col p-6"
                  style={{ backgroundColor: pastelColors[1] }}
                >
                  <dt className="text-sm font-semibold leading-6 text-slate-700">
                    📚 Materi Logika
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-slate-800">
                    25+
                  </dd>
                  <p className="text-xs text-slate-700 mt-1">
                    Materi logika coding tersedia
                  </p>
                </div>
                <div
                  className="flex flex-col p-6"
                  style={{ backgroundColor: pastelColors[2] }}
                >
                  <dt className="text-sm font-semibold leading-6 text-slate-700">
                    ✅ Tingkat Kelulusan Quiz
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-slate-800">
                    87%
                  </dd>
                  <p className="text-xs text-slate-700 mt-1">
                    Anak-anak yang berhasil lulus quiz
                  </p>
                </div>
                <div
                  className="flex flex-col p-6"
                  style={{ backgroundColor: pastelColors[5] }}
                >
                  <dt className="text-sm font-semibold leading-6 text-slate-700">
                    😊 Tingkat Kebahagiaan
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-slate-800">
                    92%
                  </dd>
                  <p className="text-xs text-slate-700 mt-1">
                    Anak-anak yang senang belajar di sini
                  </p>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div
          id="contact"
          className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16 scroll-mt-20"
        >
          <div className="mx-auto max-w-2xl text-center" id="contact">
            <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              📞 Hubungi Kami
            </h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              Ada pertanyaan atau butuh bantuan? Kakak-kakak di LogicBase siap
              membantu kalian! Jangan malu untuk bertanya ya!
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div
                className="rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
                style={{ backgroundColor: pastelColors[4] }}
              >
                <div
                  className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${pastelColors[0]}77` }}
                >
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Email
                </h3>
                <p className="text-slate-700">support@logicbase.kids</p>
              </div>

              <div
                className="rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
                style={{ backgroundColor: pastelColors[1] }}
              >
                <div
                  className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${pastelColors[2]}77` }}
                >
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Chat Langsung
                </h3>
                <p className="text-slate-700">Kakak-kakak siap membantu 24/7</p>
              </div>

              <div
                className="rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer text-center"
                style={{ backgroundColor: pastelColors[0] }}
              >
                <div
                  className="mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${pastelColors[3]}77` }}
                >
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Panduan Belajar
                </h3>
                <p className="text-slate-700">
                  Buku panduan lengkap untuk anak-anak
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto max-w-2xl text-center py-8 sm:py-12 pb-6">
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            🚀 Yuk Mulai Petualangan Coding!
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-slate-700">
            Bergabunglah dengan LogicBase dan rasakan serunya belajar logika
            coding! Baca materi yang menarik, kerjakan quiz yang seru, dan mulai
            petualangan belajar logika bersama teman-teman lainnya.
          </p>
          <div className="mt-6 flex items-center justify-center gap-x-6">
            <a
              href="/signup"
              className="rounded-md px-6 py-3 text-base font-semibold text-slate-800 shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transform hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: pastelColors[2] }}
            >
              🎯 Daftar Sekarang!
            </a>
            <a
              href="/login"
              className="text-base font-semibold leading-7 text-slate-800 hover:text-purple-600 transition-colors"
            >
              Sudah punya akun? Masuk Yuk! <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
