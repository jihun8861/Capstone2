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
  meshRef,
  ledEnabled = false,
  keycapColors = {},
  keycapIndex = null,
  resetTrigger = 0 // 리셋 트리거 추가
}) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();
  const originalMaterialsRef = useRef(new Map()); // 원본 재질 저장
  const isTopCase = modelPath.includes("5.TopCase.glb");
  const isTopSwitch = modelPath.includes("TopSwitchs.glb");
  const isPCB = modelPath.includes("2.PCB.glb");
  const isKeycap = partType === "keycap";
  
  // LED 색상 설정
  const ledColor = new THREE.Color("#FFFFFF");
  const ledIntensity = 10;
  const ledMaterialRef = useRef(null);

  // 키캡 ID 추출 함수 (파일명에서)
  const getKeycapId = () => {
    if (!isKeycap) return null;
    const match = modelPath.match(/\/([^\/]+)\.glb$/);
    return match ? match[1] : null;
  };

  // 키캡 색상 매핑 함수 개선
  const getKeycapColor = () => {
    if (!isKeycap || !keycapColors || Object.keys(keycapColors).length === 0) {
      return null; // 기본 색상 사용하지 않고 null 반환
    }

    const keycapId = getKeycapId();
    
    // 1. keycapId로 직접 찾기
    if (keycapId && keycapColors[keycapId]) {
      return keycapColors[keycapId];
    }

    // 2. keycapIndex로 찾기
    if (keycapIndex !== null) {
      const keycapKey = `keycap_${keycapIndex}`;
      if (keycapColors[keycapKey]) {
        return keycapColors[keycapKey];
      }
    }

    // 3. index로 찾기
    if (index !== undefined) {
      const keycapKey = `keycap_${index}`;
      if (keycapColors[keycapKey]) {
        return keycapColors[keycapKey];
      }
    }

    return null; // 색상을 찾지 못하면 null 반환
  };

  // 원본 재질 저장 함수
  const saveOriginalMaterials = (scene) => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        originalMaterialsRef.current.set(child.uuid, child.material.clone());
      }
    });
  };

  // 재질 초기화 함수
  const resetMaterials = (scene) => {
    scene.traverse((child) => {
      if (child.isMesh && originalMaterialsRef.current.has(child.uuid)) {
        const originalMaterial = originalMaterialsRef.current.get(child.uuid);
        child.material = originalMaterial.clone();
      }
    });
  };

  // 재질 적용 함수
  const applyMaterial = (child, newColor, materialType = 'standard') => {
    const originalMaterial = originalMaterialsRef.current.get(child.uuid) || child.material;
    
    if (materialType === 'pcb') {
      const newMaterial = new THREE.MeshStandardMaterial({
        color: originalMaterial.color || new THREE.Color("#ffffff"),
        roughness: 0.2,
        metalness: 0.6,
        emissive: ledEnabled ? ledColor : new THREE.Color("#000000"),
        emissiveIntensity: ledEnabled ? ledIntensity : 0,
      });
      child.material = newMaterial;
      ledMaterialRef.current = newMaterial;
    } else {
      const newMaterial = new THREE.MeshStandardMaterial({
        color: newColor ? new THREE.Color(newColor) : (originalMaterial.color || new THREE.Color("#ffffff")),
        roughness: originalMaterial?.roughness ?? 0.5,
        metalness: originalMaterial?.metalness ?? 0.3,
      });
      child.material = newMaterial;
    }
  };

  // 초기 설정 및 원본 재질 저장
  useEffect(() => {
    // 원본 재질 저장
    saveOriginalMaterials(scene);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.castShadow = !isTopCase;

        if (meshRef && isPCB) {
          meshRef.current = child;
        }
      }
    });

    // 중심점 계산 및 설정
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);
  }, [scene, meshRef, isPCB, isTopCase]);

  // 리셋 트리거 감지 시 재질 초기화
  useEffect(() => {
    if (resetTrigger > 0) {
      console.log(`키캡 ${getKeycapId()} 재질 초기화됨`);
      resetMaterials(scene);
    }
  }, [resetTrigger, scene]);

  // 색상 적용 효과
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // PCB LED 효과
        if (isPCB) {
          applyMaterial(child, null, 'pcb');
        }
        // 키캡 색상 적용
        else if (isKeycap) {
          const keycapColor = getKeycapColor();
          console.log(`키캡 ${getKeycapId()} 색상 적용:`, keycapColor);
          
          if (keycapColor) {
            applyMaterial(child, keycapColor);
          } else {
            // 색상이 없으면 원본 재질로 복원
            const originalMaterial = originalMaterialsRef.current.get(child.uuid);
            if (originalMaterial) {
              child.material = originalMaterial.clone();
            }
          }
        }
        // 다른 파트 색상 적용
        else if ((isTopCase || isTopSwitch) && color) {
          applyMaterial(child, color);
        }
      }
    });
  }, [scene, color, isTopCase, isTopSwitch, isPCB, isKeycap, keycapColors, index, keycapIndex, ledEnabled]);

  // LED 상태 변경 시 업데이트
  useEffect(() => {
    if (isPCB && ledMaterialRef.current) {
      ledMaterialRef.current.emissive = ledEnabled ? ledColor : new THREE.Color("#000000");
      ledMaterialRef.current.emissiveIntensity = ledEnabled ? ledIntensity : 0;
    }
  }, [ledEnabled, isPCB]);

  // LED 펄스 효과
  useFrame(({ clock }) => {
    if (isPCB && ledMaterialRef.current && ledEnabled) {
      const pulseFactor = 0.2 * Math.sin(clock.getElapsedTime() * 2) + 0.8;
      ledMaterialRef.current.emissiveIntensity = ledIntensity * pulseFactor;
    }
  });

  // 애니메이션 프레임
  useFrame(() => {
    if (modelRef.current) {
      if (partType === "base") {
        const initialPos = KEYBOARD_POSITIONS.getInitialPosition(size, partType, index);
        const finalPos = KEYBOARD_POSITIONS.getFinalPosition(size, partType, index);

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
        const initialPos = KEYBOARD_POSITIONS.getInitialPosition(size, partType, index);
        const finalPos = KEYBOARD_POSITIONS.getFinalPosition(size, partType, index);

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