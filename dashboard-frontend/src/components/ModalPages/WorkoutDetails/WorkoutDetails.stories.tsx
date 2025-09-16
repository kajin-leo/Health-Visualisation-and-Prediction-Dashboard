import type { Meta, StoryObj } from '@storybook/react-vite';

import WorkoutDetails from './WorkoutDetails';
import { type Workout } from '../../DashboardCardContent/WorkoutOverview/WorkoutOverview';
import { type DailyDetail, type TimeOfDayDetail } from './WorkoutDetails';

const meta = {
    component: WorkoutDetails,
} satisfies Meta<typeof WorkoutDetails>;

export default meta;

type Story = StoryObj<typeof meta>;

const overallMock: Workout[] = [
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

const dailyMock: DailyDetail[][] = [
    [
        {
            "timeSegmentStarting": "0:00 - 1:00",
            "mvpa": 3,
            "light": 57
        },
        {
            "timeSegmentStarting": "1:00 - 2:00",
            "mvpa": 24,
            "light": 309
        },
        {
            "timeSegmentStarting": "2:00 - 3:00",
            "mvpa": 14,
            "light": 123
        },
        {
            "timeSegmentStarting": "3:00 - 4:00",
            "mvpa": 23,
            "light": 323
        },
        {
            "timeSegmentStarting": "4:00 - 5:00",
            "mvpa": 22,
            "light": 253
        },
        {
            "timeSegmentStarting": "5:00 - 6:00",
            "mvpa": 2,
            "light": 22
        },
        {
            "timeSegmentStarting": "6:00 - 7:00",
            "mvpa": 2,
            "light": 6
        },
        {
            "timeSegmentStarting": "7:00 - 8:00",
            "mvpa": 2,
            "light": 21
        },
        {
            "timeSegmentStarting": "8:00 - 9:00",
            "mvpa": 2,
            "light": 14
        },
        {
            "timeSegmentStarting": "9:00 - 10:00",
            "mvpa": 14,
            "light": 182
        },
        {
            "timeSegmentStarting": "10:00 - 11:00",
            "mvpa": 11,
            "light": 14
        },
        {
            "timeSegmentStarting": "11:00 - 12:00",
            "mvpa": 36,
            "light": 659
        },
        {
            "timeSegmentStarting": "12:00 - 13:00",
            "mvpa": 112,
            "light": 265
        },
        {
            "timeSegmentStarting": "13:00 - 14:00",
            "mvpa": 7,
            "light": 0
        },
        {
            "timeSegmentStarting": "14:00 - 15:00",
            "mvpa": 2,
            "light": 23
        },
        {
            "timeSegmentStarting": "15:00 - 16:00",
            "mvpa": 36,
            "light": 257
        },
        {
            "timeSegmentStarting": "16:00 - 17:00",
            "mvpa": 2,
            "light": 6
        },
        {
            "timeSegmentStarting": "17:00 - 18:00",
            "mvpa": 19,
            "light": 213
        },
        {
            "timeSegmentStarting": "18:00 - 19:00",
            "mvpa": 79,
            "light": 165
        },
        {
            "timeSegmentStarting": "19:00 - 20:00",
            "mvpa": 142,
            "light": 568
        },
        {
            "timeSegmentStarting": "20:00 - 21:00",
            "mvpa": 196,
            "light": 1073
        },
        {
            "timeSegmentStarting": "21:00 - 22:00",
            "mvpa": 31,
            "light": 210
        },
        {
            "timeSegmentStarting": "22:00 - 23:00",
            "mvpa": 96,
            "light": 31
        },
        {
            "timeSegmentStarting": "23:00 - 24:00",
            "mvpa": 220,
            "light": 848
        }
    ],
    [
        {
            "timeSegmentStarting": "0:00 - 1:00",
            "mvpa": 106,
            "light": 517
        },
        {
            "timeSegmentStarting": "1:00 - 2:00",
            "mvpa": 34,
            "light": 1887
        },
        {
            "timeSegmentStarting": "2:00 - 3:00",
            "mvpa": 0,
            "light": 84
        },
        {
            "timeSegmentStarting": "3:00 - 4:00",
            "mvpa": 2,
            "light": 1
        },
        {
            "timeSegmentStarting": "4:00 - 5:00",
            "mvpa": 2,
            "light": 12
        },
        {
            "timeSegmentStarting": "5:00 - 6:00",
            "mvpa": 2,
            "light": 24
        },
        {
            "timeSegmentStarting": "6:00 - 7:00",
            "mvpa": 1,
            "light": 13
        },
        {
            "timeSegmentStarting": "7:00 - 8:00",
            "mvpa": 2,
            "light": 20
        },
        {
            "timeSegmentStarting": "8:00 - 9:00",
            "mvpa": 2,
            "light": 40
        },
        {
            "timeSegmentStarting": "9:00 - 10:00",
            "mvpa": 2,
            "light": 7
        },
        {
            "timeSegmentStarting": "10:00 - 11:00",
            "mvpa": 2,
            "light": 0
        },
        {
            "timeSegmentStarting": "11:00 - 12:00",
            "mvpa": 2,
            "light": 27
        },
        {
            "timeSegmentStarting": "12:00 - 13:00",
            "mvpa": 2,
            "light": 7
        },
        {
            "timeSegmentStarting": "13:00 - 14:00",
            "mvpa": 2,
            "light": 22
        },
        {
            "timeSegmentStarting": "14:00 - 15:00",
            "mvpa": 1,
            "light": 14
        },
        {
            "timeSegmentStarting": "15:00 - 16:00",
            "mvpa": 2,
            "light": 1
        },
        {
            "timeSegmentStarting": "16:00 - 17:00",
            "mvpa": 2,
            "light": 31
        },
        {
            "timeSegmentStarting": "17:00 - 18:00",
            "mvpa": 21,
            "light": 227
        },
        {
            "timeSegmentStarting": "18:00 - 19:00",
            "mvpa": 29,
            "light": 303
        },
        {
            "timeSegmentStarting": "19:00 - 20:00",
            "mvpa": 37,
            "light": 598
        },
        {
            "timeSegmentStarting": "20:00 - 21:00",
            "mvpa": 2,
            "light": 389
        },
        {
            "timeSegmentStarting": "21:00 - 22:00",
            "mvpa": 169,
            "light": 412
        },
        {
            "timeSegmentStarting": "22:00 - 23:00",
            "mvpa": 135,
            "light": 391
        },
        {
            "timeSegmentStarting": "23:00 - 24:00",
            "mvpa": 12,
            "light": 320
        }
    ],
    [
        {
            "timeSegmentStarting": "0:00 - 1:00",
            "mvpa": 2,
            "light": 16
        },
        {
            "timeSegmentStarting": "1:00 - 2:00",
            "mvpa": 0,
            "light": 635
        },
        {
            "timeSegmentStarting": "2:00 - 3:00",
            "mvpa": 0,
            "light": 885
        },
        {
            "timeSegmentStarting": "3:00 - 4:00",
            "mvpa": 13,
            "light": 135
        },
        {
            "timeSegmentStarting": "4:00 - 5:00",
            "mvpa": 6,
            "light": 0
        },
        {
            "timeSegmentStarting": "5:00 - 6:00",
            "mvpa": 12,
            "light": 187
        },
        {
            "timeSegmentStarting": "6:00 - 7:00",
            "mvpa": 0,
            "light": 0
        },
        {
            "timeSegmentStarting": "7:00 - 8:00",
            "mvpa": 19,
            "light": 58
        },
        {
            "timeSegmentStarting": "8:00 - 9:00",
            "mvpa": 31,
            "light": 277
        },
        {
            "timeSegmentStarting": "9:00 - 10:00",
            "mvpa": 2,
            "light": 16
        },
        {
            "timeSegmentStarting": "10:00 - 11:00",
            "mvpa": 2,
            "light": 19
        },
        {
            "timeSegmentStarting": "11:00 - 12:00",
            "mvpa": 139,
            "light": 1125
        },
        {
            "timeSegmentStarting": "12:00 - 13:00",
            "mvpa": 152,
            "light": 757
        },
        {
            "timeSegmentStarting": "13:00 - 14:00",
            "mvpa": 73,
            "light": 229
        },
        {
            "timeSegmentStarting": "14:00 - 15:00",
            "mvpa": 97,
            "light": 943
        },
        {
            "timeSegmentStarting": "15:00 - 16:00",
            "mvpa": 0,
            "light": 145
        },
        {
            "timeSegmentStarting": "16:00 - 17:00",
            "mvpa": 136,
            "light": 730
        },
        {
            "timeSegmentStarting": "17:00 - 18:00",
            "mvpa": 88,
            "light": 570
        },
        {
            "timeSegmentStarting": "18:00 - 19:00",
            "mvpa": 283,
            "light": 902
        },
        {
            "timeSegmentStarting": "19:00 - 20:00",
            "mvpa": 102,
            "light": 70
        },
        {
            "timeSegmentStarting": "20:00 - 21:00",
            "mvpa": 20,
            "light": 276
        },
        {
            "timeSegmentStarting": "21:00 - 22:00",
            "mvpa": 15,
            "light": 270
        },
        {
            "timeSegmentStarting": "22:00 - 23:00",
            "mvpa": 0,
            "light": 19
        },
        {
            "timeSegmentStarting": "23:00 - 24:00",
            "mvpa": 43,
            "light": 1132
        }
    ],
    [
        {
            "timeSegmentStarting": "0:00 - 1:00",
            "mvpa": 114,
            "light": 714
        },
        {
            "timeSegmentStarting": "1:00 - 2:00",
            "mvpa": 15,
            "light": 63
        },
        {
            "timeSegmentStarting": "2:00 - 3:00",
            "mvpa": 14,
            "light": 232
        },
        {
            "timeSegmentStarting": "3:00 - 4:00",
            "mvpa": 14,
            "light": 64
        },
        {
            "timeSegmentStarting": "4:00 - 5:00",
            "mvpa": 0,
            "light": 192
        },
        {
            "timeSegmentStarting": "5:00 - 6:00",
            "mvpa": 11,
            "light": 229
        },
        {
            "timeSegmentStarting": "6:00 - 7:00",
            "mvpa": 2,
            "light": 39
        },
        {
            "timeSegmentStarting": "7:00 - 8:00",
            "mvpa": 2,
            "light": 15
        },
        {
            "timeSegmentStarting": "8:00 - 9:00",
            "mvpa": 2,
            "light": 37
        },
        {
            "timeSegmentStarting": "9:00 - 10:00",
            "mvpa": 0,
            "light": 169
        },
        {
            "timeSegmentStarting": "10:00 - 11:00",
            "mvpa": 103,
            "light": 697
        },
        {
            "timeSegmentStarting": "11:00 - 12:00",
            "mvpa": 72,
            "light": 480
        },
        {
            "timeSegmentStarting": "12:00 - 13:00",
            "mvpa": 92,
            "light": 597
        },
        {
            "timeSegmentStarting": "13:00 - 14:00",
            "mvpa": 664,
            "light": 952
        },
        {
            "timeSegmentStarting": "14:00 - 15:00",
            "mvpa": 60,
            "light": 864
        },
        {
            "timeSegmentStarting": "15:00 - 16:00",
            "mvpa": 620,
            "light": 930
        },
        {
            "timeSegmentStarting": "16:00 - 17:00",
            "mvpa": 584,
            "light": 786
        },
        {
            "timeSegmentStarting": "17:00 - 18:00",
            "mvpa": 156,
            "light": 323
        },
        {
            "timeSegmentStarting": "18:00 - 19:00",
            "mvpa": 115,
            "light": 437
        },
        {
            "timeSegmentStarting": "19:00 - 20:00",
            "mvpa": 499,
            "light": 348
        },
        {
            "timeSegmentStarting": "20:00 - 21:00",
            "mvpa": 829,
            "light": 572
        },
        {
            "timeSegmentStarting": "21:00 - 22:00",
            "mvpa": 122,
            "light": 572
        },
        {
            "timeSegmentStarting": "22:00 - 23:00",
            "mvpa": 139,
            "light": 878
        },
        {
            "timeSegmentStarting": "23:00 - 24:00",
            "mvpa": 739,
            "light": 315
        }
    ],
    [
        {
            "timeSegmentStarting": "18:00 - 19:00",
            "mvpa": 2,
            "light": 20
        },
        {
            "timeSegmentStarting": "19:00 - 20:00",
            "mvpa": 11,
            "light": 215
        },
        {
            "timeSegmentStarting": "20:00 - 21:00",
            "mvpa": 194,
            "light": 423
        },
        {
            "timeSegmentStarting": "21:00 - 22:00",
            "mvpa": 16,
            "light": 98
        },
        {
            "timeSegmentStarting": "22:00 - 23:00",
            "mvpa": 21,
            "light": 204
        },
        {
            "timeSegmentStarting": "23:00 - 24:00",
            "mvpa": 0,
            "light": 173
        }
    ],
    [
        {
            "timeSegmentStarting": "0:00 - 1:00",
            "mvpa": 11,
            "light": 0
        },
        {
            "timeSegmentStarting": "1:00 - 2:00",
            "mvpa": 18,
            "light": 218
        },
        {
            "timeSegmentStarting": "2:00 - 3:00",
            "mvpa": 169,
            "light": 65
        },
        {
            "timeSegmentStarting": "3:00 - 4:00",
            "mvpa": 75,
            "light": 778
        },
        {
            "timeSegmentStarting": "4:00 - 5:00",
            "mvpa": 45,
            "light": 0
        },
        {
            "timeSegmentStarting": "5:00 - 6:00",
            "mvpa": 11,
            "light": 846
        },
        {
            "timeSegmentStarting": "6:00 - 7:00",
            "mvpa": 27,
            "light": 324
        },
        {
            "timeSegmentStarting": "7:00 - 8:00",
            "mvpa": 3,
            "light": 21
        },
        {
            "timeSegmentStarting": "8:00 - 9:00",
            "mvpa": 2,
            "light": 1
        },
        {
            "timeSegmentStarting": "9:00 - 10:00",
            "mvpa": 2,
            "light": 5
        },
        {
            "timeSegmentStarting": "10:00 - 11:00",
            "mvpa": 2,
            "light": 22
        },
        {
            "timeSegmentStarting": "11:00 - 12:00",
            "mvpa": 2,
            "light": 31
        },
        {
            "timeSegmentStarting": "12:00 - 13:00",
            "mvpa": 2,
            "light": 13
        },
        {
            "timeSegmentStarting": "13:00 - 14:00",
            "mvpa": 68,
            "light": 885
        },
        {
            "timeSegmentStarting": "14:00 - 15:00",
            "mvpa": 72,
            "light": 843
        },
        {
            "timeSegmentStarting": "15:00 - 16:00",
            "mvpa": 27,
            "light": 256
        },
        {
            "timeSegmentStarting": "16:00 - 17:00",
            "mvpa": 64,
            "light": 884
        },
        {
            "timeSegmentStarting": "17:00 - 18:00",
            "mvpa": 5,
            "light": 18
        },
        {
            "timeSegmentStarting": "18:00 - 19:00",
            "mvpa": 0,
            "light": 65
        },
        {
            "timeSegmentStarting": "19:00 - 20:00",
            "mvpa": 2,
            "light": 4
        },
        {
            "timeSegmentStarting": "20:00 - 21:00",
            "mvpa": 3,
            "light": 68
        },
        {
            "timeSegmentStarting": "21:00 - 22:00",
            "mvpa": 14,
            "light": 109
        },
        {
            "timeSegmentStarting": "22:00 - 23:00",
            "mvpa": 2,
            "light": 29
        },
        {
            "timeSegmentStarting": "23:00 - 24:00",
            "mvpa": 10,
            "light": 168
        }
    ],
    [
        {
            "timeSegmentStarting": "0:00 - 1:00",
            "mvpa": 2,
            "light": 29
        },
        {
            "timeSegmentStarting": "1:00 - 2:00",
            "mvpa": 2,
            "light": 29
        },
        {
            "timeSegmentStarting": "2:00 - 3:00",
            "mvpa": 32,
            "light": 126
        },
        {
            "timeSegmentStarting": "3:00 - 4:00",
            "mvpa": 2,
            "light": 20
        },
        {
            "timeSegmentStarting": "4:00 - 5:00",
            "mvpa": 0,
            "light": 12
        },
        {
            "timeSegmentStarting": "5:00 - 6:00",
            "mvpa": 26,
            "light": 294
        },
        {
            "timeSegmentStarting": "6:00 - 7:00",
            "mvpa": 2,
            "light": 0
        },
        {
            "timeSegmentStarting": "7:00 - 8:00",
            "mvpa": 2,
            "light": 23
        },
        {
            "timeSegmentStarting": "8:00 - 9:00",
            "mvpa": 217,
            "light": 375
        },
        {
            "timeSegmentStarting": "9:00 - 10:00",
            "mvpa": 89,
            "light": 1182
        },
        {
            "timeSegmentStarting": "10:00 - 11:00",
            "mvpa": 73,
            "light": 1172
        },
        {
            "timeSegmentStarting": "11:00 - 12:00",
            "mvpa": 27,
            "light": 309
        },
        {
            "timeSegmentStarting": "12:00 - 13:00",
            "mvpa": 2,
            "light": 20
        },
        {
            "timeSegmentStarting": "13:00 - 14:00",
            "mvpa": 2,
            "light": 20
        },
        {
            "timeSegmentStarting": "14:00 - 15:00",
            "mvpa": 2,
            "light": 0
        },
        {
            "timeSegmentStarting": "15:00 - 16:00",
            "mvpa": 2,
            "light": 1
        },
        {
            "timeSegmentStarting": "16:00 - 17:00",
            "mvpa": 2,
            "light": 20
        },
        {
            "timeSegmentStarting": "17:00 - 18:00",
            "mvpa": 2,
            "light": 18
        },
        {
            "timeSegmentStarting": "18:00 - 19:00",
            "mvpa": 2,
            "light": 41
        },
        {
            "timeSegmentStarting": "19:00 - 20:00",
            "mvpa": 2,
            "light": 32
        },
        {
            "timeSegmentStarting": "20:00 - 21:00",
            "mvpa": 2,
            "light": 2
        },
        {
            "timeSegmentStarting": "21:00 - 22:00",
            "mvpa": 10,
            "light": 139
        },
        {
            "timeSegmentStarting": "22:00 - 23:00",
            "mvpa": 4,
            "light": 0
        },
        {
            "timeSegmentStarting": "23:00 - 24:00",
            "mvpa": 29,
            "light": 173
        }
    ]
]

const timeofdayMock: TimeOfDayDetail[][] = [
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 11,
            "light": 0
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 29
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 3,
            "light": 57
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 106,
            "light": 517
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 2,
            "light": 16
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 114,
            "light": 714
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 18,
            "light": 218
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 29
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 24,
            "light": 309
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 34,
            "light": 1887
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 0,
            "light": 635
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 15,
            "light": 63
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 169,
            "light": 65
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 32,
            "light": 126
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 14,
            "light": 123
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 0,
            "light": 84
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 0,
            "light": 885
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 14,
            "light": 232
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 75,
            "light": 778
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 20
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 23,
            "light": 323
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 1
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 13,
            "light": 135
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 14,
            "light": 64
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 45,
            "light": 0
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 0,
            "light": 12
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 22,
            "light": 253
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 12
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 6,
            "light": 0
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 0,
            "light": 192
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 11,
            "light": 846
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 26,
            "light": 294
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 2,
            "light": 22
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 24
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 12,
            "light": 187
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 11,
            "light": 229
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 27,
            "light": 324
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 0
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 2,
            "light": 6
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 1,
            "light": 13
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 0,
            "light": 0
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 2,
            "light": 39
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 3,
            "light": 21
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 23
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 2,
            "light": 21
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 20
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 19,
            "light": 58
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 2,
            "light": 15
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 2,
            "light": 1
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 217,
            "light": 375
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 2,
            "light": 14
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 40
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 31,
            "light": 277
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 2,
            "light": 37
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 2,
            "light": 5
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 89,
            "light": 1182
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 14,
            "light": 182
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 7
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 2,
            "light": 16
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 0,
            "light": 169
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 2,
            "light": 22
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 73,
            "light": 1172
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 11,
            "light": 14
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 0
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 2,
            "light": 19
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 103,
            "light": 697
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 2,
            "light": 31
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 27,
            "light": 309
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 36,
            "light": 659
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 27
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 139,
            "light": 1125
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 72,
            "light": 480
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 2,
            "light": 13
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 20
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 112,
            "light": 265
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 7
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 152,
            "light": 757
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 92,
            "light": 597
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 68,
            "light": 885
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 20
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 7,
            "light": 0
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 22
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 73,
            "light": 229
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 664,
            "light": 952
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 72,
            "light": 843
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 0
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 2,
            "light": 23
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 1,
            "light": 14
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 97,
            "light": 943
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 60,
            "light": 864
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 27,
            "light": 256
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 1
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 36,
            "light": 257
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 1
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 0,
            "light": 145
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 620,
            "light": 930
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 64,
            "light": 884
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 20
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 2,
            "light": 6
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 31
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 136,
            "light": 730
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 584,
            "light": 786
        }
    ],
    [
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 5,
            "light": 18
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 18
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 19,
            "light": 213
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 21,
            "light": 227
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 88,
            "light": 570
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 156,
            "light": 323
        }
    ],
    [
        {
            "dayOfWeek": "FRIDAY",
            "mvpa": 2,
            "light": 20
        },
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 0,
            "light": 65
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 41
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 79,
            "light": 165
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 29,
            "light": 303
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 283,
            "light": 902
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 115,
            "light": 437
        }
    ],
    [
        {
            "dayOfWeek": "FRIDAY",
            "mvpa": 11,
            "light": 215
        },
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 2,
            "light": 4
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 32
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 142,
            "light": 568
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 37,
            "light": 598
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 102,
            "light": 70
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 499,
            "light": 348
        }
    ],
    [
        {
            "dayOfWeek": "FRIDAY",
            "mvpa": 194,
            "light": 423
        },
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 3,
            "light": 68
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 2,
            "light": 2
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 196,
            "light": 1073
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 2,
            "light": 389
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 20,
            "light": 276
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 829,
            "light": 572
        }
    ],
    [
        {
            "dayOfWeek": "FRIDAY",
            "mvpa": 16,
            "light": 98
        },
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 14,
            "light": 109
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 10,
            "light": 139
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 31,
            "light": 210
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 169,
            "light": 412
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 15,
            "light": 270
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 122,
            "light": 572
        }
    ],
    [
        {
            "dayOfWeek": "FRIDAY",
            "mvpa": 21,
            "light": 204
        },
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 2,
            "light": 29
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 4,
            "light": 0
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 96,
            "light": 31
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 135,
            "light": 391
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 0,
            "light": 19
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 139,
            "light": 878
        }
    ],
    [
        {
            "dayOfWeek": "FRIDAY",
            "mvpa": 0,
            "light": 173
        },
        {
            "dayOfWeek": "SATURDAY",
            "mvpa": 10,
            "light": 168
        },
        {
            "dayOfWeek": "SUNDAY",
            "mvpa": 29,
            "light": 173
        },
        {
            "dayOfWeek": "MONDAY",
            "mvpa": 220,
            "light": 848
        },
        {
            "dayOfWeek": "TUESDAY",
            "mvpa": 12,
            "light": 320
        },
        {
            "dayOfWeek": "WEDNESDAY",
            "mvpa": 43,
            "light": 1132
        },
        {
            "dayOfWeek": "THURSDAY",
            "mvpa": 739,
            "light": 315
        }
    ]
]

export const Default: Story = {
    args: {
        overallMock: overallMock,
        dailyMock: dailyMock,
        timeofdayMock: timeofdayMock
    }
};