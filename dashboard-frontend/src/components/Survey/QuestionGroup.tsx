import React from "react";
import QuestionItem from "./QuestionItem";

const QuestionGroup = ({ group, answers, onAnswer }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">{group.title}</h2>
      <div className="space-y-6">
        {group.questions.map(q => (
          <QuestionItem
            key={q.id}
            id={q.id}
            question={q.q}
            options={q.options}
            value={answers[q.id] || ""}
            onChange={onAnswer}
            open={q.open}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionGroup;
