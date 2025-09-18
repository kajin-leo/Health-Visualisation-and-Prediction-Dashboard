import type { Meta, StoryObj } from "@storybook/react";
import BmiCard from "./BmiCard";

const meta: Meta<typeof BmiCard> = {
  title: "Dashboard/BmiCard",
  component: BmiCard,
};
export default meta;

type Story = StoryObj<typeof BmiCard>;

export const Default: Story = {
  render: () => <div className="max-w-xl"><BmiCard /></div>,
};
