import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export const KeyboardOrbitControls = ({ resetCamera, cameraSettings }) => {
  const controls = useRef();
  const { camera } = useThree();

  // 카메라 리셋 기능 추가
  useEffect(() => {
    if (resetCamera && controls.current) {
      // 카메라 위치 초기화
      if (cameraSettings && cameraSettings.position) {
        camera.position.set(...cameraSettings.position);
      } else {
        camera.position.set(0, 7, 12);
      }
      
      // 카메라 타겟 초기화
      if (cameraSettings && cameraSettings.target) {
        controls.current.target.set(...cameraSettings.target);
      } else {
        controls.current.target.set(0, 0, 0);
      }
      
      controls.current.update();
    }
  }, [resetCamera, cameraSettings, camera]);

  useEffect(() => {
    if (controls.current) {
      controls.current.target.set(0, 0, 0);
      controls.current.update();
    }
  }, []);

  return (
    <OrbitControls
      ref={controls}
      enableZoom={true}
      minDistance={6}
      maxDistance={20}
      zoomSpeed={0.3}
      maxPolarAngle={Math.PI / 2}
      rotateSpeed={0.5}
    />
  );
};