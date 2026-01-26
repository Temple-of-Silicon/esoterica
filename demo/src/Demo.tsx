import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { WizardFlow } from "./WizardFlow";
import { COLORS, FONTS } from "./styles";

export const Demo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.terminalBg }}>
      {/* Sequence 1: Title flash (0-90 frames = 0-3s) */}
      <Sequence from={0} durationInFrames={90}>
        <TitleFlash />
      </Sequence>

      {/* Sequence 2: Card draw animation (90-540 frames = 3-18s) */}
      <Sequence from={90} durationInFrames={450}>
        <WizardFlow scene="cards" />
      </Sequence>

      {/* Sequence 3: Interpretation text (540-1050 frames = 18-35s) */}
      <Sequence from={540} durationInFrames={510}>
        <WizardFlow scene="interpretation" />
      </Sequence>

      {/* Sequence 4: Terminal with install command (1050-1500 frames = 35-50s) */}
      <Sequence from={1050} durationInFrames={450}>
        <WizardFlow scene="install" />
      </Sequence>

      {/* Sequence 5: End card (1500-1800 frames = 50-60s) */}
      <Sequence from={1500} durationInFrames={300}>
        <WizardFlow scene="endcard" />
      </Sequence>
    </AbsoluteFill>
  );
};

const TitleFlash: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, 15, 75, 90],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );

  const scale = interpolate(
    frame,
    [0, 15],
    [0.9, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.terminalBg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <h1
          style={{
            fontFamily: FONTS.heading,
            fontSize: "120px",
            color: COLORS.primary,
            margin: 0,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Esoterica
        </h1>
        <p
          style={{
            fontFamily: FONTS.mono,
            fontSize: "32px",
            color: COLORS.accent,
            margin: "20px 0 0 0",
            textAlign: "center",
          }}
        >
          Tarot for AI agents
        </p>
      </div>
    </AbsoluteFill>
  );
};
