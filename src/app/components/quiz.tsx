"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const questions = [
  {
    question: "How do you create an object of a class Car in Python?",
    options: ["car = new Car()", "car = Car()", "Car = new Car()", "Car = Car"],
    answer: "car = Car()",
  },
  {
    question: "Which statement about Python inheritance is TRUE?",
    options: [
      "A subclass cannot override methods from a superclass",
      "A class can inherit from multiple classes in Python",
      "Python does not support inheritance",
      "The super() function is used to call a child class method",
    ],
    answer: "A class can inherit from multiple classes in Python",
  },
  {
    question: "What is method overriding in Python?",
    options: [
      "Redefining a method in a subclass that already exists in the parent class",
      "Using multiple methods with the same name in the same class",
      "Using the same method name but different parameter types",
      "Calling a method from another class",
    ],
    answer:
      "Redefining a method in a subclass that already exists in the parent class",
  },

  {
    question:
      "What happens when a class method is decorated with @staticmethod?",
    options: [
      "It cannot be accessed outside the class",
      "It does not receive the self parameter",
      "It can only be called on an instance of the class",
      "It can access instance attributes",
    ],
    answer: "It does not receive the self parameter",
  },
  {
    question:
      "Which of the following statements about encapsulation in Python is TRUE?",
    options: [
      "There is no way to restrict access to class attributes",
      "Private attributes can be accessed using double underscore __",
      "Encapsulation allows controlling access to data within a class",
      "Python does not support encapsulation",
    ],
    answer: "Encapsulation allows controlling access to data within a class",
  },
  {
    question: "How can you define a private variable in Python?",
    options: [
      "By using a single underscore _var",
      "By using double underscore __var",
      "By using triple underscore ___var",
      "By using the private keyword",
    ],
    answer: "By using double underscore __var",
  },
  {
    question: "What is the purpose of the super() function in Python?",
    options: [
      "To call a static method",
      "To call a method from the parent class",
      "To create an instance of a class",
      "To define a private variable",
    ],
    answer: "To call a method from the parent class",
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
