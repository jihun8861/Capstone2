import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { HexColorPicker } from "react-colorful";

// 스타일 컴포넌트
const KeyboardContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(240, 240, 240, 0.95);
  border-top: 1px solid #ccc;
  padding: 15px 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 15px;
`;

const Title = styled.h3`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #333;
  
  &:hover {
    color: #f00;
  }
`;

const NavigationControls = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 90%;
  justify-content: space-between;
`;

const RowIndicator = styled.span`
  font-size: 14px;
  color: #666;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  padding: 0 12px;
  cursor: pointer;
  color: #333;

  &:hover {
    transform: scale(1.1);
  }
  
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const RowWrapper = styled.div`
  width: 90%;
  display: flex;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
  margin: 10px 0;
`;

const KeyCap = styled.div`
  flex: ${(props) => props.flex};
  height: 64px;
  background-color: ${(props) => props.color || "#e0e0e0"};
  color: ${(props) => props.textColor || "#000"};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin: 0 1px;
  font-size: 14px;
  user-select: none;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
  border: ${(props) => props.selected ? "2px solid #007bff" : "2px solid transparent"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 8px rgba(0, 0, 0, 0.15);
  }
`;

const KeyID = styled.span`
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 8px;
  color: rgba(0, 0, 0, 0.6);
`;

const ColorPickerContainer = styled.div`
  position: absolute;
  right: 20px;
  top: 70px;
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  display: ${(props) => (props.visible ? "block" : "none")};
`;

const ColorPreview = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
`;

const ColorSwatch = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  margin-right: 10px;
  border: 1px solid #ccc;
`;

const ColorInput = styled.input`
  width: 80px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const ColorLabel = styled.span`
  margin-right: 10px;
  font-size: 14px;
`;

const ResetButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #e8e8e8;
  }
`;

const ApplyButton = styled.button`
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background-color: #45a049;
  }
`;

// 60% 키보드 레이아웃
const layout = [
  {
    name: "Function Row",
    keys: [
      { label: "ESC", id: "KeyEsc", w: 6 },
      { label: "1", id: "Key1", w: 6 },
      { label: "2", id: "Key2", w: 6 },
      { label: "3", id: "Key3", w: 6 },
      { label: "4", id: "Key4", w: 6 },
      { label: "5", id: "Key5", w: 6 },
      { label: "6", id: "Key6", w: 6 },
      { label: "7", id: "Key7", w: 6 },
      { label: "8", id: "Key8", w: 6 },
      { label: "9", id: "Key9", w: 6 },
      { label: "0", id: "Key0", w: 6 },
      { label: "-", id: "KeyMinus", w: 6 },
      { label: "=", id: "KeyEqual", w: 6 },
      { label: "BACK", id: "KeyBackspace", w: 12 }
    ]
  },
  {
    name: "Number Row",
    keys: [
      { label: "TAB", id: "KeyTab", w: 9 },
      { label: "Q", id: "KeyQ", w: 6 },
      { label: "W", id: "KeyW", w: 6 },
      { label: "E", id: "KeyE", w: 6 },
      { label: "R", id: "KeyR", w: 6 },
      { label: "T", id: "KeyT", w: 6 },
      { label: "Y", id: "KeyY", w: 6 },
      { label: "U", id: "KeyU", w: 6 },
      { label: "I", id: "KeyI", w: 6 },
      { label: "O", id: "KeyO", w: 6 },
      { label: "P", id: "KeyP", w: 6 },
      { label: "[", id: "KeyBracketLeft", w: 6 },
      { label: "]", id: "KeyBracketRight", w: 6 },
      { label: "\\", id: "KeyBackslash", w: 9 }
    ]
  },
  {
    name: "Home Row",
    keys: [
      { label: "CAPS", id: "KeyCapsLock", w: 11 },
      { label: "A", id: "KeyA", w: 6 },
      { label: "S", id: "KeyS", w: 6 },
      { label: "D", id: "KeyD", w: 6 },
      { label: "F", id: "KeyF", w: 6 },
      { label: "G", id: "KeyG", w: 6 },
      { label: "H", id: "KeyH", w: 6 },
      { label: "J", id: "KeyJ", w: 6 },
      { label: "K", id: "KeyK", w: 6 },
      { label: "L", id: "KeyL", w: 6 },
      { label: ";", id: "KeySemicolon", w: 6 },
      { label: "'", id: "KeyQuote", w: 6 },
      { label: "ENTER", id: "KeyEnter", w: 13 }
    ]
  },
  {
    name: "Bottom Row",
    keys: [
      { label: "SHIFT", id: "KeyShiftLeft", w: 14 },
      { label: "Z", id: "KeyZ", w: 6 },
      { label: "X", id: "KeyX", w: 6 },
      { label: "C", id: "KeyC", w: 6 },
      { label: "V", id: "KeyV", w: 6 },
      { label: "B", id: "KeyB", w: 6 },
      { label: "N", id: "KeyN", w: 6 },
      { label: "M", id: "KeyM", w: 6 },
      { label: ",", id: "KeyComma", w: 6 },
      { label: ".", id: "KeyPeriod", w: 6 },
      { label: "/", id: "KeySlash", w: 6 },
      { label: "SHIFT", id: "KeyShiftRight", w: 14 }
    ]
  },
  {
    name: "Space Row",
    keys: [
      { label: "CTRL", id: "KeyControlLeft", w: 8 },
      { label: "WIN", id: "KeyWin", w: 8 },
      { label: "ALT", id: "KeyAltLeft", w: 8 },
      { label: "SPACE", id: "KeySpace", w: 40 },
      { label: "ALT", id: "KeyAltRight", w: 8 },
      { label: "FN", id: "KeyFn", w: 8 },
      { label: "MENU", id: "KeyMenu", w: 8 },
      { label: "CTRL", id: "KeyControlRight", w: 8 }
    ]
  }
];

const DEFAULT_KEYCAP_COLOR = "#e0e0e0";

export const KeycapArray = ({ size = "60", onClose, onKeycapColorsChange }) => {
  const [currentRow, setCurrentRow] = useState(0);
  const [selectedKey, setSelectedKey] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [currentColor, setCurrentColor] = useState(DEFAULT_KEYCAP_COLOR);
  // 키캡 색상을 ID별로 저장하는 상태
  const [keycapColors, setKeycapColors] = useState({});

  // 키보드 사이즈에 따라 레이아웃 조정 (필요시)
  const keyboardLayout = layout; // 60% 레이아웃만 사용 중

  // 키를 선택하는 핸들러
  const handleKeySelect = useCallback((key) => {
    setSelectedKey(key);
    setCurrentColor(keycapColors[key.id] || DEFAULT_KEYCAP_COLOR);
    setColorPickerVisible(true);
  }, [keycapColors]);

  // 색상 변경 핸들러
  const handleColorChange = useCallback((color) => {
    setCurrentColor(color);
  }, []);

  // 선택된 키에 색상 적용
  const applyColorToKey = useCallback(() => {
    if (!selectedKey) return;
    
    setKeycapColors(prev => ({
      ...prev,
      [selectedKey.id]: currentColor
    }));
  }, [selectedKey, currentColor]);

  // 모든 키캡 색상 초기화
  const resetAllColors = () => {
    setKeycapColors({});
    setCurrentColor(DEFAULT_KEYCAP_COLOR);
  };

  // 선택한 키캡 색상만 초기화
  const resetSelectedColor = () => {
    if (!selectedKey) return;
    
    setKeycapColors(prev => {
      const newColors = { ...prev };
      delete newColors[selectedKey.id];
      return newColors;
    });
    
    setCurrentColor(DEFAULT_KEYCAP_COLOR);
  };

  // 선택한 색상 적용 후 부모 컴포넌트에 변경 사항 전달
  const applyChanges = () => {
    if (onKeycapColorsChange) {
      onKeycapColorsChange(keycapColors);
    }
  };

  // 행 간 이동 핸들러
  const handlePrev = () => {
    if (currentRow > 0) setCurrentRow(currentRow - 1);
  };

  const handleNext = () => {
    if (currentRow < keyboardLayout.length - 1) 
      setCurrentRow(currentRow + 1);
  };

  // 키 색상이 텍스트 색상에 충분한 대비를 가지는지 확인
  const getTextColor = (bgColor) => {
    // HEX 색상을 RGB로 변환
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    
    // 밝기 계산 (YIQ 공식)
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
    // 어두운 배경에는 밝은 텍스트, 밝은 배경에는 어두운 텍스트
    return yiq >= 128 ? '#000000' : '#ffffff';
  };

  // 현재 행 정보
  const currentRowData = keyboardLayout[currentRow];

  return (
    <KeyboardContainer>
      <Header>
        <Title>키캡 커스터마이징</Title>
        <CloseButton onClick={onClose}>✕</CloseButton>
      </Header>
      
      <NavigationControls>
        <ArrowButton onClick={handlePrev} disabled={currentRow === 0}>
          &#9664;
        </ArrowButton>
        <RowIndicator>
          {currentRowData.name} ({currentRow + 1}/{keyboardLayout.length})
        </RowIndicator>
        <ArrowButton 
          onClick={handleNext} 
          disabled={currentRow === keyboardLayout.length - 1}
        >
          &#9654;
        </ArrowButton>
      </NavigationControls>
      
      <RowWrapper>
        <Row>
          {currentRowData.keys.map((key, idx) => (
            <KeyCap 
              key={idx} 
              flex={key.w}
              color={keycapColors[key.id] || DEFAULT_KEYCAP_COLOR}
              textColor={getTextColor(keycapColors[key.id] || DEFAULT_KEYCAP_COLOR)}
              selected={selectedKey && selectedKey.id === key.id}
              onClick={() => handleKeySelect(key)}
            >
              <KeyID>{key.id}</KeyID>
              {key.label}
            </KeyCap>
          ))}
        </Row>
      </RowWrapper>
      
      <ColorPickerContainer visible={colorPickerVisible && selectedKey}>
        <HexColorPicker color={currentColor} onChange={handleColorChange} />
        <ColorPreview>
          <ColorSwatch color={currentColor} />
          <ColorLabel>{selectedKey ? selectedKey.label : '키캡'} 색상:</ColorLabel>
          <ColorInput
            value={currentColor}
            onChange={(e) => {
              const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
              if (hexRegex.test(e.target.value) || e.target.value.startsWith('#')) {
                handleColorChange(e.target.value);
              }
            }}
          />
        </ColorPreview>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <ResetButton onClick={resetSelectedColor}>초기화</ResetButton>
          <ResetButton onClick={applyColorToKey}>적용</ResetButton>
        </div>
      </ColorPickerContainer>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <ResetButton onClick={resetAllColors}>모든 색상 초기화</ResetButton>
        <ApplyButton onClick={applyChanges}>변경사항 적용</ApplyButton>
      </div>
    </KeyboardContainer>
  );
};