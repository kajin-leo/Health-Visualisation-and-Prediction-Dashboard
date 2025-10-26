
export const convertAnswersToServings = (answers: Record<string, string>) => {
  const servings: Record<string, number> = {};

const mapFrequency = {
  "Never or rarely": 0,
  "Less than once a week": 0.05, 
  "About 1–2 times a week": 0.3,
  "About 3–4 times a week": 0.6,
  "About 4–6 times a week": 0.7, 
  "About 5–6 times a week": 0.8, 
  "About once a day": 1,
  "2 or more times a day": 2,
  "Everyday": 1,
  "Less than once a day": 0.3, 
  "About 1–3 times a day": 2,
  "About 4–5 times a day": 4.5,
  "6 or more times a day": 6,
};

  const mapCups = {
    "I don't drink milk": 0,
    "Less than one cup a day": 0.5,
    "About 1–2 cups a day": 1.5,
    "About 2–3 cups a day": 2.5,
    "3 cups or more a day": 3,
  };

  const mapGlasses = {
    "I don't drink water": 0,
    "Less than 1 glass a day": 0.5,
    "About 1–2 glasses a day": 1.5,
    "About 2–3 glasses a day": 2.5,
    "About 3–4 glasses a day": 3.5,
    "About 4 glasses or more a day": 4,
  };

  const mapSugarDrink = {
    "I don't drink juice": 0,
    "Less than 1 glass a week": 0.1,
    "About 1–3 glasses a week": 0.3,
    "About 4–6 glasses a week": 0.8,
    "About 1–2 glasses a day": 1.5,
    "About 2–3 glasses a day": 2.5,
    "3 glasses or more a day": 3,
  };

  // 🥖 Bread
  if (answers.bread) servings["bread"] = mapFrequency[answers.bread] ?? 0;

  // 🧈 Butter / margarine
  if (answers.butter) {
    const map = {
      Never: 0,
      "Not very often": 0.2,
      Sometimes: 0.5,
      "Almost always": 0.8,
      Always: 1,
    };
    servings["butter"] = map[answers.butter] ?? 0;
  }

  // 🥛 Milk
  if (answers.milk) servings["milk"] = mapCups[answers.milk] ?? 0;

  // 🥬 Vegetables
  if (answers.vegetables) {
    const map = {
      "I don't eat vegetables": 0,
      "Once or less": 0.5,
      Twice: 2,
      Thrice: 3,
      "Four times": 4,
      "Five times or more": 5,
    };
    servings["vegetables"] = map[answers.vegetables] ?? 0;
  }

  // 🍎 Fruits
  if (answers.fruits) {
    const map = {
      "I don't eat fruits": 0,
      "1 portion or less": 1,
      "2 portions": 2,
      "3 portions": 3,
      "4 portions or more": 4,
    };
    servings["fruits"] = map[answers.fruits] ?? 0;
  }

  // 💧 Water
  if (answers.water) servings["water"] = mapGlasses[answers.water] ?? 0;

  // 🧃 Sweet drinks
  if (answers.juice) servings["sweet_drinks"] = mapSugarDrink[answers.juice] ?? 0;

  // 🧀 Cheese
  if (answers.cheese) servings["cheese"] = mapFrequency[answers.cheese] ?? 0;

  // 🥣 Yoghurt
  if (answers.yoghurt) servings["yoghurt"] = mapFrequency[answers.yoghurt] ?? 0;

  // 🥣 Breakfast cereal
  if (answers.cereal) servings["cereal"] = mapFrequency[answers.cereal] ?? 0;

  // 🍚 Pasta / Rice
  if (answers.pasta) servings["pasta_rice"] = mapFrequency[answers.pasta] ?? 0;

  // 🫘 Lentils / beans
  if (answers.lentils) servings["lentils"] = mapFrequency[answers.lentils] ?? 0;

  // 🍠 Tubers
  if (answers.tubers) servings["tubers"] = mapFrequency[answers.tubers] ?? 0;

  // 🥩 Red meat
  if (answers.red_meat) servings["red_meat"] = mapFrequency[answers.red_meat] ?? 0;

  // 🍗 White meat
  if (answers.white_meat) servings["white_meat"] = mapFrequency[answers.white_meat] ?? 0;

  // 🐟 Fish
  if (answers.fish) servings["fish"] = mapFrequency[answers.fish] ?? 0;

  // 🐖 Pork
  if (answers.pork) servings["pork"] = mapFrequency[answers.pork] ?? 0;

  // 🥚 Eggs
  if (answers.eggs) servings["eggs"] = mapFrequency[answers.eggs] ?? 0;

  // 🥫 Canned meat
  if (answers.canned_meat) servings["canned_meat"] = mapFrequency[answers.canned_meat] ?? 0;

  // 🌭 Charcuterie
  if (answers.charcuterie) servings["charcuterie"] = mapFrequency[answers.charcuterie] ?? 0;

  // 🍜 Noodle soup
  if (answers.noodle_soup) servings["noodle_soup"] = mapFrequency[answers.noodle_soup] ?? 0;

  // 🍟 French fries
  if (answers.french_fries) servings["french_fries"] = mapFrequency[answers.french_fries] ?? 0;

  // 🥔 Chips / salty snacks
  if (answers.chips) servings["chips"] = mapFrequency[answers.chips] ?? 0;

  // 🍕 Takeaway
  if (answers.takeaway) servings["takeaway_food"] = mapFrequency[answers.takeaway] ?? 0;

  // 🍬 Confectionary
  if (answers.confectionary) servings["confectionary"] = mapFrequency[answers.confectionary] ?? 0;

  // 🍰 Sweet foods
  if (answers.sweet_foods) servings["sweet_foods"] = mapFrequency[answers.sweet_foods] ?? 0;

  // 🍯 Sugar teaspoons
  if (answers.sugar_teaspoons) servings["added_sugar_teaspoons"] = Number(answers.sugar_teaspoons) ?? 0;

  return servings;
};
