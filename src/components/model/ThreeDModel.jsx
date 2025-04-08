import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
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

const KeyboardPart = ({
  modelPath,
  index,
  animationProgress,
  scale,
  partType,
  size,
  visible = true,
  color = null,
}) => {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();
  const isTopCase = modelPath.includes("5.TopCase.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // 모든 메시에 대해 그림자를 받을 수 있게 하되
        // 측면과 뒤쪽 그림자를 제거하기 위해 조명 설정으로 제어
        child.receiveShadow = true;

        // 그림자 캐스팅은 일부 부품만 수행
        // 상단 케이스는 그림자를 드리우지 않음
        if (isTopCase) {
          child.castShadow = false;
        } else {
          // 나머지 부품은 위에서 아래로만 그림자를 드리우도록 설정
          child.castShadow = true;
        }

        // 색상 적용 (기존과 동일)
        if (isTopCase && color) {
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
  }, [scene, color, isTopCase]);

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
        const initialPos = KEYBOARD_POSITIONS.getInitialPosition(
          size,
          partType
        );
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

  return visible ? (
    <primitive ref={modelRef} object={scene} scale={scale} />
  ) : null;
};

const ScreenshotHandler = forwardRef(({ children }, ref) => {
  const { gl, scene, camera } = useThree();

  useImperativeHandle(ref, () => ({
    takeScreenshot: () => {
      const originalPosition = camera.position.clone();
      const originalRotation = camera.rotation.clone();

      camera.position.set(0, 9, 12);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
      gl.render(scene, camera);

      const dataURL = gl.domElement.toDataURL("image/png");

      camera.position.copy(originalPosition);
      camera.rotation.copy(originalRotation);
      gl.render(scene, camera);

      return dataURL;
    },
  }));

  return <>{children}</>;
});

// 기본 OrbitControls 컴포넌트로 대체
const SimpleOrbitControls = () => {
  return (
    <OrbitControls
      enableZoom={true}
      minDistance={6}
      maxDistance={20}
      zoomSpeed={0.3}
      maxPolarAngle={Math.PI / 2}
      rotateSpeed={0.5}
    />
  );
};

const Model = ({ size, selectedModel, baseColor }) => {
  const [baseAnimationProgress, setBaseAnimationProgress] = useState(0);
  const [switchAnimationProgress, setSwitchAnimationProgress] = useState(0);
  const [keycapAnimationProgress, setKeycapAnimationProgress] = useState(0);
  const [showSwitch, setShowSwitch] = useState(false);
  const [showKeycap, setShowKeycap] = useState(false);
  const groupRef = useRef();
  const scale = KEYBOARD_POSITIONS.getScale(size);

  const baseAnimationExecuted = useRef(false);
  const switchAnimationExecuted = useRef({});
  const keycapAnimationExecuted = useRef({});

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
      if (switchAnimationExecuted.current[size]) {
        setSwitchAnimationProgress(1);
        return;
      }

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
      if (keycapAnimationExecuted.current[size]) {
        setKeycapAnimationProgress(1);
        return;
      }

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
          color={path.includes("5.TopCase.glb") ? baseColor : null}
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

// 추가: 그림자 제한 영역 헬퍼 함수 컴포넌트
const ShadowLimiter = () => {
  const { scene } = useThree();

  useEffect(() => {
    // Three.js에서 제공하는 모든 조명에 그림자 제한 설정
    scene.traverse((object) => {
      if (object.isLight && object.shadow) {
        // 그림자 방향 제한 - 거의 수직 방향으로만 그림자가 생성되도록 설정
        object.shadow.camera.near = 1;
        object.shadow.camera.far = 20;

        // 그림자 맵 해상도 최적화
        object.shadow.mapSize.width = 2048;
        object.shadow.mapSize.height = 2048;

        // 그림자 블러 감소 - 더 선명한 그림자
        object.shadow.radius = 1;

        // 바이어스 값 조정으로 그림자 아티팩트 방지
        object.shadow.bias = -0.001;
      }
    });
  }, [scene]);

  return null;
};

export const ThreeDModel = forwardRef(
  ({ size, selectedModel, baseColor }, ref) => {
    const { size: urlSize } = useParams();
    const keyboardSize = size || urlSize || "100";
    const validSize = ["60", "80", "100"].includes(keyboardSize)
      ? keyboardSize
      : "100";
    const screenshotRef = useRef();

    useImperativeHandle(ref, () => ({
      getScreenshot: () => {
        if (screenshotRef.current) {
          return screenshotRef.current.takeScreenshot();
        }
        return null;
      },
    }));

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
            <ambientLight intensity={2.2} />
            <directionalLight
              position={[0, 20, 0]}
              intensity={5.0}
              castShadow
              shadow-camera-left={-5}
              shadow-camera-right={5}
              shadow-camera-top={5}
              shadow-camera-bottom={-5}
              //shadow-bias={-0.001}
            />

            <directionalLight
              position={[5, 5, 5]}
              intensity={2.0}
              castShadow={false}
            />

            <directionalLight
              position={[-5, 5, 5]}
              intensity={2.0}
              castShadow={false}
            />

            <directionalLight
              position={[0, 5, -5]}
              intensity={1.5}
              castShadow={false}
            />

            <SimpleOrbitControls />
            <Model
              size={validSize}
              selectedModel={selectedModel}
              baseColor={baseColor}
            />
          </ScreenshotHandler>
        </Canvas>
      </Container>
    );
  }
);