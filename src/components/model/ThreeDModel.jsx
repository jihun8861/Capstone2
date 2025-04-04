import React, { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
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

const Model = ({ size, selectedModel }) => {
  const [baseAnimationProgress, setBaseAnimationProgress] = useState(0);
  const [switchAnimationProgress, setSwitchAnimationProgress] = useState(0);
  const [keycapAnimationProgress, setKeycapAnimationProgress] = useState(0);
  const [showSwitch, setShowSwitch] = useState(false);
  const [showKeycap, setShowKeycap] = useState(false);
  const groupRef = useRef();
  const scale = KEYBOARD_POSITIONS.getScale(size);

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
    const animateBaseParts = () => {
      const duration = 2000;
      const startTime = Date.now();

      const updateAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setBaseAnimationProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(updateAnimation);
        }
      };

      requestAnimationFrame(updateAnimation);
    };

    const timer = setTimeout(animateBaseParts, 500);
    return () => clearTimeout(timer);
  }, [size]);

  useEffect(() => {
    if (selectedModel === "switch" && !showSwitch) {
      setShowSwitch(true);
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
          }
        };
  
        requestAnimationFrame(updateAnimation);
      }, 100);
    } else if (selectedModel === "keycap" && !showKeycap) {
      setShowKeycap(true);
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
          }
        };
  
        requestAnimationFrame(updateAnimation);
      }, 100);
    }
  }, [selectedModel]);
  
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
  
  // 부모 컴포넌트에서 스크린샷을 가져올 수 있는 함수 노출
  useImperativeHandle(ref, () => ({
    getScreenshot: () => {
      if (screenshotRef.current) {
        return screenshotRef.current.takeScreenshot();
      }
      return null;
    }
  }));

  return (
    <Container>
      <Canvas
        shadows
        camera={{
          position: [0, 7, 12],
          fov: 35,
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

          <OrbitControls
            enableZoom={true}
            minDistance={6}
            maxDistance={20}
            zoomSpeed={0.3}
            maxPolarAngle={Math.PI / 2}
            rotateSpeed={0.5}
          />
          <Model size={validSize} selectedModel={selectedModel} />
        </ScreenshotHandler>
      </Canvas>
    </Container>
  );
});