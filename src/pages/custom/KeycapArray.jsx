import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexColorPicker } from "react-colorful";
import { keyboardLayouts } from "../../data/KeyboardLayout";

const KeyboardContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  padding: 0 12px;
  cursor: pointer;
  color: #333;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const RowWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  width: 90%;
  margin: 10px 0;
`;

const KeyCap = styled.div`
  flex: ${(props) => props.flex};
  height: 64px;
  background-color: ${(props) => props.color || "#e0e0e0"};
  color: ${(props) => (props.isDark ? "#fff" : "#000")};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin: 0 1px;
  font-size: 14px;
  user-select: none;
  transition: transform 0.2s ease, background-color 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  outline: ${(props) => props.isSelected ? "3px solid #4a90e2" : "none"};
  transform: ${(props) => props.isSelected ? "translateY(-3px)" : "none"};
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const NavContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const ColorPickerContainer = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  position: absolute;
  left: 20px;
  bottom: 100px;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 20;
`;

const ColorPreview = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  width: 100%;
`;

const ColorSwatch = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 10px;
  border: 1px solid #ddd;
`;

const ColorLabel = styled.span`
  font-size: 14px;
  margin-right: 10px;
`;

const ColorInput = styled.input`
  width: 80px;
  height: 24px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0 5px;
`;

const HeaderBar = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
  margin-bottom: 10px;
`;

const RowIndicator = styled.div`
  font-size: 14px;
  font-weight: bold;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

// 색상이 어두운지 확인하는 함수 (텍스트 색상 대비를 위해)
const isColorDark = (hexColor) => {
  // HEX를 RGB로 변환
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // 색상 밝기 계산 (YIQ 공식)
  return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
};

export const KeycapArray = ({ size = "60", onClose, onKeycapColorChange, initialColors = {} }) => {
  const [currentRow, setCurrentRow] = useState(0);
  const [selectedKeycap, setSelectedKeycap] = useState(null);
  const [currentColor, setCurrentColor] = useState("#e0e0e0");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [keycapColors, setKeycapColors] = useState(initialColors);
  
  // 키보드 크기에 맞는 레이아웃 선택 (기본값으로 60% 레이아웃 사용)
  const layout = keyboardLayouts[size] || keyboardLayouts["60"];

  useEffect(() => {
    setKeycapColors(initialColors);
  }, [initialColors]);

  // 이전 행으로 이동
  const handlePrev = () => {
    if (currentRow > 0) setCurrentRow(currentRow - 1);
  };

  // 다음 행으로 이동
  const handleNext = () => {
    if (currentRow < layout.length - 1) {
      setCurrentRow(currentRow + 1);
    }
  };

  // 키캡 선택 시 색상 선택기 표시
  const handleKeycapClick = (keycap) => {
    setSelectedKeycap(keycap);
    // 현재 키캡의 적용된 색상을 선택기에 설정 (없으면 기본값)
    setCurrentColor(keycapColors[keycap.id] || "#e0e0e0");
    setShowColorPicker(true);
  };

  // 색상 변경 처리
  const handleColorChange = (color) => {
    setCurrentColor(color);
    
    // 색상 변경 사항 저장
    if (selectedKeycap) {
      const updatedColors = {
        ...keycapColors,
        [selectedKeycap.id]: color
      };
      
      setKeycapColors(updatedColors);
      
      // 부모 컴포넌트에 색상 변경 알림
      if (onKeycapColorChange) {
        onKeycapColorChange(selectedKeycap.id, color, updatedColors);
      }
    }
  };

  return (
    <KeyboardContainer>
      <HeaderBar>
        <RowIndicator>{layout[currentRow].name} ({currentRow + 1}/{layout.length})</RowIndicator>
        <CloseButton onClick={onClose}>×</CloseButton>
      </HeaderBar>
      
      <NavContainer>
        <ArrowButton onClick={handlePrev} disabled={currentRow === 0}>〈</ArrowButton>
        <RowWrapper>
          <Row>
            {layout[currentRow].keys.map((key, idx) => {
              const keyColor = keycapColors[key.id] || "#e0e0e0";
              const isDark = isColorDark(keyColor);
              const isSelected = selectedKeycap && selectedKeycap.id === key.id;
              
              return (
                <KeyCap 
                  key={idx} 
                  flex={key.w}
                  color={keyColor}
                  isDark={isDark}
                  isSelected={isSelected}
                  onClick={() => handleKeycapClick(key)}
                >
                  {key.label}
                </KeyCap>
              );
            })}
          </Row>
        </RowWrapper>
        <ArrowButton onClick={handleNext} disabled={currentRow === layout.length - 1}>〉</ArrowButton>
      </NavContainer>
      
      <ColorPickerContainer show={showColorPicker}>
        <HexColorPicker color={currentColor} onChange={handleColorChange} />
        <ColorPreview>
          <ColorSwatch color={currentColor} />
          <ColorLabel>{selectedKeycap ? selectedKeycap.label : ''} 색상:</ColorLabel>
          <ColorInput
            value={currentColor}
            onChange={(e) => {
              const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
              if (hexRegex.test(e.target.value)) {
                handleColorChange(e.target.value);
              } else if (e.target.value.startsWith("#") && e.target.value.length <= 7) {
                setCurrentColor(e.target.value);
              }
            }}
            onBlur={(e) => {
              const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
              if (!hexRegex.test(e.target.value)) {
                setCurrentColor(currentColor);
              }
            }}
          />
        </ColorPreview>
      </ColorPickerContainer>
    </KeyboardContainer>
  );
};