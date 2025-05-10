import React, { forwardRef, useImperativeHandle } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// 스크린샷용 카메라 설정 - 중앙 정렬을 위해 카메라 타겟 수정
const SCREENSHOT_CAMERA_SETTINGS = {
  "60": { position: [-0.9, 9, 10], target: [-0.9, 0, 0] },
  "80": { position: [-1.2, 9, 11], target: [-1.2, 0, 0] },
  "100": { position: [-1.2, 9, 14], target: [-1.2, 0, 0] },
};

export const ScreenshotHandler = forwardRef(({ children, size }, ref) => {
  const { gl, scene, camera } = useThree();

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      // 기존 카메라 상태 저장
      const originalPosition = camera.position.clone();
      const originalRotation = camera.rotation.clone();
      const originalQuaternion = camera.quaternion.clone();

      // 스크린샷을 위한 카메라 위치 설정
      const screenshotSettings = SCREENSHOT_CAMERA_SETTINGS[size] || SCREENSHOT_CAMERA_SETTINGS["100"];
      
      // 카메라 위치 설정
      camera.position.set(...screenshotSettings.position);
      
      // 카메라가 모델의 중앙을 바라보도록 설정
      // centerOffset 값을 타겟에 적용하여 모델이 중앙에 보이도록 조정
      camera.lookAt(new THREE.Vector3(...screenshotSettings.target));
      
      // 렌더링
      gl.render(scene, camera);

      // 스크린샷 생성
      const dataURL = gl.domElement.toDataURL("image/png");

      // 카메라 원래 상태로 복원
      camera.position.copy(originalPosition);
      camera.quaternion.copy(originalQuaternion);
      camera.rotation.copy(originalRotation);
      
      // 복원 후 다시 렌더링
      gl.render(scene, camera);

      return dataURL;
    },
  }));

  return <>{children}</>;
});