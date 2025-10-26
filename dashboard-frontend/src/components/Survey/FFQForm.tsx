import React, { useState } from "react";
import QuestionGroup from "./QuestionGroup";
import { convertAnswersToServings } from "./ServingMapper";
import {userAPI} from "../../service/api.ts"; 

interface Question {
  id: string;
  q: string;
  options?: string[];
  open?: boolean;
}

interface Group {
  title: string;
  questions: Question[];
}

const FFQForm: React.FC = () => {
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

 
  const groups: Group[] = [
    {
      title: "Bread & Dairy",
      questions: [
        {
          id: "bread",
          q: "How often do you eat bread (piece)? (baguette, marmitte, coco, sandwich bread)",
          options: [
            "Never or rarely",
            "Less than once a day",
            "About 1–3 times a day",
            "About 4–5 times a day",
            "6 or more times a day",
          ],
        },
        {
          id: "butter",
          q: "How often do you have butter or margarine on your bread?",
          options: [
            "Never",
            "Not very often",
            "Sometimes",
            "Almost always",
            "Always",
          ],
        },
        {
          id: "milk",
          q: "How much milk (in total) do you usually drink each day?",
          options: [
            "I don't drink milk",
            "Less than one cup a day",
            "About 1–2 cups a day",
            "About 2–3 cups a day",
            "3 cups or more a day",
          ],
        },
        {
          id: "vegetables",
          q: "How often do you usually eat vegetables each day?",
          options: [
            "I don't eat vegetables",
            "Once or less",
            "Twice",
            "Thrice",
            "Four times",
            "Five times or more",
          ],
        },
        {
          id: "fruits",
          q: "How often do you usually eat fruits each day?",
          options: [
            "I don't eat fruits",
            "1 portion or less",
            "2 portions",
            "3 portions",
            "4 portions or more",
          ],
        },
      ],
    },
    {
      title: "Drinks",
      questions: [
        {
          id: "water",
          q: "How much water do you usually drink each day?",
          options: [
            "I don't drink water",
            "Less than 1 glass a day",
            "About 1–2 glasses a day",
            "About 2–3 glasses a day",
            "About 3–4 glasses a day",
            "About 4 glasses or more a day",
          ],
        },
        {
          id: "juice",
          q: "How much sugar-sweetened beverages do you usually drink (juice, soda, lemonade)?",
          options: [
            "I don't drink juice",
            "Less than 1 glass a week",
            "About 1–3 glasses a week",
            "About 4–6 glasses a week",
            "About 1–2 glasses a day",
            "About 2–3 glasses a day",
            "3 glasses or more a day",
          ],
        },
      ],
    },
    {
      title: "Dairy Foods",
      questions: [
        {
          id: "cheese",
          q: "How often do you eat cheese?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–3 times a week",
            "About 4–6 times a week",
            "About once a day",
            "2 or more times a day",
          ],
        },
        {
          id: "yoghurt",
          q: "How often do you eat yoghurt?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–3 times a week",
            "About 4–6 times a week",
            "About once a day",
            "2 or more times a day",
          ],
        },
        {
          id: "cereal",
          q: "How often do you eat breakfast cereals?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–3 times a week",
            "About 4–6 times a week",
            "About once a day",
            "2 or more times a day",
          ],
        },
      ],
    },
    {
      title: "Staple Foods",
      questions: [
        {
          id: "pasta",
          q: "How often do you eat pasta or rice?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–3 times a week",
            "About 4–6 times a week",
            "About once a day",
            "2 or more times a day",
          ],
        },
        {
          id: "lentils",
          q: "How often do you eat lentils, split peas or dried beans?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
          ],
        },
        {
          id: "tubers",
          q: "How often do you eat tubers (cassava, yam, taro, sweet potato)?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
          ],
        },
      ],
    },
    {
      title: "Meats & Protein",
      questions: [
        {
          id: "red_meat",
          q: "How often do you eat red meat (beef, venison or lamb)?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
          ],
        },
        {
          id: "white_meat",
          q: "How often do you eat white meat (chicken)?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
          ],
        },
        {
          id: "fish",
          q: "How often do you eat fish?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
          ],
        },
        {
          id: "pork",
          q: "How often do you eat pork?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
          ],
        },
        {
          id: "eggs",
          q: "How often do you eat eggs?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
            "2 or more times a day",
          ],
        },
      ],
    },
    {
      title: "Processed Meats",
      questions: [
        {
          id: "canned_meat",
          q: "How often do you eat canned meat (corned beef, beef ouaco, etc.)?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
          ],
        },
        {
          id: "charcuterie",
          q: "How often do you eat charcuterie (sausages, pâté, canned ham)?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
          ],
        },
        {
          id: "noodle_soup",
          q: "How often do you eat noodle soup (maggi soup, yum-yum soup)?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
          ],
        },
      ],
    },
    {
      title: "Snacks & Fast Foods",
      questions: [
        {
          id: "french_fries",
          q: "How often do you eat French fries?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
            "2 or more times a day",
          ],
        },
        {
          id: "chips",
          q: "How often do you eat potato chips or salty snacks (Twisties, Doritos)?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
            "2 or more times a day",
          ],
        },
        {
          id: "takeaway",
          q: "How often do you have burgers, pizza, or fries from takeaway outlets?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
            "2 or more times a day",
          ],
        },
      ],
    },
    {
      title: "Sweets & Sugar",
      questions: [
        {
          id: "confectionary",
          q: "How often do you eat confectionary (lollies, chocolates)?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
            "2 or more times a day",
          ],
        },
        {
          id: "sweet_foods",
          q: "How often do you eat sweet foods (biscuits, cakes, pastries)?",
          options: [
            "Never or rarely",
            "Less than once a week",
            "About 1–2 times a week",
            "About 3–4 times a week",
            "About 5–6 times a week",
            "Everyday",
            "2 or more times a day",
          ],
        },
        {
          id: "sugar_teaspoons",
          q: "In total, how many teaspoons of sugar do you add to food/drinks each day?",
          options: Array.from({ length: 11 }, (_, i) => `${i}`),
        },
      ],
    },
    {
      title: "Other Foods & Buying Habits",
      questions: [
        {
          id: "other_foods",
          q: "Do you regularly eat other foods not mentioned in the questionnaire?",
          options: ["Yes", "No"],
        },
        {
          id: "other_foods_desc",
          q: "If yes, what are those foods?",
          open: true,
        },
        {
          id: "buy_before",
          q: "How many days a week do you buy something to eat on the way to school?",
          options: [
            "Everyday",
            "Four days a week",
            "Three days a week",
            "Two days a week",
            "One day a week",
            "Never or rarely",
          ],
        },
        {
          id: "buy_after",
          q: "How many days a week do you buy something to eat on the way home?",
          options: [
            "Everyday",
            "Four days a week",
            "Three days a week",
            "Two days a week",
            "One day a week",
            "Never or rarely",
          ],
        },
        { id: "before_school_foods", q: "Before school – list foods", open: true },
        { id: "after_school_foods", q: "After school – list foods", open: true },
      ],
    },
  ];

  
  const handleAnswer = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  
  const nextPage = () => setPage((p) => Math.min(p + 1, groups.length - 1));
  const prevPage = () => setPage((p) => Math.max(p - 1, 0));

const handleSubmit = async () => {
  setLoading(true);
  try {
    
    const userInfo = await userAPI.getUserInfo();
    const userId = userInfo.userId;

    
    const servingData = convertAnswersToServings(answers);

    
    const payload = {
      userId,
      foodFrequency: answers,
      servings: servingData,
    };

    
    const response = await userAPI.submitSurvey(payload);

    console.log("Survey submitted:", response);
    setSubmitted(true); 

  } catch (err) {
    console.error("Error submitting survey:", err);
    alert("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div>
      <QuestionGroup
        group={groups[page]}
        answers={answers}
        onAnswer={handleAnswer}
      />

      
      <div className="flex justify-between mt-8">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
          onClick={prevPage}
          disabled={page === 0}
        >
          ← Previous
        </button>

        {page < groups.length - 1 ? (
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            onClick={nextPage}
          >
            Next →
          </button>
        ) : (
          <button
            className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>

      
      <p className="text-center text-sm text-gray-500 mt-4">
        Page {page + 1} of {groups.length}
      </p>
    </div>
  );
};

export default FFQForm;
