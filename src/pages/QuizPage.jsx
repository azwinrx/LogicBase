import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCompleteQuizBySlug,
  submitQuizAnswersAndMarkComplete,
  hasUserTakenQuiz,
} from "../helper/supabaseQuiz";
import { getSubMateriBySlug } from "../helper/supabaseMateri";
import { showToast } from "../helper/toastUtil";
import { AuthContext } from "../helper/authUtils";
import {
  saveQuizState,
  getQuizState,
  clearQuizState,
  calculateRemainingTime,
  updateQuizAnswers,
  markQuizCompleted,
} from "../helper/quizPersistence";

const QuizPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [subMateriId, setSubMateriId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [isQuizActive, setIsQuizActive] = useState(false); // Track if quiz is in progress
  const [tabSwitchCount, setTabSwitchCount] = useState(0); // Track tab switches
  const [showWarning, setShowWarning] = useState(false); // Show warning overlay
  const [showRules, setShowRules] = useState(true); // Show rules modal before starting quiz
  const [rulesAccepted, setRulesAccepted] = useState(false); // Track if rules are accepted
  const [hasAlreadyTaken, setHasAlreadyTaken] = useState(false); // Track if quiz already taken

  // Format time helper function
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const loadQuiz = useCallback(async () => {
    try {
      setLoading(true);

      // Check if there's existing quiz state first
      const existingState = getQuizState();
      if (
        existingState &&
        existingState.userId === user?.id &&
        existingState.slug === slug
      ) {
        // Resume existing quiz
        const remainingTime = calculateRemainingTime(
          existingState.startTime,
          existingState.initialTimeLimit
        );

        if (remainingTime > 0) {
          // Resume the quiz
          setTimeLeft(remainingTime);
          setAnswers(existingState.answers || {});
          setCurrentQuestionIndex(existingState.currentQuestionIndex || 0);

          // Get quiz data
          const quizData = await getCompleteQuizBySlug(slug);
          setQuiz(quizData);

          // Get sub materi
          const subMateri = await getSubMateriBySlug(slug);
          setSubMateriId(subMateri?.id);

          showToast(
            `Quiz dilanjutkan. Sisa waktu: ${Math.floor(remainingTime / 60)}:${(
              remainingTime % 60
            )
              .toString()
              .padStart(2, "0")}`,
            "info"
          );
          setLoading(false);
          return;
        } else {
          // Time expired, clear state
          clearQuizState();
        }
      }

      // Get sub materi by slug first
      const subMateri = await getSubMateriBySlug(slug);
      if (!subMateri) {
        showToast("Materi tidak ditemukan", "error");
        navigate(-1);
        return;
      }

      setSubMateriId(subMateri.id);

      // Check if user has already taken the quiz
      if (user?.id) {
        const alreadyTaken = await hasUserTakenQuiz(user.id, subMateri.id);
        if (alreadyTaken) {
          setHasAlreadyTaken(true);
          showToast(
            "Anda sudah pernah menyelesaikan quiz ini. Setiap materi hanya dapat diambil satu kali.",
            "info"
          );
          setLoading(false);
          return;
        }
      }

      // Get quiz data using slug
      const quizData = await getCompleteQuizBySlug(slug);

      if (!quizData) {
        showToast("Quiz tidak ditemukan untuk materi ini", "error");
        navigate(-1);
        return;
      }

      setQuiz(quizData);
    } catch (error) {
      console.error("Error loading quiz:", error);
      showToast("Gagal memuat quiz", "error");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [slug, navigate, user?.id]);

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      // Check if all questions are answered (only for manual submit)
      if (!isAutoSubmit) {
        const unansweredQuestions = quiz.questions.filter(
          (q) => !answers[q.id]
        );

        if (unansweredQuestions.length > 0) {
          showToast(
            `Masih ada ${unansweredQuestions.length} pertanyaan yang belum dijawab`,
            "warning"
          );
          return;
        }
      }

      try {
        setSubmitting(true);
        setTimerActive(false); // Stop timer when submitting
        setIsQuizActive(false); // Mark quiz as inactive when submitting

        const quizResult = await submitQuizAnswersAndMarkComplete(
          quiz.id,
          answers,
          user?.id,
          parseInt(subMateriId)
        );
        setResult(quizResult);
        setShowResult(true);

        // Clear quiz state from localStorage when submitted
        markQuizCompleted();

        const message = isAutoSubmit
          ? `Waktu habis! Skor Anda ${quizResult.score}% dari ${
              Object.keys(answers).length
            } pertanyaan yang dijawab`
          : quizResult.passed
          ? `Selamat! Anda lulus dengan skor ${quizResult.score}% dan materi telah ditandai selesai!`
          : `Skor Anda ${quizResult.score}%. Silakan coba lagi untuk mencapai skor minimal 80%`;

        showToast(message, quizResult.passed ? "success" : "info");
      } catch (error) {
        console.error("Error submitting quiz:", error);
        showToast("Gagal mengirim jawaban quiz", "error");
      } finally {
        setSubmitting(false);
      }
    },
    [quiz, answers, user, subMateriId]
  );

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0 && !showResult) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setTimerActive(false);
            setShouldAutoSubmit(true);
            return 0;
          }
          // Show warning when 1 minute left
          if (prevTime === 60) {
            showToast("Waktu tersisa 1 menit!", "warning");
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 || !timerActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, showResult]);

  // Auto submit effect
  useEffect(() => {
    if (shouldAutoSubmit) {
      setShouldAutoSubmit(false);
      handleSubmit(true);
    }
  }, [shouldAutoSubmit, handleSubmit]);

  // Start timer when quiz is loaded and rules are accepted
  useEffect(() => {
    if (quiz && !timerActive && !showResult && user && rulesAccepted) {
      setTimerActive(true);
      setIsQuizActive(true); // Mark quiz as active when timer starts

      // Save initial quiz state to localStorage (only if not resuming)
      const existingState = getQuizState();
      if (
        !existingState ||
        existingState.userId !== user.id ||
        existingState.slug !== slug
      ) {
        const initialState = {
          userId: user.id,
          quizId: quiz.id,
          slug: slug,
          startTime: Date.now(),
          initialTimeLimit: timeLeft,
          answers: answers,
          currentQuestionIndex: currentQuestionIndex,
          isActive: true,
        };
        saveQuizState(initialState);
      }
    }
  }, [
    quiz,
    timerActive,
    showResult,
    user,
    slug,
    timeLeft,
    answers,
    currentQuestionIndex,
    rulesAccepted,
  ]);

  // Prevent navigation during active quiz
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isQuizActive && !showResult) {
        e.preventDefault();
        e.returnValue =
          "Quiz sedang berlangsung. Yakin ingin meninggalkan halaman?";
        return "Quiz sedang berlangsung. Yakin ingin ingin meninggalkan halaman?";
      }
    };

    const handlePopState = (e) => {
      if (isQuizActive && !showResult) {
        e.preventDefault();
        // Push the current state back to prevent navigation
        window.history.pushState(null, null, window.location.pathname);
        showToast(
          "Tidak dapat keluar dari quiz yang sedang berlangsung",
          "warning"
        );
        return false;
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "hidden" &&
        isQuizActive &&
        !showResult
      ) {
        // Increment tab switch count
        setTabSwitchCount((prev) => {
          const newCount = prev + 1;

          // Show warning overlay
          setShowWarning(true);
          setTimeout(() => setShowWarning(false), 3000);

          // Show different messages based on violation count
          if (newCount === 1) {
            showToast(
              "⚠️ Peringatan: Jangan meninggalkan tab quiz!",
              "warning"
            );
          } else if (newCount === 2) {
            showToast("⚠️ Peringatan ke-2: Tetap di tab quiz!", "warning");
          } else if (newCount >= 3) {
            showToast(
              `⚠️ Peringatan ke-${newCount}: Pelanggaran terdeteksi! Quiz mungkin dibatalkan.`,
              "error"
            );
          }

          // Auto-submit if too many violations (e.g., 5 times)
          if (newCount >= 5) {
            showToast(
              "Quiz otomatis disubmit karena terlalu banyak meninggalkan tab!",
              "error"
            );
            setShouldAutoSubmit(true);
          }

          return newCount;
        });
      }
    };

    if (isQuizActive && !showResult) {
      // Add beforeunload listener
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Add popstate listener to prevent back navigation
      window.addEventListener("popstate", handlePopState);

      // Add visibility change listener
      document.addEventListener("visibilitychange", handleVisibilityChange);

      // Push initial state to enable back button blocking
      window.history.pushState(null, null, window.location.pathname);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isQuizActive, showResult]);

  const handleAnswerSelect = (questionId, optionId) => {
    const newAnswers = {
      ...answers,
      [questionId]: optionId,
    };
    setAnswers(newAnswers);

    // Update answers in localStorage
    if (user?.id) {
      updateQuizAnswers(user.id, newAnswers, currentQuestionIndex);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);

      // Update question index in localStorage
      if (user?.id) {
        updateQuizAnswers(user.id, answers, newIndex);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);

      // Update question index in localStorage
      if (user?.id) {
        updateQuizAnswers(user.id, answers, newIndex);
      }
    }
  };

  // Removed handleRetry - quiz can only be taken once

  const handleAcceptRules = () => {
    setShowRules(false);
    setRulesAccepted(true);
  };

  const handleDeclineRules = () => {
    navigate(-1);
  };

  const handleFinish = () => {
    setIsQuizActive(false); // Mark quiz as inactive when finishing

    // Clear quiz state from localStorage
    markQuizCompleted();

    // Redirect back with refresh parameter if passed
    if (result?.passed) {
      navigate(-1, { state: { refreshProgress: true } });
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Memuat quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz && !hasAlreadyTaken) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300">Quiz tidak ditemukan</p>
        </div>
      </div>
    );
  }

  if (hasAlreadyTaken) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border-2 border-yellow-500 rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center bg-yellow-900/50 border-2 border-yellow-500">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Quiz Sudah Pernah Diambil
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mb-4">
            Anda sudah pernah menyelesaikan quiz untuk materi ini. Setiap quiz
            hanya dapat diambil{" "}
            <span className="font-bold text-yellow-400">satu kali</span>.
          </p>

          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <p className="text-slate-400 text-xs sm:text-sm">
              💡 Silakan lanjutkan ke materi berikutnya untuk melanjutkan
              pembelajaran Anda.
            </p>
          </div>

          <button
            onClick={handleFinish}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors focus:outline-none text-sm sm:text-base font-semibold"
          >
            Kembali ke Materi
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-3 sm:p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8 text-center">
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center ${
              result.passed
                ? "bg-green-900/50 border-2 border-green-500"
                : "bg-yellow-900/50 border-2 border-yellow-500"
            }`}
          >
            {result.passed ? (
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {result.passed ? "Selamat!" : "Belum Berhasil"}
          </h2>

          <div className="mb-6">
            <div
              className={`text-3xl sm:text-4xl font-bold mb-2 ${
                result.passed ? "text-green-400" : "text-yellow-400"
              }`}
            >
              {result.score}%
            </div>
            <p className="text-slate-300 text-sm sm:text-base">
              {result.correctAnswers} dari {result.totalQuestions} jawaban benar
            </p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Minimum score untuk lulus: 80%
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {!result.passed && (
              <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-3 mb-2">
                <p className="text-yellow-300 text-xs sm:text-sm">
                  ⚠️ Quiz hanya dapat diambil satu kali. Anda tidak dapat
                  mengulang quiz ini.
                </p>
              </div>
            )}
            <button
              onClick={handleFinish}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors focus:outline-none text-sm sm:text-base ${
                result.passed
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-slate-600 text-white hover:bg-slate-700"
              }`}
            >
              {result.passed
                ? "Lanjutkan ke Materi Berikutnya"
                : "Kembali ke Materi"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900 py-4 sm:py-6 relative">
      {/* Rules Modal */}
      {showRules && quiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border-2 border-sky-500 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-center gap-3 mb-2">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-white">Aturan Quiz</h2>
              </div>
              <p className="text-sky-100 text-center text-sm">
                Harap baca dan pahami aturan berikut sebelum memulai quiz
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quiz Info */}
              <div className="bg-sky-900/30 border border-sky-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-5 h-5 text-sky-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="font-semibold text-white">Informasi Quiz</h3>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-1">•</span>
                    <span>
                      Jumlah Pertanyaan:{" "}
                      <span className="font-bold text-sky-300">
                        {quiz.questions.length} soal
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-1">•</span>
                    <span>
                      Waktu:{" "}
                      <span className="font-bold text-sky-300">
                        5 menit (300 detik)
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sky-400 mt-1">•</span>
                    <span>
                      Passing Score:{" "}
                      <span className="font-bold text-green-400">80%</span>
                    </span>
                  </li>
                </ul>
              </div>

              {/* One Time Only Warning */}
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-8 h-8 text-red-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-bold text-red-300 mb-2 text-lg">
                      ⚠️ HANYA SATU KALI KESEMPATAN!
                    </p>
                    <p className="text-sm text-red-200 mb-2">
                      Quiz ini{" "}
                      <span className="font-bold underline">
                        HANYA DAPAT DIAMBIL SATU KALI
                      </span>
                      . Tidak ada kesempatan mengulang, baik lulus maupun tidak
                      lulus.
                    </p>
                    <p className="text-sm text-red-200">
                      Pastikan Anda sudah memahami materi dengan baik, berada di
                      lingkungan yang tenang, dan siap fokus sebelum memulai
                      quiz!
                    </p>
                  </div>
                </div>
              </div>

              {/* Rules */}
              <div className="space-y-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Aturan yang Harus Dipatuhi:
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-lg">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <p className="font-semibold text-red-300">
                        Jangan Meninggalkan Tab
                      </p>
                      <p className="text-sm text-slate-400">
                        Meninggalkan tab quiz akan dihitung sebagai pelanggaran.
                        Setelah 5x pelanggaran, quiz akan otomatis disubmit.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-lg">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <p className="font-semibold text-yellow-300">
                        Timer Otomatis Berjalan
                      </p>
                      <p className="text-sm text-slate-400">
                        Begitu Anda menyetujui aturan ini, timer 5 menit akan
                        langsung berjalan dan tidak dapat dihentikan.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-lg">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <p className="font-semibold text-orange-300">
                        Jangan Refresh Halaman
                      </p>
                      <p className="text-sm text-slate-400">
                        Refresh halaman akan mengacaukan quiz Anda. Pastikan
                        koneksi internet stabil.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-lg">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-semibold text-green-300">
                        Jawab Semua Pertanyaan
                      </p>
                      <p className="text-sm text-slate-400">
                        Pastikan semua pertanyaan terjawab sebelum submit. Soal
                        yang belum dijawab akan dihitung salah.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-slate-700/50 p-3 rounded-lg">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-semibold text-blue-300">
                        Fokus dan Teliti
                      </p>
                      <p className="text-sm text-slate-400">
                        Baca setiap pertanyaan dengan teliti. Anda dapat
                        berpindah antar soal sebelum submit.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-900/30 border-2 border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-bold text-red-300 mb-1">Penting!</p>
                    <p className="text-sm text-red-200">
                      Dengan menyetujui aturan ini, Anda bertanggung jawab untuk
                      mengikuti semua ketentuan yang berlaku. Pelanggaran dapat
                      mengakibatkan quiz otomatis disubmit atau hasil quiz tidak
                      valid.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-700/50 rounded-b-2xl border-t border-slate-600">
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleDeclineRules}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-semibold"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleAcceptRules}
                  className="px-6 py-3 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:from-sky-700 hover:to-blue-700 transition-colors font-semibold shadow-lg"
                >
                  Saya Mengerti & Mulai Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Overlay */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-slate-800 border-2 border-red-500 rounded-lg shadow-2xl max-w-md w-full p-6 sm:p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center bg-red-900/50 border-2 border-red-500">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-red-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Peringatan!
            </h2>

            {/* Message */}
            <p className="text-slate-300 text-sm sm:text-base mb-4">
              Jangan meninggalkan tab quiz!
            </p>

            {/* Counter Box */}
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4">
              <p className="text-white text-sm mb-1">
                Pelanggaran:{" "}
                <span className="font-bold text-2xl text-red-400">
                  {tabSwitchCount}
                </span>
                <span className="text-slate-400">/5</span>
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(tabSwitchCount / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Warning Text */}
            <p className="text-slate-400 text-xs sm:text-sm">
              Quiz akan otomatis disubmit jika terus meninggalkan tab
            </p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-sky-300">
                Quiz
              </h1>
              {tabSwitchCount > 0 && (
                <span className="bg-red-900/50 border border-red-500 text-red-300 text-xs px-2 py-1 rounded-full font-semibold">
                  ⚠️ {tabSwitchCount} Pelanggaran
                </span>
              )}
            </div>
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 001.414-1.414L11 9.586V5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span
                  className={`font-mono text-base sm:text-lg font-bold ${
                    timeLeft <= 60
                      ? "text-red-400 animate-pulse"
                      : "text-sky-400"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </div>
              <span className="text-xs sm:text-sm text-slate-400">
                Pertanyaan {currentQuestionIndex + 1} dari{" "}
                {quiz.questions.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-sky-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 leading-relaxed">
            {currentQuestion.teks_pertanyaan}
          </h2>

          {/* Options */}
          <div className="space-y-2 sm:space-y-3">
            {currentQuestion.quiz_options.map((option) => (
              <label
                key={option.id}
                className={`flex items-start p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  answers[currentQuestion.id] === option.id
                    ? "border-sky-500 bg-sky-900/30"
                    : "border-slate-600 hover:border-slate-500 hover:bg-slate-700/50"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() =>
                    handleAnswerSelect(currentQuestion.id, option.id)
                  }
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 mt-0.5 flex-shrink-0 ${
                    answers[currentQuestion.id] === option.id
                      ? "border-sky-400 bg-sky-400"
                      : "border-slate-400"
                  }`}
                >
                  {answers[currentQuestion.id] === option.id && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <span className="text-slate-200 text-sm sm:text-base leading-relaxed flex-1">
                  {option.teks_pilihan}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            {/* Progress dots - Mobile: top, Desktop: center */}
            <div className="flex justify-center gap-1.5 sm:gap-2 order-2 sm:order-2">
              {quiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                    index === currentQuestionIndex
                      ? "bg-sky-500"
                      : answers[quiz.questions[index].id]
                      ? "bg-green-500"
                      : "bg-slate-500"
                  }`}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between sm:justify-start sm:gap-4 order-1 sm:order-1">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-4 sm:px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-50 text-sm sm:text-base min-h-[40px] ${
                  currentQuestionIndex === 0
                    ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                    : "bg-slate-600 text-white hover:bg-slate-500"
                }`}
              >
                Sebelumnya
              </button>

              {currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`px-4 sm:px-6 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 text-sm sm:text-base min-h-[40px] ${
                    submitting
                      ? "bg-slate-600 text-slate-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {submitting ? "Mengirim..." : "Selesai"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-sky-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-sky-700 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 text-sm sm:text-base min-h-[40px]"
                >
                  Selanjutnya
                </button>
              )}
            </div>

            {/* Empty div for spacing on desktop */}
            <div className="hidden sm:block sm:w-20 order-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
