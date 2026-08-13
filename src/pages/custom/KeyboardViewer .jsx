import React, { useRef, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft } from 'react-icons/fi';
import { ThreeDModel } from '../../components/model/ThreeDModel';

const ViewerContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
`;

const ViewerHeader = styled.div`
  background-color: white;
  padding: 20px 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e9ecef;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #5a6268;
  }
`;

const ViewerTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #343a40;
  margin: 0;
`;

const KeyboardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
  color: #6c757d;
`;

const InfoBadge = styled.span`
  background-color: #e9ecef;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
`;

const ViewerContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
`;

const ModelContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 70vh;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
`;

const ColorInfoPanel = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  min-width: 200px;
`;

const ColorInfoTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 16px;
  font-weight: 600;
  color: #343a40;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 8px;
`;

const ColorItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  font-size: 14px;
`;

const ColorSwatch = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: ${props => props.color};
`;

const ColorLabel = styled.span`
  color: #495057;
  font-weight: 500;
`;

const ColorValue = styled.span`
  color: #6c757d;
  font-family: monospace;
  font-size: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 18px;
  color: #6c757d;
`;

export const KeyboardViewer = () => {
  const { size } = useParams();
  const location = useLocation();
  const modelRef = useRef();
  
  const [keyboardData, setKeyboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const viewParam = urlParams.get('view');
    
    if (viewParam) {
      try {
        const decodedData = JSON.parse(atob(viewParam));
        console.log("디코딩된 키보드 데이터:", decodedData);
        setKeyboardData(decodedData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to decode keyboard data:', error);
        setLoading(false);
      }
    } else {
      if (location.state && location.state.keyboardData) {
        console.log("state에서 받은 키보드 데이터:", location.state.keyboardData);
        setKeyboardData(location.state.keyboardData);
      }
      setLoading(false);
    }
  }, [location]);

  const handleBack = () => {
    // 뷰어에서 나갈 때 전체 세션 스토리지 초기화
    console.log("뷰어 종료 - 세션 스토리지 초기화");
    
    // 키캡 관련 모든 세션 데이터 삭제
    Object.keys(sessionStorage).forEach(key => {
      if (key.includes('keycap') || key.includes('keyboard')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // 전체 세션 초기화 (필요한 경우에만)
    sessionStorage.clear();
    
    // 뒤로가기
    window.history.back();
  };

  const getSwitchColorFromName = (switchName) => {
    if (!switchName) return "#ffffff";
    
    const switchColorMap = {
      청축: "#0066cc",
      적축: "#cc0000",
      갈축: "#8b4513",
      흑축: "#000000",
      백축: "#ffffff",
    };

    if (switchName.startsWith('#')) {
      return switchName;
    }

    for (const [axisName, color] of Object.entries(switchColorMap)) {
      if (switchName.includes(axisName)) {
        return color;
      }
    }
    
    return switchName;
  };

  // 키캡 색상 데이터를 처리하는 함수
  const processKeycapColors = (keycapcolor) => {
    if (!keycapcolor || typeof keycapcolor !== 'object') {
      return {};
    }

    // keycapcolor에 keyColors가 있는 경우 (중첩된 객체 구조)
    if (keycapcolor.keyColors) {
      console.log("keyColors에서 키캡 색상 추출:", keycapcolor.keyColors);
      return keycapcolor.keyColors;
    }

    // 직접 키캡 색상 데이터인 경우
    console.log("직접 키캡 색상 데이터 사용:", keycapcolor);
    return keycapcolor;
  };

  // 변경된 키캡 색상의 개수를 계산하는 함수
  const getChangedKeycapCount = (keycapColors) => {
    if (!keycapColors || typeof keycapColors !== 'object') {
      return 0;
    }

    const defaultColors = ['#FFFFFF', '#ffffff', 'white', '#FFF', '#fff'];
    
    return Object.values(keycapColors).filter(color => {
      if (!color || typeof color !== 'string') return false;
      
      // 기본 색상이 아닌 경우를 카운트
      return !defaultColors.includes(color.toUpperCase());
    }).length;
  };

  if (loading) {
    return (
      <ViewerContainer>
        <LoadingContainer>
          키보드 데이터를 불러오는 중...
        </LoadingContainer>
      </ViewerContainer>
    );
  }

  if (!keyboardData) {
    return (
      <ViewerContainer>
        <LoadingContainer>
          키보드 데이터를 찾을 수 없습니다.
        </LoadingContainer>
      </ViewerContainer>
    );
  }

  const { title, barebonecolor, switchcolor, keycapcolor, keyboardtype } = keyboardData;
  const processedKeycapColors = processKeycapColors(keycapcolor);
  const changedKeycapCount = getChangedKeycapCount(processedKeycapColors);

  // 디버깅을 위한 로그 추가
  console.log("키보드 뷰어 렌더링:", {
    title,
    barebonecolor,
    switchcolor,
    keycapcolor,
    processedKeycapColors,
    changedKeycapCount,
    keyboardtype,
    size
  });

  return (
    <ViewerContainer>
      <ViewerHeader>
        <HeaderLeft>
          <BackButton onClick={handleBack}>
            <FiArrowLeft />
            뒤로가기
          </BackButton>
          <ViewerTitle>{title || '키보드 뷰어'}</ViewerTitle>
        </HeaderLeft>
        
        <KeyboardInfo>
          <InfoBadge>{keyboardtype || size}%</InfoBadge>
          <InfoBadge>뷰어 모드</InfoBadge>
        </KeyboardInfo>
      </ViewerHeader>

      <ViewerContent>
        <ModelContainer>
          <ThreeDModel
            ref={modelRef}
            size={keyboardtype || size}
            selectedModel="complete"
            baseColor={barebonecolor || "#ffffff"}
            switchColor={getSwitchColorFromName(switchcolor) || "#ffffff"}
            keycapColors={processedKeycapColors} // 처리된 키캡 색상 전달
            ledEnabled={false}
            viewerMode={true} // 뷰어 모드 활성화
            showSwitches={true}
            showKeycaps={true}
            loadAllComponents={true}
            renderSwitches={true}
            renderKeycaps={true}
            includeAllParts={true}
            resetStatus={false} // 뷰어 모드에서는 리셋하지 않음
          />
          
          <ColorInfoPanel>
            <ColorInfoTitle>색상 정보</ColorInfoTitle>
            
            <ColorItem>
              <ColorSwatch color={barebonecolor || "#ffffff"} />
              <div>
                <ColorLabel>베어본</ColorLabel>
                <br />
                <ColorValue>{barebonecolor || "#ffffff"}</ColorValue>
              </div>
            </ColorItem>

            <ColorItem>
              <ColorSwatch color={getSwitchColorFromName(switchcolor) || "#ffffff"} />
              <div>
                <ColorLabel>스위치</ColorLabel>
                <br />
                <ColorValue>{switchcolor || "#ffffff"}</ColorValue>
              </div>
            </ColorItem>

            {processedKeycapColors && Object.keys(processedKeycapColors).length > 0 && (
              <div>
                <ColorItem>
                  <ColorSwatch color={Object.values(processedKeycapColors)[0] || "#ffffff"} />
                  <div>
                    <ColorLabel>키캡</ColorLabel>
                    <br />
                    <ColorValue>
                      {changedKeycapCount > 0 
                        ? `${changedKeycapCount}개 키 변경됨` 
                        : '기본 색상 사용'
                      }
                    </ColorValue>
                  </div>
                </ColorItem>
                
                {/* 키캡별 색상 상세 정보 (변경된 색상만 표시) */}
                {changedKeycapCount > 0 && changedKeycapCount <= 10 && (
                  <div style={{ marginTop: '10px', fontSize: '12px' }}>
                    {Object.entries(processedKeycapColors)
                      .filter(([key, color]) => {
                        const defaultColors = ['#FFFFFF', '#ffffff', 'white', '#FFF', '#fff'];
                        return color && !defaultColors.includes(color.toUpperCase());
                      })
                      .map(([key, color]) => (
                        <div key={key} style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '5px', 
                          marginBottom: '3px' 
                        }}>
                          <ColorSwatch 
                            color={color} 
                            style={{ width: '12px', height: '12px' }} 
                          />
                          <span>{key}: {color}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </ColorInfoPanel>
        </ModelContainer>
      </ViewerContent>
    </ViewerContainer>
  );
};