import React from "react";

const QuestionItem = ({ id, question, options, value, onChange }) => {
  return (
    <div className="border-b pb-4">
      <p className="font-medium mb-2">{question}</p>
      <div className="flex flex-col gap-1 ml-4">
        {options.map((opt, i) => (
          <label key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name={id}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(id, opt)}
              className="accent-blue-500"
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionItem;
