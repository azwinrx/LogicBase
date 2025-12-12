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
          className="flex items-center justify-between p-4 sm:p-6 lg:px-8 bg-white/80 backdrop-blur-md shadow-sm"
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
              🎉 Platform Belajar Konsep Dasar Coding{" "}
              <a href="#about" className="font-semibold text-purple-600">
                <span aria-hidden="true" className="absolute inset-0" />
                Selengkapnya <span aria-hidden="true">&rarr;</span>
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
              Platform pembelajaran konsep dasar coding yang interaktif dan
              mudah dipahami. Pelajari cara berpikir komputasional melalui
              materi terstruktur, lalu uji pemahaman Anda dengan quiz yang
              engaging. Bergabunglah dengan ribuan learner lainnya yang sudah
              memulai perjalanan coding mereka!
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
              <a
                href="#about"
                className="w-full sm:w-auto rounded-md px-6 py-3 text-sm sm:text-base font-semibold text-slate-800 shadow-lg hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transform hover:scale-105 transition-all duration-200 text-center"
                style={{ backgroundColor: pastelColors[0] }}
              >
                🎯 Mulai Belajar Sekarang
              </a>
              <a
                href="#features"
                className="text-sm sm:text-base font-semibold leading-6 text-slate-800 hover:text-purple-600 transition-colors"
              >
                Lihat Fitur <span aria-hidden="true">→</span>
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
              LogicBase adalah platform pembelajaran interaktif untuk memahami
              konsep dasar coding dan computational thinking. Di sini Anda akan
              belajar cara berpikir seperti programmer melalui materi yang
              terstruktur dan mudah dipahami, lalu menguji pemahaman dengan quiz
              yang interaktif!
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
                  Membuat pembelajaran konsep dasar coding dapat diakses oleh
                  siapa saja dengan cara yang engaging dan efektif! LogicBase
                  dibuat untuk membantu Anda memahami cara berpikir programmer
                  dan membangun fondasi yang kuat dalam dunia teknologi.
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
                  Menyediakan pembelajaran konsep dasar coding dengan pendekatan
                  yang sistematis dan mudah dipahami! Anda akan belajar melalui
                  materi yang terstruktur, lalu menguji pemahaman dengan quiz
                  interaktif untuk mengukur progres pembelajaran.
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
              Fitur-Fitur LogicBase
            </h2>
            <p className="mt-3 text-lg leading-8 text-slate-700">
              LogicBase menyediakan sistem pembelajaran yang komprehensif! Anda
              akan mengakses materi tentang konsep coding yang mudah dipahami,
              lalu menguji pemahaman dengan quiz yang interaktif dan terukur!
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
                    Materi pembelajaran konsep dasar coding yang disusun secara
                    sistematis dengan bahasa yang jelas dan mudah dipahami.
                    Setiap topik dijelaskan step by step dengan contoh praktis
                    dan relevan.
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
                    Setelah mempelajari materi, Anda dapat mengerjakan quiz
                    untuk menguji pemahaman. Quiz dirancang interaktif dengan
                    berbagai jenis soal yang menantang untuk mengukur progres
                    belajar!
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
                    Dashboard personal untuk melacak progres belajar Anda! Di
                    sini Anda dapat melihat materi apa saja yang sudah
                    dipelajari dan skor quiz yang telah dikerjakan.
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
                    Tim support yang siap membantu jika Anda mengalami kesulitan
                    dengan materi! Anda juga dapat berdiskusi dengan learner
                    lain dalam komunitas untuk saling berbagi pengalaman.
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
                    Sistem pembelajaran yang tersusun secara progresif dari
                    dasar sampai mahir. Mulai dari konsep fundamental hingga
                    logika yang lebih kompleks, semua dijelaskan secara
                    sistematis!
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
                    tingkat pemahaman Anda. Anda dapat melihat progress dan
                    mengidentifikasi area yang perlu dipelajari lebih lanjut!
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
                  📊 Statistik LogicBase
                </h2>
                <p className="mt-3 text-lg leading-8 text-slate-700">
                  Bergabunglah dengan ribuan learner yang telah memulai
                  perjalanan coding mereka di LogicBase! Lihat data dan
                  pencapaian dari sistem pembelajaran interaktif kami!
                </p>
              </div>
              <dl className="mt-8 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
                <div
                  className="flex flex-col p-6"
                  style={{ backgroundColor: pastelColors[0] }}
                >
                  <dt className="text-sm font-semibold leading-6 text-slate-700">
                    👨‍🎓 Learner Aktif
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-slate-800">
                    2,500+
                  </dd>
                  <p className="text-xs text-slate-700 mt-1">
                    Pengguna aktif belajar setiap bulan
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

      {/* Footer */}
      <footer
        className="mt-auto border-t border-gray-200"
        style={{ backgroundColor: pastelColors[0] }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* Logo & Description */}
            <div className="lg:col-span-2">
              <a href="#" className="flex items-center space-x-2 mb-4">
                <img
                  src="/Icon Kobi (maskot LogicBase)/kobiMelambai.png"
                  alt="LogicBase Logo"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-2xl font-bold text-slate-800">
                  LogicBase
                </span>
              </a>
              <p className="text-sm text-slate-700 max-w-md mb-4">
                Platform pembelajaran interaktif untuk memahami konsep dasar
                coding dan computational thinking. Mulai perjalanan coding Anda
                bersama kami!
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-slate-700 hover:text-purple-600 transition-colors"
                  aria-label="Facebook"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-slate-700 hover:text-purple-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-slate-700 hover:text-purple-600 transition-colors"
                  aria-label="Twitter"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-slate-700 hover:text-purple-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#about"
                    className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                  >
                    Tentang
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                  >
                    Fitur
                  </a>
                </li>
                <li>
                  <a
                    href="#stats"
                    className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                  >
                    Statistik
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                  >
                    Kontak
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-slate-800 mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="/login"
                    className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                  >
                    Login
                  </a>
                </li>
                <li>
                  <a
                    href="/signup"
                    className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                  >
                    Register
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-8 border-t border-slate-300">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-slate-700">
                © {new Date().getFullYear()} LogicBase. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm text-slate-700 hover:text-purple-600 transition-colors"
                >
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
