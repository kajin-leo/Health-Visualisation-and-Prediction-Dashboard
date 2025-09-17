import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react"; 
import FoodIntake from "./FoodIntake";
import FoodBarGraph from ".//FoodBarGraph";
import type { GroupDatum } from ".//FoodBarGraph";


const FoodIntakeWrapper: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const data: GroupDatum[] = []; // Placeholder for actual data
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const sampleData: GroupDatum[] = [
  { group: "Vegetables", actual: 220, recommended: 300 },
  { group: "Meat", actual: 130, recommended: 100 },
  { group: "Dairy", actual: 180, recommended: 200 },
  { group: "Grains", actual: 250, recommended: 240 },
  { group: "Fruits", actual: 90, recommended: 150 },
];

  return (
    <>
      <div
        onClick={onOpen}
      >
        <FoodIntake />
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalContent>
          <ModalHeader>
            Dietary Details
          </ModalHeader>
          <ModalBody className="h-fit">
            <div>
              <FoodBarGraph data={sampleData} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FoodIntakeWrapper;
