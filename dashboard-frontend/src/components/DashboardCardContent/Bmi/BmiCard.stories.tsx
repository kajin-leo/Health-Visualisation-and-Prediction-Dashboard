import type { Meta, StoryObj } from '@storybook/react-vite';

import BMICard, {type BodyMetricsSummary} from './BmiCard';

const meta = {
  component: BMICard,
} satisfies Meta<typeof BMICard>;

export default meta;

type Story = StoryObj<typeof meta>;

const mock: BodyMetricsSummary = {
    "height": 155.5975526,
    "weight": 44.68807639,
    "waistSize": 68.06984616,
    "bmi": 18.57475028
};

export const Default: Story = {
  args: {
    MockData: mock
  }
};