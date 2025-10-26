import React from "react";

interface QuestionItemProps {
  id: string;
  question: string;
  options?: string[];
  value: string;
  onChange: (id: string, value: string) => void;
  open?: boolean;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  id,
  question,
  options,
  value,
  onChange,
  open,
}) => {
  return (
    <div className="border-b border-gray-200 pb-4">
      <p className="font-medium mb-2">{question}</p>

      {/* 如果是开放题 */}
      {open ? (
        <textarea
          className="w-full border rounded-md p-2 text-sm focus:ring focus:ring-blue-100"
          rows={2}
          placeholder="Enter your answer..."
          value={value || ""}
          onChange={(e) => onChange(id, e.target.value)}
        />
      ) : (
        /* 如果是选择题，确保 options 存在再 map */
        <div className="flex flex-col gap-1 ml-4">
          {options && options.length > 0 ? (
            options.map((opt, i) => (
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
            ))
          ) : (
            <p className="text-sm text-gray-400">No options provided</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionItem;
