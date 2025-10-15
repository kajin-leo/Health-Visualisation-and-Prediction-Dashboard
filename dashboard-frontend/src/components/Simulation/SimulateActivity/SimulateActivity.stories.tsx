import type { Meta, StoryObj } from '@storybook/react-vite';

import SimulateActivity, {type ActivityData} from './SimulateActivity';

const Wrapper = ({children}:{children: React.ReactNode}) => {
    return (
        <div className="w-250 h-90">
            {children}
        </div>
    )
}

const meta = {
    component: SimulateActivity,
    parameters:{
        layout: 'centered'
    },
    decorators: [
        (Story, context) => {
            return (
                <Wrapper>
                    <Story {...context} />
                </Wrapper>
            )
        }
    ]
} satisfies Meta<typeof SimulateActivity>;

export default meta;

type Story = StoryObj<typeof meta>;

const MockData:ActivityData = {
    "description": [
        "0:00-1:00",
        "1:00-2:00",
        "2:00-3:00",
        "3:00-4:00",
        "4:00-5:00",
        "5:00-6:00",
        "6:00-7:00",
        "7:00-8:00",
        "8:00-9:00",
        "9:00-10:00",
        "10:00-11:00",
        "11:00-12:00",
        "12:00-13:00",
        "13:00-14:00",
        "14:00-15:00",
        "15:00-16:00",
        "16:00-17:00",
        "17:00-18:00",
        "18:00-19:00",
        "19:00-20:00",
        "20:00-21:00",
        "21:00-22:00",
        "22:00-23:00",
        "23:00-24:00"
    ],
    "mvpa": [
        190,
        34,
        74,
        50,
        20,
        84,
        48,
        8,
        8,
        1,
        5,
        4,
        216,
        25,
        11,
        89,
        412,
        229,
        55,
        94,
        229,
        114,
        19,
        122
    ],
    "light": [
        147,
        108,
        87,
        73,
        88,
        79,
        52,
        18,
        4,
        3,
        5,
        11,
        84,
        43,
        71,
        117,
        95,
        84,
        119,
        98,
        106,
        114,
        123,
        233
    ]
}

export const Default: Story = {
    args: {
        MockData: MockData
    }
};