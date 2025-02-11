"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const questions = [
  {
    question:
      "Which of the following is the correct way to declare a variable in Python?",
    options: ["int x = 10;", "x := 10;", "x = 10", "var x = 10;"],
    answer: "x = 10",
  },
  {
    question: "How do you write a single-line comment in Python?",
    options: [
      "// This is a comment",
      "/* This is a comment */",
      "# This is a comment",
      "<!-- This is a comment -->",
    ],
    answer: "# This is a comment",
  },
  {
    question: "What is the difference between a list and a tuple in Python??",
    options: [
      "Lists are immutable, tuples are mutable",
      "Lists are mutable, tuples are immutable",
      "Both lists and tuples are mutable",
      "Both lists and tuples are immutable",
    ],
    answer: "Lists are mutable, tuples are immutable",
  },
  {
    question: "Which of the following is NOT a built-in data type in Python?",
    options: ["int", "float", "array", "tuple"],
    answer: "array ",
  },
  {
    question: "What is the difference between print() and return in Python?",
    options: [
      "print() displays output, return gives a value back from a function",
      "print() and return both display output",
      "return displays output, print() is used in functions",
      "return is used for debugging only",
    ],
    answer:
      "print() displays output, return gives a value back from a function",
  },
  {
    question: "What is the correct syntax to define a function in Python?",
    options: [
      "function myFunc():",
      "def myFunc():",
      "void myFunc():",
      "define myFunc():",
    ],
    answer: "def myFunc():",
  },
  {
    question: "Which of the following is immutable in Python?",
    options: ["list", "set", "dict", "tuple"],
    answer: "tuple ",
  },
  {
    question:
      "What is the difference between break and continue in Python loops?",
    options: [
      "break skips the next iteration, continue stops the loop",
      "break stops the loop, continue skips the current iteration",
      "Both break and continue stop the loop",
      "There is no difference",
    ],
    answer: "break stops the loop, continue skips the current iteration",
  },
  {
    question:
      "What mode should be used to open a file for reading only in Python?",
    options: ["w", "r", "a", "x"],
    answer: "r ",
  },
  {
    question: "What is the correct syntax to define a dictionary in Python?",
    options: ["[]", "{}", "()", "dict()"],
    answer: "{}",
  },
  {
    question:
      "Which of the following methods removes the last element from a list?",
    options: ["discard()", "pop()", "delete()", "remove()"],
    answer: "pop()",
  },
  {
    question: "Which of the following is NOT a valid way to create a string?",
    options: ["'hello'", '"hello"', "str('Hello')", "'''Hello'''"],
    answer: "str('Hello')",
  },
  {
    question: "How do you open a file in read mode in Python?",
    options: [
      'open("file.txt")',
      'open("file.txt", "rb")',
      'open("file.txt", "r")',
      'open("file.txt", "w")',
    ],
    answer: 'open("file.txt", "r")',
  },
  {
    question: "What is the purpose of pass in Python?",
    options: [
      "It terminates a loop",
      "It skips execution inside a function or loop",
      "It returns a value",
      "It raises an exception",
    ],
    answer: "It skips execution inside a function or loop",
  },
  {
    question: "Which keyword is used for function definition in Python?",
    options: ["define", "def", "func", "lambda"],
    answer: "def",
  },
  {
    question: "Which operator is used for exponentiation in Python?",
    options: ["^", "**", "//", "%"],
    answer: "**",
  },
  {
    question: "What is the difference between append() and extend() in lists?",
    options: [
      "They are the same",
      "extend() works only for strings",
      "append() adds multiple elements at once, extend() adds one at a time",
      "append() adds elements individually, extend() adds elements as a list",
    ],
    answer:
      "append() adds elements individually, extend() adds elements as a list",
  },
  {
    question: "Which of the following is an invalid variable name in Python?",
    options: ["_myVar", "my_var", "2ndVariable", "myVar2"],
    answer: "2ndVariable",
  },
  {
    question: "What does None represent in Python?",
    options: [
      "The number 0",
      "An empty string",
      "A null value",
      "A Boolean False",
    ],
    answer: "A null value",
  },
  {
    question: "What is the difference between == and = in Python?",
    options: [
      "== is for assignment, = is for comparison",
      "= is for assignment, == is for comparison",
      "Both are used for comparison",
      "Both are used for assignment",
    ],
    answer: "= is for assignment, == is for comparison",
  },
];

export default function QuizApp() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
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
    setTimeLeft(30);
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
      setTimeLeft(30);
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
