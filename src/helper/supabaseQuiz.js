import supabase from "./supabaseClient";
import { addProgress } from "./supabaseMateri";

// Get quiz by sub_materi_id
export async function getQuizBySubMateriId(subMateriId) {
  const { data, error } = await supabase
    .from("quiz")
    .select("*")
    .eq("sub_materi_id", subMateriId)
    .single();

  if (error) {
    console.error("Gagal mengambil quiz:", error);
    return null;
  }

  return data;
}

// Get all questions for a specific quiz with their options
export async function getQuizQuestions(quizId) {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select(
      `
      id,
      teks_pertanyaan,
      urutan,
      quiz_options (
        id,
        teks_pilihan,
        is_correct,
        rationale
      )
    `
    )
    .eq("quiz_id", quizId)
    .order("urutan", { ascending: true });

  if (error) {
    console.error("Gagal mengambil pertanyaan quiz:", error);
    return [];
  }

  return data;
}

// Get quiz with all questions and options
export async function getCompleteQuiz(subMateriId) {
  try {
    // Get quiz
    const quiz = await getQuizBySubMateriId(subMateriId);
    if (!quiz) {
      return null;
    }

    // Get questions with options
    const questions = await getQuizQuestions(quiz.id);

    return {
      ...quiz,
      questions,
    };
  } catch (error) {
    console.error("Gagal mengambil quiz lengkap:", error);
    return null;
  }
}

// Submit quiz answers, calculate score, and mark as complete if passed
export async function submitQuizAnswersAndMarkComplete(
  quizId,
  answers,
  userId,
  subMateriId
) {
  try {
    // Get correct answers
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select(
        `
        id,
        quiz_options (
          id,
          is_correct
        )
      `
      )
      .eq("quiz_id", quizId);

    if (questionsError) {
      throw questionsError;
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const correctOption = question.quiz_options.find(
        (option) => option.is_correct
      );

      if (correctOption && userAnswer === correctOption.id) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= 80; // Minimum score 80% untuk lulus

    // Always mark progress regardless of pass/fail (one attempt only)
    // This ensures user cannot retake the quiz
    if (userId && subMateriId) {
      await addProgress(userId, subMateriId);
    }

    return {
      score,
      correctAnswers,
      totalQuestions,
      passed,
    };
  } catch (error) {
    console.error("Gagal submit jawaban quiz:", error);
    throw error;
  }
}

// Submit quiz answers and calculate score
export async function submitQuizAnswers(quizId, answers) {
  try {
    // Get correct answers
    const { data: questions, error: questionsError } = await supabase
      .from("quiz_questions")
      .select(
        `
        id,
        quiz_options (
          id,
          is_correct
        )
      `
      )
      .eq("quiz_id", quizId);

    if (questionsError) {
      throw questionsError;
    }

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      const correctOption = question.quiz_options.find(
        (option) => option.is_correct
      );

      if (correctOption && userAnswer === correctOption.id) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Save quiz result (optional - jika ada tabel quiz_results)
    // const { error: resultError } = await supabase
    //   .from("quiz_results")
    //   .insert({
    //     quiz_id: quizId,
    //     user_id: userId,
    //     score: score,
    //     correct_answers: correctAnswers,
    //     total_questions: totalQuestions,
    //     answers: answers,
    //     completed_at: new Date().toISOString()
    //   });

    // if (resultError) {
    //   throw resultError;
    // }

    return {
      score,
      correctAnswers,
      totalQuestions,
      passed: score >= 80, // Minimum score 80% untuk lulus
    };
  } catch (error) {
    console.error("Gagal submit jawaban quiz:", error);
    throw error;
  }
}

// Get quiz statistics for a user (optional)
export async function getUserQuizStats(userId, quizId) {
  const { data, error } = await supabase
    .from("quiz_results")
    .select("*")
    .eq("user_id", userId)
    .eq("quiz_id", quizId)
    .order("completed_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil statistik quiz:", error);
    return [];
  }

  return data;
}

// Check if quiz exists for sub materi
export async function hasQuiz(subMateriId) {
  const { data, error } = await supabase
    .from("quiz")
    .select("id")
    .eq("sub_materi_id", subMateriId)
    .single();

  return !error && data;
}

// Get complete quiz by sub-materi slug
export async function getCompleteQuizBySlug(slug) {
  try {
    // Import getSubMateriBySlug to get the sub materi by slug
    const { getSubMateriBySlug } = await import("./supabaseMateri.js");

    // Find sub materi by slug
    const subMateri = await getSubMateriBySlug(slug);
    if (!subMateri) {
      return null;
    }

    // Get quiz using the sub materi ID
    const quizData = await getCompleteQuiz(subMateri.id);
    return quizData;
  } catch (error) {
    console.error("Gagal mengambil quiz dengan slug:", error);
    return null;
  }
}

// Check if user has already taken the quiz (one attempt only)
export async function hasUserTakenQuiz(userId, subMateriId) {
  try {
    const { data, error } = await supabase
      .from("user_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("sub_materi_id", subMateriId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is ok
      console.error("Error checking quiz attempt:", error);
      return false;
    }

    // If progress exists, quiz has been taken (regardless of pass/fail)
    return !!data;
  } catch (error) {
    console.error("Error checking quiz attempt:", error);
    return false;
  }
}
