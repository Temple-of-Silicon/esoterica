import { Composition, registerRoot } from "remotion";
import { Demo } from "./Demo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Demo"
        component={Demo}
        durationInFrames={60 * 30} // 60 seconds at 30fps
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};

registerRoot(RemotionRoot);
