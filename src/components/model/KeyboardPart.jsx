import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { KEYBOARD_POSITIONS } from "../../data/keyboardPositions";

export const KeyboardPart = ({
  modelPath,
  index,
  animationProgress,
  scale,
  partType,
  size,
  visible = true,
  color = null,
  centerOffset,
}) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();
  const isTopCase = modelPath.includes("5.TopCase.glb");
  const isTopSwitch = modelPath.includes("TopSwitchs.glb");
  const isBottomSwitch = modelPath.includes("BottomSwitchs.glb");
  const isKeycap = partType === "keycap";
  
  // LED 색상 설정 (원하는 색상으로 변경 가능)
  const ledColor = new THREE.Color("#00ffff"); // 청록색 LED
  const ledIntensity = 0.8;

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
  
        if (isTopCase) {
          child.castShadow = false;
        } else {
          child.castShadow = true;
        }
  
        // BottomSwitch에 LED 효과 적용
        if (isBottomSwitch) {
          const originalMaterial = child.material;
          child.material = new THREE.MeshStandardMaterial({
            color: originalMaterial.color || new THREE.Color("#ffffff"),
            roughness: 0.2,
            metalness: 0.6,
            emissive: ledColor,
            emissiveIntensity: ledIntensity,
          });
        }
        // 다른 파트에 색상 적용 (기존 로직)
        else if ((isTopCase || isTopSwitch || isKeycap) && color) {
          const originalMaterial = child.material;
          const newMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: originalMaterial?.roughness ?? 0.5,
            metalness: originalMaterial?.metalness ?? 0.3,
          });
          child.material = newMaterial;
        }
      }
    });
  
    // 중심점 계산
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
  
    // 중심점을 원점으로 맞추기
    scene.position.sub(center);
  }, [scene, color, isTopCase, isTopSwitch, isBottomSwitch, isKeycap]);

  useFrame(() => {
    if (modelRef.current) {
      if (partType === "base") {
        const initialPos = KEYBOARD_POSITIONS.getInitialPosition(
          size,
          partType,
          index
        );
        const finalPos = KEYBOARD_POSITIONS.getFinalPosition(
          size,
          partType,
          index
        );

        // 중심점 오프셋 적용
        modelRef.current.position.x = THREE.MathUtils.lerp(
          initialPos[0],
          finalPos[0],
          animationProgress
        ) + centerOffset.x;
        
        modelRef.current.position.y = THREE.MathUtils.lerp(
          initialPos[1],
          finalPos[1],
          animationProgress
        ) + centerOffset.y;
        
        modelRef.current.position.z = THREE.MathUtils.lerp(
          initialPos[2],
          finalPos[2],
          animationProgress
        ) + centerOffset.z;
      } else {
        const initialPos = KEYBOARD_POSITIONS.getInitialPosition(
          size,
          partType,
          index
        );
        const finalPos = KEYBOARD_POSITIONS.getFinalPosition(
          size, 
          partType,
          index
        );

        // 중심점 오프셋 적용
        modelRef.current.position.x = initialPos[0] + centerOffset.x;
        modelRef.current.position.y = THREE.MathUtils.lerp(
          initialPos[1],
          finalPos[1],
          animationProgress
        ) + centerOffset.y;
        modelRef.current.position.z = initialPos[2] + centerOffset.z;
      }
    }
  });

  return visible ? (
    <primitive ref={modelRef} object={scene} scale={scale} />
  ) : null;
};

// LED 발광 효과를 위한 컴포넌트
export const LEDEffects = () => {
  return null; // ThreeDModel에 직접 EffectComposer 추가
};