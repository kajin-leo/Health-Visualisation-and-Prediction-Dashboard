import React from "react";

/** 15~30 → -85° ~ +85°；18.5~24.9 在绿色中段 */
function bmiToAngle(bmi: number) {
  const min = 15, max = 30;
  const t = (Math.max(min, Math.min(max, bmi)) - min) / (max - min);
  return -85 + t * 170;
}

type Props = { bmi: number; width?: number };

const BmiCard: React.FC<Props> = ({ bmi, width = 420 }) => {
  const angle = bmiToAngle(bmi);

  return (
    <svg
      width={width}
      viewBox="0 0 720 980"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`BMI card, BMI ${bmi}`}
    >
      {/* ====== defs ====== */}
      <defs>
        {/* 卡片渐变 */}
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dff0ff" />
          <stop offset="1" stopColor="#cfe6f7" />
        </linearGradient>

        {/* 仪表盘主渐变（沿弧线方向） */}
        <linearGradient id="gaugeGrad" gradientUnits="userSpaceOnUse"
                        x1="140" y1="230" x2="580" y2="230">
          <stop offset="0%"  stopColor="#ff4d6d"/>
          <stop offset="22%" stopColor="#ffb703"/>
          <stop offset="44%" stopColor="#28c76f"/>
          <stop offset="70%" stopColor="#22c1f1"/>
          <stop offset="100%" stopColor="#7c3aed"/>
        </linearGradient>

        {/* 柔光阴影 */}
        <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.12" />
        </filter>

        {/* 内侧微高光（让边缘更“丝滑”） */}
        <linearGradient id="innerGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35"/>
          <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>

        {/* 刻度用遮罩：把弧线范围裁出来再画短线，不会溢出 */}
        <mask id="tickMask">
          <rect x="0" y="0" width="720" height="980" fill="black"/>
          <path d="M 140 350
                   A 220 220 0 0 1 580 350"
                fill="none" stroke="white" strokeWidth="60" strokeLinecap="round"/>
        </mask>
      </defs>

      {/* 卡片背景 */}
      <rect x="36" y="36" width="648" height="908" rx="36" fill="url(#bg)" />

      {/* ====== 仪表盘（更顺滑） ====== */}
      <g transform="translate(0,0)">
        {/* 柔光底弧（加厚+模糊阴影，营造丝滑感） */}
        <path d="M 140 350
                 A 220 220 0 0 1 580 350"
              fill="none" stroke="#b9d8f1" strokeWidth="54" strokeLinecap="round" filter="url(#soft)" opacity="0.9"/>

        {/* 主弧：单段渐变，圆头 */}
        <path d="M 140 350
                 A 220 220 0 0 1 580 350"
              fill="none" stroke="url(#gaugeGrad)" strokeWidth="40" strokeLinecap="round"/>

        {/* 内缘高光（很薄的一层，顺着弧线） */}
        <path d="M 145 349
                 A 215 215 0 0 1 575 349"
              fill="none" stroke="url(#innerGlow)" strokeWidth="8" strokeLinecap="round" opacity="0.9"/>

        {/* 低存在感刻度（遮罩到弧线内） */}
        <g mask="url(#tickMask)" opacity="0.33">
          {Array.from({ length: 17 }).map((_, i) => {
            const t = i / 16; // 0~1
            const theta = (-85 + t * 170) * Math.PI / 180;
            const cx = 360 + Math.cos(theta) * 220;
            const cy = 350 - Math.sin(theta) * 220;
            // 法线方向内外各 10px
            const nx = Math.cos(theta + Math.PI/2);
            const ny = -Math.sin(theta + Math.PI/2);
            const x1 = cx + nx * 8,  y1 = cy + ny * 8;
            const x2 = cx - nx * 8,  y2 = cy - ny * 8;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#0f172a" strokeWidth={i%4===0?3:2} strokeLinecap="round"/>;
          })}
        </g>

        {/* 指针（仍受角度限制，永不越界） */}
        <g transform={`rotate(${angle}, 360, 350)`}>
          <line x1="360" y1="350" x2="470" y2="240" stroke="#1f2a44" strokeWidth="18" strokeLinecap="round" />
          <circle cx="360" cy="350" r="10" fill="#1f2a44" />
        </g>
      </g>

      {/* 文案：与图形分离 */}
      <text x="360" y="420" textAnchor="middle" fontFamily="Inter, Arial, Helvetica, sans-serif"
            fontSize="80" fontWeight="900" fill="#1f2a44">
        BMI
      </text>
      <text x="360" y="482" textAnchor="middle" fontFamily="Inter, Arial, Helvetica, sans-serif"
            fontSize="64" fontWeight="900" fill="#1f2a44" letterSpacing="2">
        NORMAL
      </text>

      {/* ====== 人物（两手两腿） ====== */}
      <g transform="translate(0,10)">
        <circle cx="360" cy="560" r="80" fill="#ffd9c2" stroke="#1f2a44" strokeWidth="10" />
        <rect x="250" y="620" width="220" height="140" rx="90"
              fill="#ffd9c2" stroke="#1f2a44" strokeWidth="10" />
        <path d="M 250 685 C 210 685, 210 725, 240 740" fill="none"
              stroke="#1f2a44" strokeWidth="14" strokeLinecap="round"/>
        <path d="M 470 685 C 510 685, 510 725, 480 740" fill="none"
              stroke="#1f2a44" strokeWidth="14" strokeLinecap="round"/>
        <path d="M 310 760 Q 310 860 335 860 Q 360 860 360 760"
              fill="#ffd9c2" stroke="#1f2a44" strokeWidth="10"/>
        <path d="M 360 760 Q 360 860 385 860 Q 410 860 410 760"
              fill="#ffd9c2" stroke="#1f2a44" strokeWidth="10"/>

        {/* 腰部软尺 + 标签 */}
        <g>
          <rect x="250" y="690" width="220" height="44" rx="22" fill="#ffffff" />
          <rect x="250" y="690" width="220" height="44" rx="22" fill="none" stroke="#1f2a44" strokeWidth="8"/>
          <g stroke="#1f2a44" strokeWidth="4">
            {Array.from({ length: 23 }).map((_, i) => (
              <line key={i} x1={260 + i * (200/22)} y1={696} x2={260 + i * (200/22)} y2={730} />
            ))}
          </g>
          <rect x="485" y="686" width="130" height="50" rx="20" fill="#ffffff" />
          <text x="550" y="720" textAnchor="middle"
                fontFamily="Inter, Arial, Helvetica, sans-serif" fontSize="34" fontWeight="900" fill="#1f2a44">
            Waist
          </text>
        </g>
      </g>

      {/* Height（仅与人物等高） */}
      <g>
        <line x1="110" y1="470" x2="110" y2="870" stroke="#1f2a44" strokeWidth="12"/>
        <polyline points="110,445 90,480 110,470 130,480" fill="#1f2a44"/>
        <polyline points="110,895 90,860 110,870 130,860" fill="#1f2a44"/>
        <text x="74" y="670" transform="rotate(-90,74,670)" textAnchor="middle"
              fontFamily="Inter, Arial, Helvetica, sans-serif" fontSize="56" fontWeight="900" fill="#1f2a44">
          Height
        </text>
      </g>

      {/* Weight（不越界） */}
      <ellipse cx="360" cy="910" rx="140" ry="24" fill="#9cc7eb" opacity="0.5"/>
      <text x="360" y="950" textAnchor="middle"
            fontFamily="Inter, Arial, Helvetica, sans-serif" fontSize="58" fontWeight="900" fill="#1f2a44">
        Weight
      </text>
    </svg>
  );
};

export default BmiCard;
