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
  switchColor = {},
  resetStatus,
  keycapColors = {},
  ledEnabled = false,
  viewerMode = false,
}) => {
  const [baseAnimationProgress, setBaseAnimationProgress] = useState(0);
  const [switchAnimationProgress, setSwitchAnimationProgress] = useState(0);
  const [keycapAnimationProgress, setKeycapAnimationProgress] = useState(0);
  const [engravingAnimationProgress, setEngravingAnimationProgress] = useState(0);
  const [showSwitch, setShowSwitch] = useState(false);
  const [showKeycap, setShowKeycap] = useState(false);
  const [showEngraving, setShowEngraving] = useState(false);
  const [currentKeycapColors, setCurrentKeycapColors] = useState({});
  const [resetTrigger, setResetTrigger] = useState(0);
  const [prevSize, setPrevSize] = useState(size);
  const [isInitialized, setIsInitialized] = useState(false); // 초기화 상태 추가

  const groupRef = useRef();
  const pcbRef = useRef();
  const scale = KEYBOARD_POSITIONS.getScale(size);
  const centerOffset = KEYBOARD_CENTER_OFFSETS[size] || KEYBOARD_CENTER_OFFSETS["100"];
  
  const baseAnimationExecuted = useRef(false);
  const switchAnimationExecuted = useRef({});
  const keycapAnimationExecuted = useRef({});
  const engravingAnimationExecuted = useRef({});

  // 키캡 색상 완전 초기화 함수
  const clearAllKeycapColors = () => {
    console.log("키캡 색상 완전 초기화 실행");
    setCurrentKeycapColors({});
    setResetTrigger(prev => prev + 1);
    
    // 모든 사이즈의 세션 스토리지 초기화
    ['60', '65', '75', '80', '100'].forEach(keyboardSize => {
      clearKeycapColorsFromSession(keyboardSize);
    });
    
    // 전체 키캡 관련 세션 스토리지 키 삭제
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('keycap') || key.includes('keyboard')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // 컴포넌트 마운트 시 초기화 (뷰어 모드가 아닌 경우에만)
  useEffect(() => {
    if (!viewerMode && !isInitialized) {
      console.log("일반 모드 - 초기 세션 초기화");
      clearAllKeycapColors();
      setIsInitialized(true);
    }
  }, [viewerMode, isInitialized]);

  // 사이즈 변경 감지 및 처리
  useEffect(() => {
    if (prevSize !== size) {
      console.log(`키보드 사이즈 변경: ${prevSize} -> ${size}`);
      
      if (!viewerMode) {
        // 일반 모드에서는 사이즈 변경 시 완전 초기화
        clearAllKeycapColors();
        
        // 애니메이션 상태 초기화
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
      } else {
        // 뷰어 모드에서는 전달받은 색상만 사용
        console.log("뷰어 모드 - 전달받은 keycapColors 사용:", keycapColors);
        setCurrentKeycapColors(keycapColors || {});
      }
      
      setPrevSize(size);
    }
  }, [size, prevSize, viewerMode, keycapColors]);

  // 뷰어 모드 초기화
  useEffect(() => {
    if (viewerMode) {
      console.log("뷰어 모드 초기화 시작");
      
      // 뷰어 모드에서는 세션 스토리지 사용하지 않고 prop으로 받은 색상만 사용
      setCurrentKeycapColors(keycapColors || {});
      
      setShowSwitch(true);
      setShowKeycap(true);  
      setShowEngraving(true);
      
      setBaseAnimationProgress(1);
      setSwitchAnimationProgress(1);
      setKeycapAnimationProgress(1);
      setEngravingAnimationProgress(1);
      
      baseAnimationExecuted.current = true;
      switchAnimationExecuted.current[size] = true;
      keycapAnimationExecuted.current[size] = true;
      engravingAnimationExecuted.current[size] = true;
      
      console.log("뷰어 모드 초기화 완료 - 키캡 색상:", keycapColors);
    }
  }, [viewerMode, size, keycapColors]);

  // selectedModel 처리 로직
  useEffect(() => {
    if (viewerMode) {
      console.log("뷰어 모드에서는 selectedModel 로직 건너뜀");
      return;
    }
    
    console.log("selectedModel 처리:", selectedModel);
    
    if (selectedModel === "complete") {
      setShowSwitch(true);
      setShowKeycap(true);
      setShowEngraving(true);
      
      // 스위치 애니메이션
      if (!switchAnimationExecuted.current[size]) {
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
      } else {
        setSwitchAnimationProgress(1);
      }
      
      // 키캡 애니메이션
      if (!keycapAnimationExecuted.current[size]) {
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
      } else {
        setKeycapAnimationProgress(1);
      }
      
      // 각인 애니메이션
      if (!engravingAnimationExecuted.current[size]) {
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
      } else {
        setEngravingAnimationProgress(1);
      }
    }
    else if (selectedModel === "switch" && !showSwitch) {
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
    } 
    else if (selectedModel === "keycap" && !showKeycap) {
      setShowKeycap(true);
      setShowEngraving(true);

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
  }, [selectedModel, size, showSwitch, showKeycap, showEngraving, viewerMode]);

  // LED 효과 적용
  useEffect(() => {
    if (pcbRef.current && pcbRef.current.material) {
      if (ledEnabled) {
        pcbRef.current.material.emissive = new THREE.Color(0x00ffff);
        pcbRef.current.material.emissiveIntensity = 0.5;
      } else {
        pcbRef.current.material.emissive = new THREE.Color(0x000000);
        pcbRef.current.material.emissiveIntensity = 0;
      }
    }
  }, [ledEnabled]);

  // keycapColors prop 변경 처리 개선
  useEffect(() => {
    if (viewerMode) {
      // 뷰어 모드에서는 prop으로 받은 색상만 사용
      console.log("뷰어 모드 - keycapColors 업데이트:", keycapColors);
      setCurrentKeycapColors(keycapColors || {});
    } else {
      // 일반 모드에서만 세션 스토리지와 연동
      console.log("일반 모드 - keycapColors 업데이트:", keycapColors);
      
      if (Object.keys(keycapColors).length === 0) {
        console.log("빈 keycapColors 전달됨 - 초기화 실행");
        clearAllKeycapColors();
      } else {
        setCurrentKeycapColors(keycapColors);
        saveKeycapColorsToSession(size, keycapColors);
      }
    }
  }, [keycapColors, size, viewerMode]);

  // 리셋 처리 개선
  useEffect(() => {
    if (resetStatus && !viewerMode) {
      console.log("리셋 상태 감지 - 전체 초기화 실행");
      
      // 키캡 색상 완전 초기화
      clearAllKeycapColors();
      
      // 애니메이션 상태 초기화
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

      setTimeout(() => {
        animateBaseParts();
      }, 500);
    }
  }, [resetStatus, size, viewerMode]);

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

  // 기본 애니메이션 시작
  useEffect(() => {
    if (viewerMode) return;
    if (baseAnimationExecuted.current) return;
    const timer = setTimeout(animateBaseParts, 500);
    return () => clearTimeout(timer);
  }, [size, viewerMode]);

  // 컴포넌트 언마운트 시 정리 (뷰어 모드가 아닌 경우에만)
  useEffect(() => {
    return () => {
      if (!viewerMode) {
        console.log("Model 컴포넌트 언마운트 - 세션 정리");
        // 언마운트 시에는 초기화하지 않음 - 다른 페이지에서 사용할 수 있음
      }
    };
  }, [viewerMode]);

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
  const keycapIds = KEYCAP_IDS[size] || KEYCAP_IDS["100"];

  console.log("렌더링 상태:", {
    size,
    viewerMode,
    showSwitch,
    showKeycap,
    showEngraving,
    currentKeycapColors: Object.keys(currentKeycapColors).length,
    resetTrigger,
    isInitialized
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* 베이스 파트들 */}
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
          meshRef={path.includes("2.PCB.glb") ? pcbRef : null}
          ledEnabled={path.includes("2.PCB.glb") ? ledEnabled : false}
          resetTrigger={resetTrigger}
        />
      ))}

      {/* 스위치 파트들 */}
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
            resetTrigger={resetTrigger}
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
            resetTrigger={resetTrigger}
          />
        </>
      )}

      {/* 개별 키캡 모델들 */}
      {showKeycap &&
        keycapIds.map((keycapId, index) => (
          <KeyboardPart
            key={`keycap-${keycapId}-${resetTrigger}-${viewerMode ? 'viewer' : 'normal'}`}
            modelPath={`/keyboard/${size}keyboard/${size}keycaps/${keycapId}.glb`}
            index={index}
            animationProgress={keycapAnimationProgress}
            scale={scale}
            partType="keycap"
            size={size}
            color={currentKeycapColors[keycapId] || null}
            centerOffset={centerOffset}
            keycapColors={currentKeycapColors}
            keycapIndex={keycapId}
            resetTrigger={resetTrigger}
          />
        ))}

      {/* 각인 모델 */}
      {showEngraving && (
        <KeyboardPart
          key={`engraving-${resetTrigger}-${viewerMode ? 'viewer' : 'normal'}`}
          modelPath={ENGRAVING_MODEL_PATH}
          animationProgress={engravingAnimationProgress}
          scale={scale}
          partType="keycap"
          size={size}
          centerOffset={centerOffset}
          resetTrigger={resetTrigger}
        />
      )}
    </group>
  );
};

export const ThreeDModel = forwardRef(
  ({ size, selectedModel, baseColor, switchColor = {}, keycapColors = {}, viewerMode = false }, ref) => {
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

    const [ledEnabled, setLedEnabled] = useState(false);

    // 컴포넌트 마운트 시 세션 스토리지에서 키캡 색상 정보 로드
    useEffect(() => {
      const savedColors = getKeycapColorsFromSession(validSize);
      setInternalKeycapColors(savedColors);
    }, [validSize]);

    // **추가: 부모로부터 받은 keycapColors prop을 internalKeycapColors에 동기화**
    useEffect(() => {
      if (keycapColors && Object.keys(keycapColors).length > 0) {
        console.log("부모로부터 받은 keycapColors:", keycapColors);
        setInternalKeycapColors(keycapColors);
        saveKeycapColorsToSession(validSize, keycapColors);
      }
    }, [keycapColors, validSize]);

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

    // LED 상태 토글 함수 추가
    const toggleLed = () => {
      setLedEnabled(prev => !prev);
    };

    useImperativeHandle(ref, () => ({
      getScreenshot: () => {
        if (screenshotRef.current) {
          return screenshotRef.current.takeScreenshot();
        }
        return null;
      },
      // 다시 시작하기 기능
      resetModel: resetKeyboardModel,
      // 키캡 색상 초기화 함수
      resetKeycapColors: () => {
        setInternalKeycapColors({});
        clearKeycapColorsFromSession(validSize);
        // Model 컴포넌트에 변경사항 전달
        setResetStatus((prev) => !prev);
      },
      // 모든 키캡 색상 초기화 함수
      resetAllKeycapColors: () => {
        setInternalKeycapColors({});
        clearKeycapColorsFromSession(validSize);
        // Model 컴포넌트에 변경사항 전달
        setResetStatus((prev) => !prev);
      },
      // 특정 키캡 색상 변경 함수 - **부모의 keycapColors와 동기화**
      updateKeycapColor: (keycapId, color) => {
        const newColors = { ...internalKeycapColors, [keycapId]: color };
        setInternalKeycapColors(newColors);
        saveKeycapColorsToSession(validSize, newColors);
      },
      // **추가: 전체 키캡 색상을 한번에 업데이트하는 함수**
      updateAllKeycapColors: (newColors) => {
        console.log("updateAllKeycapColors 호출됨:", newColors);
        setInternalKeycapColors(newColors);
        saveKeycapColorsToSession(validSize, newColors);
      },
      // LED 토글 함수 추가
      toggleLed: toggleLed,
      // LED 상태 getter
      isLedEnabled: () => ledEnabled
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
              keycapColors={internalKeycapColors}
              ledEnabled={ledEnabled}
              viewerMode={viewerMode}
            />

            {/* LED가 활성화된 경우 bloom 효과 추가 */}
            {ledEnabled && (
              <EffectComposer>
                <Bloom
                  luminanceThreshold={0.5}
                  luminanceSmoothing={0.7}
                  intensity={0.7}
                />
              </EffectComposer>
            )}
          </ScreenshotHandler>
        </Canvas>
      </Container>
    );
  }
);