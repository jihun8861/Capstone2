import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled from "styled-components";
import { Canvas } from "@react-three/fiber";
import { useParams, useLocation } from "react-router-dom";
import { KEYBOARD_POSITIONS } from "../../data/keyboardPositions";
import { KEYCAP_IDS } from "../../data/KeycapID";
import { KeyboardPart } from "./KeyboardPart";
import { ScreenshotHandler } from "./ScreenshotHandler";
import { ShadowLimiter } from "./ShadowLimiter";
import { KeyboardOrbitControls } from "./KeyboardOrbitControls";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 키보드 크기별 중심점 오프셋 정의
const KEYBOARD_CENTER_OFFSETS = {
  60: { x: -0.9, y: 0, z: 0 },
  80: { x: -1.2, y: 0, z: 0 },
  100: { x: -1.5, y: 0, z: 0 },
};

// 키보드 크기별 카메라 설정
const KEYBOARD_CAMERA_SETTINGS = {
  60: { position: [0, 7, 10], target: [0, 0, 0] },
  80: { position: [0, 7, 11], target: [0, 0, 0] },
  100: { position: [0, 7, 14], target: [0, 0, 0] },
};

// 세션 스토리지에 키캡 색상 정보를 저장하는 함수
const saveKeycapColorsToSession = (size, keycapColors) => {
  try {
    sessionStorage.setItem(
      `keycapColors_${size}`,
      JSON.stringify(keycapColors)
    );
  } catch (e) {
    console.error("Failed to save keycap colors to session storage:", e);
  }
};

// 세션 스토리지에서 키캡 색상 정보를 가져오는 함수
const getKeycapColorsFromSession = (size) => {
  try {
    const colors = sessionStorage.getItem(`keycapColors_${size}`);
    return colors ? JSON.parse(colors) : {};
  } catch (e) {
    console.error("Failed to get keycap colors from session storage:", e);
    return {};
  }
};

const clearKeycapColorsFromSession = (size) => {
  try {
    // 특정 사이즈의 키캡 색상 정보 삭제
    sessionStorage.removeItem(`keycapColors_${size}`);

    // 혹시 모를 다른 형식으로 저장된 키캡 색상 정보도 삭제
    sessionStorage.removeItem("keycapColors");

    console.log(`키캡 색상 정보 삭제 완료: keycapColors_${size}`);
  } catch (e) {
    console.error("Failed to clear keycap colors from session storage:", e);
  }
};

const Model = ({
  size,
  selectedModel,
  baseColor,
  switchColor,
  resetStatus,
  keycapColors = {},
}) => {
  const [baseAnimationProgress, setBaseAnimationProgress] = useState(0);
  const [switchAnimationProgress, setSwitchAnimationProgress] = useState(0);
  const [keycapAnimationProgress, setKeycapAnimationProgress] = useState(0);
  const [engravingAnimationProgress, setEngravingAnimationProgress] =
    useState(0);
  const [showSwitch, setShowSwitch] = useState(false);
  const [showKeycap, setShowKeycap] = useState(false);
  const [showEngraving, setShowEngraving] = useState(false);
  const [currentKeycapColors, setCurrentKeycapColors] = useState(keycapColors);
  const groupRef = useRef();
  const scale = KEYBOARD_POSITIONS.getScale(size);

  // 키보드 사이즈에 따른 중심점 오프셋
  const centerOffset =
    KEYBOARD_CENTER_OFFSETS[size] || KEYBOARD_CENTER_OFFSETS["100"];

  const baseAnimationExecuted = useRef(false);
  const switchAnimationExecuted = useRef({});
  const keycapAnimationExecuted = useRef({});
  const engravingAnimationExecuted = useRef({});

  // keycapColors prop이 변경되면 currentKeycapColors 상태를 업데이트하고 세션 스토리지에 저장
  useEffect(() => {
    setCurrentKeycapColors(keycapColors);
    saveKeycapColorsToSession(size, keycapColors);
  }, [keycapColors, size]);

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

      // 키캡 색상 초기화 - 상태와 세션 스토리지 모두 초기화
      setCurrentKeycapColors({});
      clearKeycapColorsFromSession(size);

      // 애니메이션 다시 시작
      setTimeout(() => {
        animateBaseParts();
      }, 500);
    }
  }, [resetStatus, size]);

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

    // 사이즈 변경 시 해당 사이즈의 저장된 키캡 색상 정보를 가져옴
    const savedColors = getKeycapColorsFromSession(size);
    setCurrentKeycapColors(savedColors);
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
      {showKeycap &&
        keycapIds.map((keycapId, index) => (
          <KeyboardPart
            key={`keycap-${keycapId}`}
            modelPath={`/keyboard/${size}keyboard/${size}keycaps/${keycapId}.glb`}
            index={index}
            animationProgress={keycapAnimationProgress}
            scale={scale}
            partType="keycap"
            size={size}
            color={currentKeycapColors[keycapId] || null} // 현재 키캡 색상 적용
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

export const ThreeDModel = forwardRef(
  ({ size, selectedModel, baseColor, switchColor, keycapColors = {} }, ref) => {
    const { size: urlSize } = useParams();
    const location = useLocation();
    const keyboardSize = size || urlSize || "100";
    const validSize = ["60", "80", "100"].includes(keyboardSize)
      ? keyboardSize
      : "100";
    const screenshotRef = useRef();
    const [resetStatus, setResetStatus] = useState(false);
    const [resetCamera, setResetCamera] = useState(false);
    const [internalKeycapColors, setInternalKeycapColors] = useState({});

    // 컴포넌트 마운트 시 세션 스토리지에서 키캡 색상 정보 로드
    useEffect(() => {
      const savedColors = getKeycapColorsFromSession(validSize);
      setInternalKeycapColors(savedColors);
    }, [validSize]);

    // 페이지 변경 감지 및 세션 스토리지 초기화
    useEffect(() => {
      // 페이지 변경 이벤트 리스너
      const handlePageChange = () => {
        clearKeycapColorsFromSession(validSize);
        setInternalKeycapColors({});
      };

      // 브라우저 창이 닫힐 때 세션 스토리지 초기화
      const handleBeforeUnload = () => {
        clearKeycapColorsFromSession(validSize);
      };

      // 이벤트 리스너 등록
      window.addEventListener("beforeunload", handleBeforeUnload);

      // 위치 변경 시 이전 페이지 정보 저장
      const prevPath = location.pathname;

      // 컴포넌트 언마운트 또는 위치 변경 시 클린업
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);

        // 라우트가 변경되면 세션 스토리지 초기화 (명시적으로 현재 경로 확인)
        if (location.pathname !== prevPath) {
          console.log("페이지 변경 감지: 키캡 색상 초기화");
          handlePageChange();
        }
      };
    }, [validSize, location.pathname]);

    // 키캡 색상 업데이트 함수
    const updateKeycapColor = (keycapId, color) => {
      const newColors = { ...internalKeycapColors, [keycapId]: color };
      setInternalKeycapColors(newColors);
      saveKeycapColorsToSession(validSize, newColors);
    };

    // 모든 키캡 색상 초기화 함수
    const resetKeycapColors = () => {
      setInternalKeycapColors({});
      clearKeycapColorsFromSession(validSize);
    };

    // 리셋 함수 구현
    const resetKeyboardModel = () => {
      setResetStatus((prev) => !prev); // 토글하여 useEffect 트리거
      setResetCamera(true);
      resetKeycapColors(); // 키캡 색상 초기화 추가

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
      // 키캡 색상 초기화 함수 수정
      resetKeycapColors: () => {
        setInternalKeycapColors({});
        clearKeycapColorsFromSession(validSize);
        // Model 컴포넌트에 변경사항 전달
        setResetStatus((prev) => !prev);
      },
      // 모든 키캡 색상 초기화 함수 추가 (CustomPage에서 호출됨)
      resetAllKeycapColors: () => {
        setInternalKeycapColors({});
        clearKeycapColorsFromSession(validSize);
        // Model 컴포넌트에 변경사항 전달
        setResetStatus((prev) => !prev);
      },
      // 특정 키캡 색상 변경 함수 추가 (외부에서 호출 가능)
      updateKeycapColor: updateKeycapColor,
    }));

    // 선택된 키보드 크기에 맞는 카메라 설정
    const cameraSettings =
      KEYBOARD_CAMERA_SETTINGS[validSize] || KEYBOARD_CAMERA_SETTINGS["100"];

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

            {/* LED Bloom 효과 추가 - switch 모델이 선택된 경우에만 적용 */}
            {selectedModel === "switch" && (
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.2}
                  luminanceSmoothing={0.9}
                  intensity={0.1}
                />
              </EffectComposer>
            )}
          </ScreenshotHandler>
        </Canvas>
      </Container>
    );
  }
);