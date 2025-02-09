"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const questions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: "Mars",
  },
  {
    question: "Who wrote 'To Kill a Mockingbird'?",
    options: [
      "Harper Lee",
      "Mark Twain",
      "Ernest Hemingway",
      "F. Scott Fitzgerald",
    ],
    answer: "Harper Lee",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    answer: "Pacific",
  },
  {
    question: "Which is the smallest country in the world?",
    options: ["Monaco", "Maldives", "Vatican City", "San Marino"],
    answer: "Vatican City",
  },
];

export default function QuizApp() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizAttempted, setQuizAttempted] = useState(false);

  useEffect(() => {
    const hasAttempted = localStorage.getItem("quizAttempted");
    if (hasAttempted) {
      setQuizAttempted(true);
    }
  }, []);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      nextQuestion();
    }
  }, [timeLeft, quizStarted, quizFinished]);

  useEffect(() => {
    if (quizStarted) {
      document.addEventListener("visibilitychange", handleTabSwitch);
      document.addEventListener("fullscreenchange", handleFullScreenExit);
      return () => {
        document.removeEventListener("visibilitychange", handleTabSwitch);
        document.removeEventListener("fullscreenchange", handleFullScreenExit);
      };
    }
  }, [quizStarted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(10);
    enterFullScreen();
  };

  const handleTabSwitch = () => {
    if (document.hidden) {
      closeQuiz();
    }
  };

  const handleFullScreenExit = () => {
    if (!document.fullscreenElement) {
      closeQuiz();
    }
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  };

  const closeQuiz = () => {
    setQuizStarted(false);
    setQuizFinished(true);
    localStorage.setItem("quizAttempted", "true");
    exitFullScreen();
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    window.location.href = "/";
  };

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option);
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    setTimeout(nextQuestion, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(10);
    } else {
      setQuizFinished(true);
      localStorage.setItem("quizAttempted", "true");
    }
  };

  if (quizAttempted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-xl font-bold text-red-500">Access Denied!</h2>
          <p className="mt-2">You have already attempted the quiz.</p>
          <button
            onClick={exitFullScreen}
            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
        {!quizStarted ? (
          <>
            <button
              onClick={startQuiz}
              className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
            >
              Start Quiz
            </button>
          </>
        ) : quizFinished ? (
          <div>
            <h2 className="text-xl font-bold">
              Quiz Finished! Your Score: {score}/{questions.length}
            </h2>
            <button
              onClick={exitFullScreen}
              className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <h3 className="text-lg font-semibold">
              {questions[currentQuestion].question}
            </h3>
            <div className="mt-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`block w-full p-2 my-2 rounded-lg border ${
                    selectedAnswer === option
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">Time Left: {timeLeft}s</p>
          </>
        )}
      </div>
    </div>
  );
}
