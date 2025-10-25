import React, { useState } from "react";
import QuestionGroup from "./QuestionGroup";

const FFQForm: React.FC = () => {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const groups = [
    {
      title: "Bread & Dairy",
      questions: [
        { id: "bread", q: "How often do you eat bread?", options: ["Never", "1–3x/day", "4–5x/day", "6+"] },
        { id: "butter", q: "How often do you have butter?", options: ["Never", "Sometimes", "Always"] },
      ]
    },
    {
      title: "Vegetables & Fruits",
      questions: [
        { id: "vege", q: "How often do you eat vegetables?", options: ["Never", "Once", "Twice", "Thrice"] },
        { id: "fruit", q: "How often do you eat fruits?", options: ["Never", "1 portion", "2 portions", "3+"] },
      ]
    },
  ];

  const handleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    console.log("Submitted answers:", answers);
  };

  return (
    <div>
      <QuestionGroup
        group={groups[page]}
        answers={answers}
        onAnswer={handleAnswer}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 0}
          className="px-4 py-2 rounded bg-gray-200"
        >
          ← Previous
        </button>

        {page < groups.length - 1 ? (
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded bg-blue-500 text-white"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-green-500 text-white"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default FFQForm;
