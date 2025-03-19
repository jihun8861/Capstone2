import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Define the model components
const MODEL_PATHS = [
  "/keyboard/100keyboard/1.BottomCase.glb",
  "/keyboard/100keyboard/2.PCB.glb",
  "/keyboard/100keyboard/3.Plate.glb",
  "/keyboard/100keyboard/4.Screw.glb",
  "/keyboard/100keyboard/5.TopCase.glb",
  "/keyboard/100keyboard/6.Stabilizers.glb",
];

// Initial positions for each component (slightly separated)
const INITIAL_POSITIONS = [
  [0, 0, 0],    // BottomCase
  [0, 1, 0],    // PCB
  [0, 2, 0],    // Plate
  [0, 3, 0],     // Screw
  [0, 4, 0],     // TopCase
  [0, 5, 0],    // Stabilizers
];

// Final positions for each component (assembled)
const FINAL_POSITIONS = [
  [0, 0, 0],  // BottomCase
  [0, 0, 0],     // PCB
  [0, 0, 0],   // Plate
  [0, 0, 0],  // Screw
  [0, 0, 0],   // TopCase
  [0, 0, 0],  // Stabilizers
];

const KeyboardPart = ({ index, animationProgress }) => {
  const { scene } = useGLTF(MODEL_PATHS[index]);
  const modelRef = useRef();
  
  // Set up shadows
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  // Animation logic
  useFrame(() => {
    if (modelRef.current) {
      // Interpolate position based on animation progress
      const initialPos = INITIAL_POSITIONS[index];
      const finalPos = FINAL_POSITIONS[index];
      
      modelRef.current.position.x = THREE.MathUtils.lerp(initialPos[0], finalPos[0], animationProgress);
      modelRef.current.position.y = THREE.MathUtils.lerp(initialPos[1], finalPos[1], animationProgress);
      modelRef.current.position.z = THREE.MathUtils.lerp(initialPos[2], finalPos[2], animationProgress);
      
      // Add slight rotation during animation
      if (animationProgress < 1) {
        modelRef.current.rotation.y = Math.sin(animationProgress * Math.PI * 2) * 0.2;
      } else {
        modelRef.current.rotation.y = 0;
      }
    }
  });

  return <primitive ref={modelRef} object={scene} scale={25} />;
};

const Model = () => {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Animation effect
  useEffect(() => {
    const animateParts = () => {
      const duration = 3000; // 5 seconds for full animation
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
    
    // Start animation after a short delay
    const timer = setTimeout(animateParts, 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <group position={[-3, 0, 0]}>
      {MODEL_PATHS.map((_, index) => (
        <KeyboardPart 
          key={index} 
          index={index} 
          animationProgress={animationProgress} 
        />
      ))}
    </group>
  );
};

export const ThreeDModel = () => {
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

        <pointLight position={[-5, 5, 5]} intensity={0.8} />

        <OrbitControls
          enableZoom={false}
          minDistance={10}
          maxDistance={16}
          zoomSpeed={0.25}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.4}
        />
        <Model />
      </Canvas>
    </Container>
  );
};