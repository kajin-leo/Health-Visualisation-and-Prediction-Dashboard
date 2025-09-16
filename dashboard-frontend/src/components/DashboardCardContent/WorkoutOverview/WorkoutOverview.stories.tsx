import type { Meta, StoryObj } from '@storybook/react-vite';

import WorkoutOverview, {type Workout} from './WorkoutOverview';

const meta = {
  component: WorkoutOverview,
} satisfies Meta<typeof WorkoutOverview>;

export default meta;

type Story = StoryObj<typeof meta>;

const mock:Workout[] = [
    {
        "dayOfWeek": "FRIDAY",
        "mvpa": 244.0,
        "light": 1133.0
    },
    {
        "dayOfWeek": "SATURDAY",
        "mvpa": 636.0,
        "light": 5653.0
    },
    {
        "dayOfWeek": "SUNDAY",
        "mvpa": 535.0,
        "light": 4037.0
    },
    {
        "dayOfWeek": "MONDAY",
        "mvpa": 1097.0,
        "light": 5642.0
    },
    {
        "dayOfWeek": "TUESDAY",
        "mvpa": 571.0,
        "light": 5347.0
    },
    {
        "dayOfWeek": "WEDNESDAY",
        "mvpa": 1235.0,
        "light": 9396.0
    },
    {
        "dayOfWeek": "THURSDAY",
        "mvpa": 4968.0,
        "light": 10505.0
    }
];

export const Default: Story = {
  args: {
    mock: mock
  }
};