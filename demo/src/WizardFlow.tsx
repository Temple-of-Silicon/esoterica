import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, FONTS } from "./styles";

interface WizardFlowProps {
  scene: "install" | "cards" | "interpretation" | "endcard";
}

export const WizardFlow: React.FC<WizardFlowProps> = ({ scene }) => {
  const frame = useCurrentFrame();

  if (scene === "install") {
    // Show terminal with install command
    const commandOpacity = interpolate(frame, [0, 15], [0, 1], {
      extrapolateRight: "clamp",
    });

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: COLORS.terminalBg,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FONTS.mono,
          color: COLORS.textLight,
          padding: "80px",
        }}
      >
        <div style={{ maxWidth: "900px", width: "100%" }}>
          <div style={{ opacity: commandOpacity, fontSize: "32px", marginBottom: "40px" }}>
            <span style={{ color: COLORS.accent }}>$</span> npx @templeofsilicon/esoterica
          </div>
          <div style={{ opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: "clamp" }), fontSize: "32px" }}>
            <span style={{ color: COLORS.accent }}>$</span> esoterica draw
          </div>
        </div>
      </div>
    );
  }

  if (scene === "cards") {
    // Show three cards appearing one by one
    const cards = [
      "THE HIGH PRIESTESS",
      "THE CHARIOT",
      "THE HERMIT"
    ];

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: COLORS.terminalBg,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FONTS.mono,
          color: COLORS.textLight,
          padding: "80px",
        }}
      >
        <div style={{ maxWidth: "900px", width: "100%" }}>
          {/* Prompt */}
          <div style={{ fontSize: "28px", marginBottom: "60px", color: COLORS.accent }}>
            Draw how many cards? (1-10, default: 3)
          </div>

          {/* User input */}
          <div style={{
            fontSize: "28px",
            marginBottom: "60px",
            opacity: interpolate(frame, [10, 20], [0, 1], { extrapolateRight: "clamp" })
          }}>
            <span style={{ color: COLORS.accent }}>&gt;</span> 3
          </div>

          {/* Cards appearing */}
          <div style={{ fontSize: "48px", lineHeight: "1.6" }}>
            {cards.map((card, index) => {
              const startFrame = 30 + (index * 40);
              const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
                extrapolateRight: "clamp",
              });
              const y = interpolate(frame, [startFrame, startFrame + 20], [30, 0], {
                extrapolateRight: "clamp",
              });

              return (
                <div
                  key={card}
                  style={{
                    opacity,
                    transform: `translateY(${y}px)`,
                    color: COLORS.primary,
                    marginBottom: "24px",
                    fontWeight: 500,
                  }}
                >
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (scene === "interpretation") {
    // Show interpretation text with typewriter effect
    const interpretationText = `Your reading reveals a journey of inner wisdom and transformation.

THE HIGH PRIESTESS speaks to deep intuition and hidden knowledge.
Trust the whispers beneath the surface.

THE CHARIOT signals forward momentum through balanced determination.
Harness opposing forces toward a unified goal.

THE HERMIT illuminates the path of solitary reflection.
Sometimes withdrawal brings the greatest clarity.`;

    const charsToShow = Math.floor(interpolate(frame, [0, 300], [0, interpretationText.length], {
      extrapolateRight: "clamp",
    }));

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: COLORS.terminalBg,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: FONTS.mono,
          color: COLORS.textLight,
          padding: "80px",
        }}
      >
        <div style={{ maxWidth: "1000px", fontSize: "26px", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
          {interpretationText.substring(0, charsToShow)}
          <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0, color: COLORS.primary }}>▊</span>
        </div>
      </div>
    );
  }

  if (scene === "endcard") {
    // End card with tagline and install instructions
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: COLORS.background,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "80px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: FONTS.heading,
            fontSize: "72px",
            color: COLORS.secondary,
            marginBottom: "60px",
            fontWeight: 500,
          }}>
            Ancient patterns, new paths
          </h1>

          <div style={{
            fontFamily: FONTS.mono,
            fontSize: "36px",
            color: COLORS.darkBase,
            marginBottom: "40px",
            backgroundColor: COLORS.terminalBg,
            padding: "30px 50px",
            borderRadius: "8px",
            display: "inline-block",
          }}>
            <span style={{ color: COLORS.accent }}>$</span> <span style={{ color: COLORS.textLight }}>npm install -g esoterica</span>
          </div>

          <div style={{
            fontFamily: FONTS.mono,
            fontSize: "28px",
            color: COLORS.accent,
            marginTop: "40px",
          }}>
            jem-computer.github.io/esoterica
          </div>
        </div>
      </div>
    );
  }

  return null;
};
