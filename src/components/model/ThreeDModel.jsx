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

// 키보드 크기별 중심점 오프셋 정의
const KEYBOARD_CENTER_OFFSETS = {
  "60": { x: -0.9, y: 0, z: 0 },
  "80": { x: -1.2, y: 0, z: 0 },
  "100": { x: -1.5 , y: 0, z: 0 },
};

// 키보드 크기별 카메라 설정
const KEYBOARD_CAMERA_SETTINGS = {
  "60": { position: [0, 7, 10], target: [0, 0, 0] },
  "80": { position: [0, 7, 11], target: [0, 0, 0] },
  "100": { position: [0, 7, 14], target: [0, 0, 0] },
};

// 스크린샷용 카메라 설정 - 중앙 정렬을 위해 카메라 타겟 수정
const SCREENSHOT_CAMERA_SETTINGS = {
  "60": { position: [-0.9, 9, 10], target: [-0.9, 0, 0] },
  "80": { position: [-1.2, 9, 11], target: [-1.2, 0, 0] },
  "100": { position: [-1.2, 9, 14], target: [-1.2, 0, 0] },
};

// 키캡 ID 목록 정의 (키보드 크기별로 다르게 설정 가능)
const KEYCAP_IDS = {
  "60": [
    "keycap_Grave", "keycap_1", "keycap_2", "keycap_3", "keycap_4", "keycap_5", "keycap_6", "keycap_7", "keycap_8", "keycap_9", "keycap_0",
    "keycap_Minus", "keycap_Equals", "keycap_BackSpace",
  
    "keycap_Tab", "keycap_Q", "keycap_W", "keycap_E", "keycap_R", "keycap_T", "keycap_Y", "keycap_U", "keycap_I", "keycap_O", "keycap_P",
    "keycap_LeftBracket", "keycap_RightBracket", "keycap_ReverseSlash",
  
    "keycap_CapsLock", "keycap_A", "keycap_S", "keycap_D", "keycap_F", "keycap_G", "keycap_H", "keycap_J", "keycap_K", "keycap_L",
    "keycap_Semicolon", "keycap_Quote", "keycap_Enter",
  
    "keycap_LShift", "keycap_Z", "keycap_X", "keycap_C", "keycap_V", "keycap_B", "keycap_N", "keycap_M",
    "keycap_Comma", "keycap_Dot", "keycap_Slash", "keycap_RShift",
  
    "keycap_LCtrl", "keycap_Window", "keycap_LAlt", "keycap_Space", "keycap_RAlt", "keycap_Fn", "keycap_Menu", "keycap_RCtrl",

  ]
  ,
  "80": [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
    "ESC", "TAB", "CAPS", "SHIFT_L", "CTRL_L", "ALT_L", "SPACE", "ALT_R", "CTRL_R", "SHIFT_R",
    "ENTER", "BACKSPACE", "TILDE", "MINUS", "EQUALS", "BRACKET_L", "BRACKET_R", "BACKSLASH", 
    "SEMICOLON", "QUOTE", "COMMA", "PERIOD", "SLASH", "FN",
    "ARROW_UP", "ARROW_DOWN", "ARROW_LEFT", "ARROW_RIGHT",
    "INS", "HOME", "PGUP", "DEL", "END", "PGDN"
  ],
  "100": [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", 
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
    "ESC", "TAB", "CAPS", "SHIFT_L", "CTRL_L", "ALT_L", "SPACE", "ALT_R", "CTRL_R", "SHIFT_R",
    "ENTER", "BACKSPACE", "TILDE", "MINUS", "EQUALS", "BRACKET_L", "BRACKET_R", "BACKSLASH", 
    "SEMICOLON", "QUOTE", "COMMA", "PERIOD", "SLASH", "FN",
    "ARROW_UP", "ARROW_DOWN", "ARROW_LEFT", "ARROW_RIGHT",
    "INS", "HOME", "PGUP", "DEL", "END", "PGDN",
    "NUM_LOCK", "NUM_DIVIDE", "NUM_MULTIPLY", "NUM_SUBTRACT", "NUM_ADD", "NUM_ENTER", "NUM_DOT",
    "NUM_0", "NUM_1", "NUM_2", "NUM_3", "NUM_4", "NUM_5", "NUM_6", "NUM_7", "NUM_8", "NUM_9"
  ]
};

const KeyboardPart = ({
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
  const isKeycap = partType === "keycap";

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = true;
  
        if (isTopCase) {
          child.castShadow = false;
        } else {
          child.castShadow = true;
        }
  
        if ((isTopCase || isTopSwitch || isKeycap) && color) {
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
  }, [scene, color, isTopCase, isTopSwitch, isKeycap]);
  

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

const ScreenshotHandler = forwardRef(({ children, size }, ref) => {
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

const KeyboardOrbitControls = ({ resetCamera, cameraSettings }) => {
  const controls = useRef();
  const { camera } = useThree();

  // 카메라 리셋 기능 추가
  useEffect(() => {
    if (resetCamera && controls.current) {
      // 카메라 위치 초기화
      if (cameraSettings && cameraSettings.position) {
        camera.position.set(...cameraSettings.position);
      } else {
        camera.position.set(0, 7, 12);
      }
      
      // 카메라 타겟 초기화
      if (cameraSettings && cameraSettings.target) {
        controls.current.target.set(...cameraSettings.target);
      } else {
        controls.current.target.set(0, 0, 0);
      }
      
      controls.current.update();
    }
  }, [resetCamera, cameraSettings, camera]);

  useEffect(() => {
    if (controls.current) {
      controls.current.target.set(0, 0, 0);
      controls.current.update();
    }
  }, []);

  return (
    <OrbitControls
      ref={controls}
      enableZoom={true}
      minDistance={6}
      maxDistance={20}
      zoomSpeed={0.3}
      maxPolarAngle={Math.PI / 2}
      rotateSpeed={0.5}
    />
  );
};

const Model = ({ size, selectedModel, baseColor, switchColor, resetStatus, keycapColors = {} }) => {
  const [baseAnimationProgress, setBaseAnimationProgress] = useState(0);
  const [switchAnimationProgress, setSwitchAnimationProgress] = useState(0);
  const [keycapAnimationProgress, setKeycapAnimationProgress] = useState(0);
  const [engravingAnimationProgress, setEngravingAnimationProgress] = useState(0);
  const [showSwitch, setShowSwitch] = useState(false);
  const [showKeycap, setShowKeycap] = useState(false);
  const [showEngraving, setShowEngraving] = useState(false);
  const groupRef = useRef();
  const scale = KEYBOARD_POSITIONS.getScale(size);
  
  // 키보드 사이즈에 따른 중심점 오프셋
  const centerOffset = KEYBOARD_CENTER_OFFSETS[size] || KEYBOARD_CENTER_OFFSETS["100"];

  const baseAnimationExecuted = useRef(false);
  const switchAnimationExecuted = useRef({});
  const keycapAnimationExecuted = useRef({});
  const engravingAnimationExecuted = useRef({});

  // 다시 시작하기 효과를 위한 리셋 함수
  useEffect(() => {
    if (resetStatus) {
      // 모든 애니메이션 상태 초기화
      baseAnimationExecuted.current = false;
      switchAnimationExecuted.current = {};
      keycapAnimationExecuted.current = {};
      engravingAnimationExecuted.current = {};
      
      // 애니메이션 진행률 초기화
      setBaseAnimationProgress(0);
      setSwitchAnimationProgress(0);
      setKeycapAnimationProgress(0);
      setEngravingAnimationProgress(0);
      
      // 스위치와 키캡, 각인 표시 상태 초기화
      setShowSwitch(false);
      setShowKeycap(false);
      setShowEngraving(false);

      // 애니메이션 다시 시작
      setTimeout(() => {
        animateBaseParts();
      }, 500);
    }
  }, [resetStatus]);

  // 사이즈 변경 시 상태 초기화
  useEffect(() => {
    baseAnimationExecuted.current = false;
    switchAnimationExecuted.current = {};
    keycapAnimationExecuted.current = {};
    engravingAnimationExecuted.current = {};
    setBaseAnimationProgress(0);
    setSwitchAnimationProgress(0);
    setKeycapAnimationProgress(0);
    setEngravingAnimationProgress(0);
    setShowSwitch(false);
    setShowKeycap(false);
    setShowEngraving(false);
  }, [size]);

  // 기본 파트 애니메이션 함수
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

  useEffect(() => {
    if (baseAnimationExecuted.current) return;
    const timer = setTimeout(animateBaseParts, 500);
    return () => clearTimeout(timer);
  }, [size]);

  const BASE_MODEL_PATHS = [
    `/keyboard/${size}keyboard/1.BottomCase.glb`,
    `/keyboard/${size}keyboard/2.PCB.glb`,
    `/keyboard/${size}keyboard/3.Plate.glb`,
    `/keyboard/${size}keyboard/4.Screw.glb`,
    `/keyboard/${size}keyboard/5.TopCase.glb`,
    `/keyboard/${size}keyboard/6.Stabilizers.glb`,
  ];

  const BOTTOM_SWITCH_MODEL_PATH = `/keyboard/${size}keyboard/${size}BottomSwitchs.glb`;
  const TOP_SWITCH_MODEL_PATH = `/keyboard/${size}keyboard/${size}TopSwitchs.glb`;
  const ENGRAVING_MODEL_PATH = `/keyboard/${size}keyboard/${size}Engraving.glb`;

  // 키캡 아이디 목록 가져오기
  const keycapIds = KEYCAP_IDS[size] || KEYCAP_IDS["100"];

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
      setShowEngraving(true); // 키캡 선택 시 각인도 함께 표시
      
      if (keycapAnimationExecuted.current[size]) {
        setKeycapAnimationProgress(1);
      } else {
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
      
      // 각인 애니메이션 실행
      if (engravingAnimationExecuted.current[size]) {
        setEngravingAnimationProgress(1);
      } else {
        setTimeout(() => {
          const duration = 1500;
          const startTime = Date.now();
  
          const updateAnimation = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            setEngravingAnimationProgress(progress);
            if (progress < 1) {
              requestAnimationFrame(updateAnimation);
            } else {
              engravingAnimationExecuted.current[size] = true;
            }
          };
  
          requestAnimationFrame(updateAnimation);
        }, 100);
      }
    }
  }, [selectedModel, size, showSwitch, showKeycap, showEngraving]);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
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
          centerOffset={centerOffset}
        />
      ))}

      {showSwitch && (
        <>
          <KeyboardPart
            key="bottom-switches"
            modelPath={BOTTOM_SWITCH_MODEL_PATH}
            animationProgress={switchAnimationProgress}
            scale={scale}
            partType="switch"
            size={size}
            centerOffset={centerOffset}
          />
          <KeyboardPart
            key="top-switches"
            modelPath={TOP_SWITCH_MODEL_PATH}
            animationProgress={switchAnimationProgress}
            scale={scale}
            partType="switch"
            size={size}
            color={switchColor}
            centerOffset={centerOffset}
          />
        </>
      )}

      {/* 개별 키캡 모델 렌더링 */}
      {showKeycap && keycapIds.map((keycapId, index) => (
        <KeyboardPart
          key={`keycap-${keycapId}`}
          modelPath={`/keyboard/${size}keyboard/${size}keycaps/${keycapId}.glb`}
          index={index}
          animationProgress={keycapAnimationProgress}
          scale={scale}
          partType="keycap"
          size={size}
          color={keycapColors[keycapId] || null} // 개별 키캡 색상 적용
          centerOffset={centerOffset}
        />
      ))}

      {/* 각인 모델 추가 */}
      {showEngraving && (
        <KeyboardPart
          key="engraving"
          modelPath={ENGRAVING_MODEL_PATH}
          animationProgress={engravingAnimationProgress}
          scale={scale}
          partType="keycap" // 키캡과 동일한 애니메이션 파트 타입 사용
          size={size}
          centerOffset={centerOffset}
        />
      )}
    </group>
  );
};

const ShadowLimiter = () => {
  const { scene } = useThree();

  useEffect(() => {
    scene.traverse((object) => {
      if (object.isLight && object.shadow) {
        object.shadow.camera.near = 1;
        object.shadow.camera.far = 20;
        object.shadow.mapSize.width = 2048;
        object.shadow.mapSize.height = 2048;
        object.shadow.radius = 1;
        object.shadow.bias = -0.001;
      }
    });
  }, [scene]);

  return null;
};

export const ThreeDModel = forwardRef(
  ({ size, selectedModel, baseColor, switchColor, keycapColors = {} }, ref) => {
    const { size: urlSize } = useParams();
    const keyboardSize = size || urlSize || "100";
    const validSize = ["60", "80", "100"].includes(keyboardSize)
      ? keyboardSize
      : "100";
    const screenshotRef = useRef();
    const [resetStatus, setResetStatus] = useState(false);
    const [resetCamera, setResetCamera] = useState(false);

    // 리셋 함수 구현
    const resetKeyboardModel = () => {
      setResetStatus(prev => !prev); // 토글하여 useEffect 트리거
      setResetCamera(true);
      
      // 카메라 리셋 후 상태 복원
      setTimeout(() => {
        setResetCamera(false);
      }, 100);
    };

    useImperativeHandle(ref, () => ({
      getScreenshot: () => {
        if (screenshotRef.current) {
          return screenshotRef.current.takeScreenshot();
        }
        return null;
      },
      // 다시 시작하기 기능 추가
      resetModel: resetKeyboardModel,
      // 특정 키캡 색상 변경 함수 추가 (외부에서 호출 가능)
      updateKeycapColor: (keycapId, color) => {
        // 여기서는 직접적인 업데이트를 할 수 없으므로 부모 컴포넌트에서 keycapColors 상태를 관리해야 함
        console.log(`Keycap ${keycapId} color updated to ${color}`);
      }
    }));

    // 선택된 키보드 크기에 맞는 카메라 설정
    const cameraSettings = KEYBOARD_CAMERA_SETTINGS[validSize] || KEYBOARD_CAMERA_SETTINGS["100"];

    return (
      <Container>
        <Canvas
          shadows
          camera={{
            position: cameraSettings.position,
            fov: 40,
          }}
        >
          <ScreenshotHandler ref={screenshotRef} size={validSize}>
            <ambientLight intensity={2.2} />
            <directionalLight
              position={[0, 20, 0]}
              intensity={5.0}
              castShadow
              shadow-camera-left={-5}
              shadow-camera-right={5}
              shadow-camera-top={5}
              shadow-camera-bottom={-5}
              shadow-bias={-0.001}
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

            <KeyboardOrbitControls 
              size={validSize} 
              resetCamera={resetCamera}
              cameraSettings={cameraSettings}
            />
            <ShadowLimiter />
            <Model
              size={validSize}
              selectedModel={selectedModel}
              baseColor={baseColor}
              switchColor={switchColor}
              resetStatus={resetStatus}
              keycapColors={keycapColors}
            />
          </ScreenshotHandler>
        </Canvas>
      </Container>
    );
  }
);