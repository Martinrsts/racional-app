export const Skeleton = ({ isReady }: { isReady: boolean }) => {
  return (
    <div
      className={`absolute inset-0 rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-opacity duration-700 ease-in-out ${isReady ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <svg
        viewBox="0 0 800 780"
        width="100%"
        height="100%"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient
            id="skel-shimmer"
            gradientUnits="userSpaceOnUse"
            x1="-400"
            y1="0"
            x2="0"
            y2="0"
          >
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#f1f5f9" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="0 0"
              to="1200 0"
              dur="1.8s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>

        {/* horizontal grid lines — 5 ticks */}
        {[172, 312, 452, 592, 732].map((y) => (
          <line
            key={y}
            x1={72}
            x2={776}
            y1={y}
            y2={y}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* y-axis label placeholders */}
        {[
          { y: 172, w: 44 },
          { y: 312, w: 52 },
          { y: 452, w: 44 },
          { y: 592, w: 48 },
          { y: 732, w: 40 },
        ].map(({ y, w }) => (
          <rect
            key={y}
            x={72 - w - 8}
            y={y - 6}
            width={w}
            height={12}
            rx={3}
            fill="url(#skel-shimmer)"
          />
        ))}

        {/* x-axis label placeholders — 8 ticks */}
        {[72, 160, 248, 336, 424, 512, 600, 688].map((x) => (
          <rect
            key={x}
            x={x - 20}
            y={748}
            width={40}
            height={10}
            rx={3}
            fill="url(#skel-shimmer)"
          />
        ))}

        {/* area fill */}
        <path
          d="M72,700 C100,695 150,688 200,670 C250,652 280,640 320,620 C360,600 380,590 420,560 C460,530 490,510 530,480 C570,450 600,430 640,400 C670,375 710,355 776,320 L776,732 L72,732 Z"
          fill="url(#skel-shimmer)"
          opacity="0.6"
        />

        {/* portfolio line on top of area */}
        <path
          d="M72,700 C100,695 150,688 200,670 C250,652 280,640 320,620 C360,600 380,590 420,560 C460,530 490,510 530,480 C570,450 600,430 640,400 C670,375 710,355 776,320"
          fill="none"
          stroke="url(#skel-shimmer)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* legend: Ganancia / Pérdida / Depósito */}
        <line
          x1={80}
          y1={24}
          x2={98}
          y2={24}
          stroke="url(#skel-shimmer)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x={106}
          y={17}
          width={78}
          height={14}
          rx={3}
          fill="url(#skel-shimmer)"
        />
        <line
          x1={200}
          y1={24}
          x2={218}
          y2={24}
          stroke="url(#skel-shimmer)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x={226}
          y={17}
          width={68}
          height={14}
          rx={3}
          fill="url(#skel-shimmer)"
        />
        <line
          x1={320}
          y1={24}
          x2={338}
          y2={24}
          stroke="url(#skel-shimmer)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect
          x={346}
          y={17}
          width={76}
          height={14}
          rx={3}
          fill="url(#skel-shimmer)"
        />
      </svg>
    </div>
  );
};
