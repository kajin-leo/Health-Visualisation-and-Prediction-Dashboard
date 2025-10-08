import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Select, SelectItem } from "@heroui/react"; 
import FoodIntake from "./FoodIntake";
import FoodBarGraph from "./FoodBarGraph";
import type { GroupDatum } from "./FoodBarGraph";

const FoodIntakeWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedGoal, setSelectedGoal] = React.useState("balanced");

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  // Dietary goal-based recommendations
  const recommendations: Record<string, GroupDatum[]> = {
    balanced: [
      { group: "Vegetables", actual: 220, recommended: 300 },
      { group: "Meat", actual: 130, recommended: 150 },
      { group: "Dairy", actual: 180, recommended: 200 },
      { group: "Grains", actual: 250, recommended: 240 },
      { group: "Fruits", actual: 90, recommended: 150 },
    ],
    lean: [
      { group: "Vegetables", actual: 220, recommended: 320 },
      { group: "Meat", actual: 130, recommended: 180 },
      { group: "Dairy", actual: 180, recommended: 150 },
      { group: "Grains", actual: 250, recommended: 200 },
      { group: "Fruits", actual: 90, recommended: 180 },
    ],
    cutting: [
      { group: "Vegetables", actual: 220, recommended: 350 },
      { group: "Meat", actual: 130, recommended: 120 },
      { group: "Dairy", actual: 180, recommended: 100 },
      { group: "Grains", actual: 250, recommended: 180 },
      { group: "Fruits", actual: 90, recommended: 130 },
    ],
    bulking: [
      { group: "Vegetables", actual: 220, recommended: 250 },
      { group: "Meat", actual: 130, recommended: 220 },
      { group: "Dairy", actual: 180, recommended: 250 },
      { group: "Grains", actual: 250, recommended: 300 },
      { group: "Fruits", actual: 90, recommended: 200 },
    ],
  };

  const dietGoals = [
    { key: "balanced", label: "Balanced Diet" },
    { key: "lean", label: "Lean Muscle Building" },
    { key: "cutting", label: "Weight Loss / Cutting" },
    { key: "bulking", label: "Bulking / Strength Gain" },
  ];

  return (
    <>
      <div onClick={onOpen}>
        <FoodIntake />
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalContent>
          <ModalHeader>Dietary Details</ModalHeader>
          <ModalBody className="h-fit space-y-4">
            {/* Selection Menu */}
            <div className="flex justify-end mb-2 items-center gap-3">
              <Select
                className="max-w-xs"
                label="Select a Diet Goal"
                selectedKeys={[selectedGoal]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setSelectedGoal(value);
                }}
              >
                {dietGoals.map((goal) => (
                  <SelectItem key={goal.key}>{goal.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Graph */}
            <div>
              <FoodBarGraph data={recommendations[selectedGoal]} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FoodIntakeWrapper;
