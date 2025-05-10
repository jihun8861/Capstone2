import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export const ShadowLimiter = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.traverse((object) => {
      if (object.isLight && object.shadow) {
        object.shadow.camera.near = 1;
        object.shadow.camera.far = 20;
        object.shadow.mapSize.width = 2048;
        object.shadow.mapSize.height = 2048;
        object.shadow.radius = 1;
        object.shadow.bias = -0.001;
      }
    });
  }, [scene]);

  return null;
};