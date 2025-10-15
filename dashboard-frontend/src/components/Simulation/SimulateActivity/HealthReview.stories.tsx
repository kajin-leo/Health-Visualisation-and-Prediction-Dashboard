import type { Meta, StoryObj } from '@storybook/react-vite';

import HealthReview from './HealthReview';

const meta = {
    component: HealthReview,
} satisfies Meta<typeof HealthReview>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockData = {
    groundTruth: "NI",
    prediction: {
        newClassification: "NIHR",
        possibility: 90
    }
}

const mockDataAlt = {
    groundTruth: "HFZ"
}

export const Default: Story = {
    args: {
        data: mockData
    }
};

export const Altered: Story = {
    args: {
        data: mockDataAlt
    }
}