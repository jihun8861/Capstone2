import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import styled from "styled-components";
import { KEYBOARD_POSITIONS } from "../../data/keyboardPositions";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useParams } from "react-router-dom";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const KeyboardPart = ({ modelPath, index, animationProgress, scale, partType, size, visible = true }) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (modelRef.current) {
      if (partType === "base") {
        const initialPos = KEYBOARD_POSITIONS.getInitialPosition(size, partType, index);
        const finalPos = KEYBOARD_POSITIONS.getFinalPosition(size, partType, index);

        modelRef.current.position.x = THREE.MathUtils.lerp(
          initialPos[0],
          finalPos[0],
          animationProgress
        );
        modelRef.current.position.y = THREE.MathUtils.lerp(
          initialPos[1],
          finalPos[1],
          animationProgress
        );
        modelRef.current.position.z = THREE.MathUtils.lerp(
          initialPos[2],
          finalPos[2],
          animationProgress
        );
      } else {
        const initialPos = KEYBOARD_POSITIONS.getInitialPosition(size, partType);
        const finalPos = KEYBOARD_POSITIONS.getFinalPosition(size, partType);

        modelRef.current.position.x = initialPos[0];
        modelRef.current.position.y = THREE.MathUtils.lerp(
          initialPos[1],
          finalPos[1],
          animationProgress
        );
        modelRef.current.position.z = initialPos[2];
      }
    }
  });

  return visible ? <primitive ref={modelRef} object={scene} scale={scale} /> : null;
};

// 스크린샷 핸들러 컴포넌트 추가
const ScreenshotHandler = forwardRef(({ children }, ref) => {
  const { gl, scene, camera } = useThree();
  
  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      // 현재 카메라의 위치와 회전 값을 저장
      const originalPosition = camera.position.clone();
      const originalRotation = camera.rotation.clone();

      // 카메라를 기본 정면 위치로 설정
      camera.position.set(0, 9, 12);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      gl.render(scene, camera);

      // 캔버스에서 데이터 URL 추출
      const dataURL = gl.domElement.toDataURL('image/png');

      // 원래 카메라 위치 및 회전으로 복귀
      camera.position.copy(originalPosition);
      camera.rotation.copy(originalRotation);
      gl.render(scene, camera);

      return dataURL;
    }
  }));

  return <>{children}</>;
});

// 키보드 중심점 계산을 위한 컴포넌트
const KeyboardCenter = ({ size, onCenterCalculated }) => {
  const { scene } = useThree();
  
  useEffect(() => {
    // 키보드 모델의 중심점을 계산하기 위한 바운딩 박스 생성
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    if (onCenterCalculated) {
      onCenterCalculated(center);
    }
  }, [scene, size, onCenterCalculated]);
  
  return null;
};

// OrbitControls를 커스터마이징한 컴포넌트
const CenteredOrbitControls = ({ target }) => {
  const controlsRef = useRef();
  
  useEffect(() => {
    if (controlsRef.current && target) {
      // 오빗 컨트롤의 타겟을 키보드 중심으로 설정
      controlsRef.current.target.copy(target);
      controlsRef.current.update();
    }
  }, [target]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={true}
      minDistance={6}
      maxDistance={20}
      zoomSpeed={0.3}
      maxPolarAngle={Math.PI / 2}
      rotateSpeed={0.5}
    />
  );
};

const Model = ({ size, selectedModel, onCenterCalculated }) => {
  const [baseAnimationProgress, setBaseAnimationProgress] = useState(0);
  const [switchAnimationProgress, setSwitchAnimationProgress] = useState(0);
  const [keycapAnimationProgress, setKeycapAnimationProgress] = useState(0);
  const [showSwitch, setShowSwitch] = useState(false);
  const [showKeycap, setShowKeycap] = useState(false);
  const groupRef = useRef();
  const scale = KEYBOARD_POSITIONS.getScale(size);
  
  // 애니메이션 상태 추적을 위한 ref
  const baseAnimationExecuted = useRef(false);
  const switchAnimationExecuted = useRef({});
  const keycapAnimationExecuted = useRef({});
  
  // size가 바뀌면 애니메이션 초기화
  useEffect(() => {
    baseAnimationExecuted.current = false;
    switchAnimationExecuted.current = {};
    keycapAnimationExecuted.current = {};
    setBaseAnimationProgress(0);
    setSwitchAnimationProgress(0);
    setKeycapAnimationProgress(0);
    setShowSwitch(false);
    setShowKeycap(false);
  }, [size]);

  const BASE_MODEL_PATHS = [
    `/keyboard/${size}keyboard/1.BottomCase.glb`,
    `/keyboard/${size}keyboard/2.PCB.glb`,
    `/keyboard/${size}keyboard/3.Plate.glb`,
    `/keyboard/${size}keyboard/4.Screw.glb`,
    `/keyboard/${size}keyboard/5.TopCase.glb`,
    `/keyboard/${size}keyboard/6.Stabilizers.glb`,
  ];

  const SWITCH_MODEL_PATH = `/keyboard/${size}keyboard/${size}Switchs.glb`;
  const KEYCAP_MODEL_PATH = `/keyboard/${size}keyboard/${size}Keycaps.glb`;

  useEffect(() => {
    // 이미 실행된 애니메이션은 재실행하지 않음
    if (baseAnimationExecuted.current) return;
    
    const animateBaseParts = () => {
      baseAnimationExecuted.current = true;
      const duration = 2000;
      const startTime = Date.now();

      const updateAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setBaseAnimationProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(updateAnimation);
        } else {
          // 애니메이션 완료 후 모델의 중심점을 계산
          if (groupRef.current) {
            const box = new THREE.Box3().setFromObject(groupRef.current);
            const center = new THREE.Vector3();
            box.getCenter(center);
            
            if (onCenterCalculated) {
              onCenterCalculated(center);
            }
          }
        }
      };

      requestAnimationFrame(updateAnimation);
    };

    const timer = setTimeout(animateBaseParts, 500);
    return () => clearTimeout(timer);
  }, [size, onCenterCalculated]);

  useEffect(() => {
    if (selectedModel === "switch" && !showSwitch) {
      setShowSwitch(true);
      
      // 이미 실행된 스위치 애니메이션은 재실행하지 않음
      if (switchAnimationExecuted.current[size]) {
        setSwitchAnimationProgress(1); // 바로 최종 상태로 설정
        return;
      }
      
      setSwitchAnimationProgress(0);
  
      setTimeout(() => {
        const duration = 1500;
        const startTime = Date.now();
  
        const updateAnimation = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
  
          setSwitchAnimationProgress(progress);
  
          if (progress < 1) {
            requestAnimationFrame(updateAnimation);
          } else {
            switchAnimationExecuted.current[size] = true;
          }
        };
  
        requestAnimationFrame(updateAnimation);
      }, 100);
    } else if (selectedModel === "keycap" && !showKeycap) {
      setShowKeycap(true);
      
      // 이미 실행된 키캡 애니메이션은 재실행하지 않음
      if (keycapAnimationExecuted.current[size]) {
        setKeycapAnimationProgress(1); // 바로 최종 상태로 설정
        return;
      }
      
      setKeycapAnimationProgress(0);
  
      setTimeout(() => {
        const duration = 1500;
        const startTime = Date.now();
  
        const updateAnimation = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
  
          setKeycapAnimationProgress(progress);
  
          if (progress < 1) {
            requestAnimationFrame(updateAnimation);
          } else {
            keycapAnimationExecuted.current[size] = true;
          }
        };
  
        requestAnimationFrame(updateAnimation);
      }, 100);
    }
  }, [selectedModel, size, showSwitch, showKeycap]);
  
  return (
    <group ref={groupRef}>
      {BASE_MODEL_PATHS.map((path, index) => (
        <KeyboardPart
          key={`base-${index}`}
          modelPath={path}
          index={index}
          animationProgress={baseAnimationProgress}
          scale={scale}
          partType="base"
          size={size}
        />
      ))}

      {showSwitch && (
        <KeyboardPart
          key="switches"
          modelPath={SWITCH_MODEL_PATH}
          animationProgress={switchAnimationProgress}
          scale={scale}
          partType="switch"
          size={size}
        />
      )}

      {showKeycap && (
        <KeyboardPart
          key="keycaps"
          modelPath={KEYCAP_MODEL_PATH}
          animationProgress={keycapAnimationProgress}
          scale={scale}
          partType="keycap"
          size={size}
        />
      )}
    </group>
  );
};

export const ThreeDModel = forwardRef(({ size, selectedModel }, ref) => {
  const { size: urlSize } = useParams();
  const keyboardSize = size || urlSize || "100";
  const validSize = ["60", "80", "100"].includes(keyboardSize) ? keyboardSize : "100";
  const screenshotRef = useRef();
  const [keyboardCenter, setKeyboardCenter] = useState(new THREE.Vector3(0, 0, 0));
  
  // 부모 컴포넌트에서 스크린샷을 가져올 수 있는 함수 노출
  useImperativeHandle(ref, () => ({
    getScreenshot: () => {
      if (screenshotRef.current) {
        return screenshotRef.current.takeScreenshot();
      }
      return null;
    }
  }));

  // useCallback을 사용하여 함수 메모이제이션
  const handleCenterCalculated = useCallback((center) => {
    setKeyboardCenter(center);
  }, []);

  return (
    <Container>
      <Canvas
        shadows
        camera={{
          position: [0, 7, 12],
          fov: 40,
        }}
      >
        <ScreenshotHandler ref={screenshotRef}>
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-near={0.5}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          <pointLight position={[-5, 5, 5]} intensity={0.8} castShadow />

          {/* 중심점 기준 회전을 위한 커스텀 OrbitControls */}
          <CenteredOrbitControls target={keyboardCenter} />
          
          <Model 
            size={validSize} 
            selectedModel={selectedModel} 
            onCenterCalculated={handleCenterCalculated}
          />
        </ScreenshotHandler>
      </Canvas>
    </Container>
  );
});