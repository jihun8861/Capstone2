import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Canvas, useFrame } from "@react-three/fiber";
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

// 모델 크기별 스케일 조정
const MODEL_SCALES = {
  "60": 28,
  "80": 26,
  "100": 25,
};

// 초기 위치를 더 왼쪽으로 설정 (x값을 더 작게)
const INITIAL_POSITIONS = [
  [-1.5, 0, 0], // BottomCase
  [-1.5, 1, 0], // PCB
  [-1.5, 2, 0], // Plate
  [-1.5, 3, 0], // Screw
  [-1.5, 4, 0], // TopCase
  [-1.5, 5, 0], // Stabilizers
];

// 최종 위치도 왼쪽으로 설정
const FINAL_POSITIONS = [
  [-1.5, 0, 0], // BottomCase
  [-1.5, 0, 0], // PCB
  [-1.5, 0, 0], // Plate
  [-1.5, 0, 0], // Screw
  [-1.5, 0, 0], // TopCase
  [-1.5, 0, 0], // Stabilizers
];

const KeyboardPart = ({ modelPath, index, animationProgress, scale }) => {
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
      const initialPos = INITIAL_POSITIONS[index];
      const finalPos = FINAL_POSITIONS[index];

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
    }
  });

  return <primitive ref={modelRef} object={scene} scale={scale} />;
};

const Model = ({ size }) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const groupRef = useRef();
  const scale = MODEL_SCALES[size] || 25;

  const MODEL_PATHS = [
    `/keyboard/${size}keyboard/1.BottomCase.glb`,
    `/keyboard/${size}keyboard/2.PCB.glb`,
    `/keyboard/${size}keyboard/3.Plate.glb`,
    `/keyboard/${size}keyboard/4.Screw.glb`,
    `/keyboard/${size}keyboard/5.TopCase.glb`,
    `/keyboard/${size}keyboard/6.Stabilizers.glb`,
  ];

  useEffect(() => {
    const animateParts = () => {
      const duration = 2000;
      const startTime = Date.now();

      const updateAnimation = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setAnimationProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(updateAnimation);
        }
      };

      requestAnimationFrame(updateAnimation);
    };

    const timer = setTimeout(animateParts, 500);
    return () => clearTimeout(timer);
  }, [size]);

  return (
    <group ref={groupRef}>
      {MODEL_PATHS.map((path, index) => (
        <KeyboardPart
          key={index}
          modelPath={path}
          index={index}
          animationProgress={animationProgress}
          scale={scale}
        />
      ))}
    </group>
  );
};

export const ThreeDModel = () => {
  const { size } = useParams();
  const keyboardSize = size || "100";
  
  const validSize = ["60", "80", "100"].includes(keyboardSize) ? keyboardSize : "100";

  return (
    <Container>
      <Canvas
        shadows
        camera={{
          position: [0, 5, 12],
          fov: 40,
        }}
      >
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
          zoomSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
        <Model size={validSize} />
      </Canvas>
    </Container>
  );
};