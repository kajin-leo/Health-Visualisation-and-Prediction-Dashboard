import type { Meta, StoryObj } from '@storybook/react-vite';

import HealthReview from './HealthReview';

const meta = {
    component: HealthReview,
} satisfies Meta<typeof HealthReview>;

export default meta;

type Story = StoryObj<typeof meta>;

const MockData = {
    groundTruth: "NI",
    newClassification: "NIHR",
    possibility: 90
}

export const Default: Story = {
    args: {
        MockData: MockData
    }
};