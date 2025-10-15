import type { Meta, StoryObj } from '@storybook/react-vite';

import HeatmapChart from './HealthStatus.tsx';


const meta = {
    component: HeatmapChart ,
} satisfies Meta<typeof HeatmapChart >;

export default meta;

type Story = StoryObj<typeof meta>;



export const Default: Story = {
    args: {

    }
};