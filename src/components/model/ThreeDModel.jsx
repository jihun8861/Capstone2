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

const MODEL_SCALES = {
  "60": 28,
  "80": 26,
  "100": 25,
};

const INITIAL_POSITIONS = {
  base: [
    [-1.5, 0, 0],
    [-1.5, 1, 0],
    [-1.5, 2, 0],
    [-1.5, 3, 0],
    [-1.5, 4, 0],
    [-1.5, 5, 0],
  ],
  switch: [-1.5, 5, 0],
  keycap: [-1.5, 5, 0],
};

const FINAL_POSITIONS = {
  base: [
    [-1.5, 0, 0],
    [-1.5, 0, 0],
    [-1.5, 0, 0],
    [-1.5, 0, 0],
    [-1.5, 0, 0],
    [-1.5, 0, 0],
  ],
  switch: [-1.5, 0, 0],
  keycap: [-1.5, 0, 0],
};

const KeyboardPart = ({ modelPath, index, animationProgress, scale, partType, visible = true }) => {
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
        const initialPos = INITIAL_POSITIONS.base[index];
        const finalPos = FINAL_POSITIONS.base[index];

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
        const initialPos = INITIAL_POSITIONS[partType];
        const finalPos = FINAL_POSITIONS[partType];

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

const Model = ({ size, selectedModel }) => {
  const [baseAnimationProgress, setBaseAnimationProgress] = useState(0);
  const [switchAnimationProgress, setSwitchAnimationProgress] = useState(0);
  const [keycapAnimationProgress, setKeycapAnimationProgress] = useState(0);
  const [showSwitch, setShowSwitch] = useState(false);
  const [showKeycap, setShowKeycap] = useState(false);
  const groupRef = useRef();
  const scale = MODEL_SCALES[size] || 25;

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
    if (selectedModel === "switch") {
      setShowSwitch(true);
      setShowKeycap(false);
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
    } else if (selectedModel === "keycap") {
      setShowKeycap(true);
      setShowSwitch(false);
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
    } else if (selectedModel === null || selectedModel === undefined) {
      setShowSwitch(false);
      setShowKeycap(false);
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
        />
      ))}

      {showSwitch && (
        <KeyboardPart
          key="switches"
          modelPath={SWITCH_MODEL_PATH}
          animationProgress={switchAnimationProgress}
          scale={scale}
          partType="switch"
        />
      )}

      {showKeycap && (
        <KeyboardPart
          key="keycaps"
          modelPath={KEYCAP_MODEL_PATH}
          animationProgress={keycapAnimationProgress}
          scale={scale}
          partType="keycap"
        />
      )}
    </group>
  );
};

export const ThreeDModel = ({ size, selectedModel }) => {
  const { size: urlSize } = useParams();
  const keyboardSize = size || urlSize || "100";
  
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
          zoomSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
        <Model size={validSize} selectedModel={selectedModel} />
      </Canvas>
    </Container>
  );
};