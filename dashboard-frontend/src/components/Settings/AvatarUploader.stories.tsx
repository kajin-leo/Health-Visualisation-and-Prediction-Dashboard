import type { Meta, StoryObj } from '@storybook/react-vite';

import AvatarUploader from './AvatarUploader.tsx';


const meta = {
    component: AvatarUploader ,
} satisfies Meta<typeof AvatarUploader>;

export default meta;

type Story = StoryObj<typeof meta>;



export const Default: Story = {
    args: {

    }
};