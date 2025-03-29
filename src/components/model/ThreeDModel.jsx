import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { KEYBOARD_POSITIONS } from "../../data/keyboardPositions";
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