import React, { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCompleteQuizBySlug,
  submitQuizAnswersAndMarkComplete,
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

  // Start timer when quiz is loaded
  useEffect(() => {
    if (quiz && !timerActive && !showResult && user) {
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
        showToast("Jangan tinggalkan tab quiz!", "warning");
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

  const handleRetry = () => {
    // Clear existing state
    clearQuizState();

    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResult(false);
    setResult(null);
    setTimeLeft(300); // Reset timer to 5 minutes
    setTimerActive(true); // Restart timer
    setIsQuizActive(true); // Mark quiz as active again

    // Save new quiz state
    if (user && quiz) {
      const newState = {
        userId: user.id,
        quizId: quiz.id,
        slug: slug,
        startTime: Date.now(),
        initialTimeLimit: 300,
        answers: {},
        currentQuestionIndex: 0,
        isActive: true,
      };
      saveQuizState(newState);
    }
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

  if (!quiz) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300">Quiz tidak ditemukan</p>
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
              <button
                onClick={handleRetry}
                className="bg-sky-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-sky-700 transition-colors focus:outline-none text-sm sm:text-base"
              >
                Coba Lagi
              </button>
            )}
            <button
              onClick={handleFinish}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors focus:outline-none text-sm sm:text-base ${
                result.passed
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-slate-600 text-white hover:bg-slate-700"
              }`}
            >
              {result.passed ? "Lanjutkan" : "Selesai"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900 py-4 sm:py-6">
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-sky-300">Quiz</h1>
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
