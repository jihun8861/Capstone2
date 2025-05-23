import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexColorPicker } from "react-colorful";

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

const layout60 = [
  {
    name: "Function Row",
    keys: [
      { label: "`~", id: "keycap_Grave", w: 6 }, 
      { label: "1", id: "keycap_1", w: 6 }, 
      { label: "2", id: "keycap_2", w: 6 }, 
      { label: "3", id: "keycap_3", w: 6 },
      { label: "4", id: "keycap_4", w: 6 }, 
      { label: "5", id: "keycap_5", w: 6 }, 
      { label: "6", id: "keycap_6", w: 6 }, 
      { label: "7", id: "keycap_7", w: 6 },
      { label: "8", id: "keycap_8", w: 6 }, 
      { label: "9", id: "keycap_9", w: 6 }, 
      { label: "0", id: "keycap_0", w: 6 }, 
      { label: "-", id: "keycap_Minus", w: 6 },
      { label: "=", id: "keycap_Equals", w: 6 }, 
      { label: "BACK", id: "keycap_BackSpace", w: 12 }
    ]
  },
  {
    name: "Tab Row",
    keys: [
      { label: "TAB", id: "keycap_Tab", w: 9 }, 
      { label: "Q", id: "keycap_Q", w: 6 }, 
      { label: "W", id: "keycap_W", w: 6 }, 
      { label: "E", id: "keycap_E", w: 6 },
      { label: "R", id: "keycap_R", w: 6 }, 
      { label: "T", id: "keycap_T", w: 6 }, 
      { label: "Y", id: "keycap_Y", w: 6 }, 
      { label: "U", id: "keycap_U", w: 6 },
      { label: "I", id: "keycap_I", w: 6 }, 
      { label: "O", id: "keycap_O", w: 6 }, 
      { label: "P", id: "keycap_P", w: 6 }, 
      { label: "[", id: "keycap_LeftBracket", w: 6 },
      { label: "]", id: "keycap_RightBracket", w: 6 }, 
      { label: "\\", id: "keycap_ReverseSlash", w: 9 }
    ]
  },
  {
    name: "Caps Row",
    keys: [
      { label: "CAPS", id: "keycap_CapsLock", w: 11 }, 
      { label: "A", id: "keycap_A", w: 6 }, 
      { label: "S", id: "keycap_S", w: 6 }, 
      { label: "D", id: "keycap_D", w: 6 },
      { label: "F", id: "keycap_F", w: 6 }, 
      { label: "G", id: "keycap_G", w: 6 }, 
      { label: "H", id: "keycap_H", w: 6 }, 
      { label: "J", id: "keycap_J", w: 6 },
      { label: "K", id: "keycap_K", w: 6 }, 
      { label: "L", id: "keycap_L", w: 6 }, 
      { label: ";", id: "keycap_Semicolon", w: 6 }, 
      { label: "'", id: "keycap_Quote", w: 6 },
      { label: "ENTER", id: "keycap_Enter", w: 13 }
    ]
  },
  {
    name: "Shift Row",
    keys: [
      { label: "SHIFT", id: "keycap_LShift", w: 14 }, 
      { label: "Z", id: "keycap_Z", w: 6 }, 
      { label: "X", id: "keycap_X", w: 6 }, 
      { label: "C", id: "keycap_C", w: 6 },
      { label: "V", id: "keycap_V", w: 6 }, 
      { label: "B", id: "keycap_B", w: 6 }, 
      { label: "N", id: "keycap_N", w: 6 }, 
      { label: "M", id: "keycap_M", w: 6 },
      { label: ",", id: "keycap_Comma", w: 6 }, 
      { label: ".", id: "keycap_Dot", w: 6 }, 
      { label: "/", id: "keycap_Slash", w: 6 }, 
      { label: "SHIFT", id: "keycap_RShift", w: 14 }
    ]
  },
  {
    name: "Bottom Row",
    keys: [
      { label: "CTRL", id: "keycap_LCtrl", w: 9 }, 
      { label: "WIN", id: "keycap_Window", w: 9 }, 
      { label: "ALT", id: "keycap_LAlt", w: 9 },
      { label: "SPACE", id: "keycap_Space", w: 42 },
      { label: "ALT", id: "keycap_RAlt", w: 9 }, 
      { label: "FN", id: "keycap_Fn", w: 9 },
      { label: "MENU", id: "keycap_Menu", w: 9 }, 
      { label: "CTRL", id: "keycap_RCtrl", w: 9 }
    ]
  }
];

const layout80 = [
  {
    name: "Function Keys",
    keys: [
      { label: "ESC", id: "keycap_Esc", w: 6 },
      { label: "F1", id: "keycap_F1", w: 6 }, 
      { label: "F2", id: "keycap_F2", w: 6 }, 
      { label: "F3", id: "keycap_F3", w: 6 }, 
      { label: "F4", id: "keycap_F4", w: 6 },
      { label: "F5", id: "keycap_F5", w: 6 }, 
      { label: "F6", id: "keycap_F6", w: 6 }, 
      { label: "F7", id: "keycap_F7", w: 6 }, 
      { label: "F8", id: "keycap_F8", w: 6 },
      { label: "F9", id: "keycap_F9", w: 6 }, 
      { label: "F10", id: "keycap_F10", w: 6 }, 
      { label: "F11", id: "keycap_F11", w: 6 }, 
      { label: "F12", id: "keycap_F12", w: 6 },
      { label: "INS", id: "keycap_Insert", w: 6 }, 
      { label: "HOME", id: "keycap_Home", w: 6 }, 
      { label: "PGUP", id: "keycap_PgUp", w: 6 }
    ]
  },
  {
    name: "Number Row",
    keys: [
      { label: "`~", id: "keycap_Grave", w: 6 }, 
      { label: "1", id: "keycap_1", w: 6 }, 
      { label: "2", id: "keycap_2", w: 6 }, 
      { label: "3", id: "keycap_3", w: 6 },
      { label: "4", id: "keycap_4", w: 6 }, 
      { label: "5", id: "keycap_5", w: 6 }, 
      { label: "6", id: "keycap_6", w: 6 }, 
      { label: "7", id: "keycap_7", w: 6 },
      { label: "8", id: "keycap_8", w: 6 }, 
      { label: "9", id: "keycap_9", w: 6 }, 
      { label: "0", id: "keycap_0", w: 6 }, 
      { label: "-", id: "keycap_Minus", w: 6 },
      { label: "=", id: "keycap_Equals", w: 6 }, 
      { label: "BACK", id: "keycap_BackSpace", w: 12 },
      { label: "DEL", id: "keycap_Delete", w: 6 }, 
      { label: "END", id: "keycap_End", w: 6 }, 
      { label: "PGDN", id: "keycap_PgDn", w: 6 }
    ]
  },
  {
    name: "Tab Row",
    keys: [
      { label: "TAB", id: "keycap_Tab", w: 9 }, 
      { label: "Q", id: "keycap_Q", w: 6 }, 
      { label: "W", id: "keycap_W", w: 6 }, 
      { label: "E", id: "keycap_E", w: 6 },
      { label: "R", id: "keycap_R", w: 6 }, 
      { label: "T", id: "keycap_T", w: 6 }, 
      { label: "Y", id: "keycap_Y", w: 6 }, 
      { label: "U", id: "keycap_U", w: 6 },
      { label: "I", id: "keycap_I", w: 6 }, 
      { label: "O", id: "keycap_O", w: 6 }, 
      { label: "P", id: "keycap_P", w: 6 }, 
      { label: "[", id: "keycap_LeftBracket", w: 6 },
      { label: "]", id: "keycap_RightBracket", w: 6 }, 
      { label: "\\", id: "keycap_ReverseSlash", w: 9 }
    ]
  },
  {
    name: "Caps Row",
    keys: [
      { label: "CAPS", id: "keycap_CapsLock", w: 11 }, 
      { label: "A", id: "keycap_A", w: 6 }, 
      { label: "S", id: "keycap_S", w: 6 }, 
      { label: "D", id: "keycap_D", w: 6 },
      { label: "F", id: "keycap_F", w: 6 }, 
      { label: "G", id: "keycap_G", w: 6 }, 
      { label: "H", id: "keycap_H", w: 6 }, 
      { label: "J", id: "keycap_J", w: 6 },
      { label: "K", id: "keycap_K", w: 6 }, 
      { label: "L", id: "keycap_L", w: 6 }, 
      { label: ";", id: "keycap_Semicolon", w: 6 }, 
      { label: "'", id: "keycap_Quote", w: 6 },
      { label: "ENTER", id: "keycap_Enter", w: 13 }
    ]
  },
  {
    name: "Shift Row",
    keys: [
      { label: "SHIFT", id: "keycap_LShift", w: 14 }, 
      { label: "Z", id: "keycap_Z", w: 6 }, 
      { label: "X", id: "keycap_X", w: 6 }, 
      { label: "C", id: "keycap_C", w: 6 },
      { label: "V", id: "keycap_V", w: 6 }, 
      { label: "B", id: "keycap_B", w: 6 }, 
      { label: "N", id: "keycap_N", w: 6 }, 
      { label: "M", id: "keycap_M", w: 6 },
      { label: ",", id: "keycap_Comma", w: 6 }, 
      { label: ".", id: "keycap_Dot", w: 6 }, 
      { label: "/", id: "keycap_Slash", w: 6 }, 
      { label: "SHIFT", id: "keycap_RShift", w: 14 },
      { label: "↑", id: "keycap_Up", w: 6 }
    ]
  },
  {
    name: "Bottom Row",
    keys: [
      { label: "CTRL", id: "keycap_LCtrl", w: 9 }, 
      { label: "WIN", id: "keycap_Window", w: 9 }, 
      { label: "ALT", id: "keycap_LAlt", w: 9 },
      { label: "SPACE", id: "keycap_Space", w: 42 },
      { label: "ALT", id: "keycap_RAlt", w: 9 }, 
      { label: "FN", id: "keycap_Fn", w: 9 },
      { label: "MENU", id: "keycap_Menu", w: 9 }, 
      { label: "CTRL", id: "keycap_RCtrl", w: 9 },
      { label: "←", id: "keycap_Left", w: 6 }, 
      { label: "↓", id: "keycap_Down", w: 6 }, 
      { label: "→", id: "keycap_Right", w: 6 }
    ]
  }
];

const layout100 = [
  {
    name: "Function Keys",
    keys: [
      { label: "ESC", id: "keycap_Esc", w: 6 },
      { label: "F1", id: "keycap_F1", w: 6 }, 
      { label: "F2", id: "keycap_F2", w: 6 }, 
      { label: "F3", id: "keycap_F3", w: 6 }, 
      { label: "F4", id: "keycap_F4", w: 6 },
      { label: "F5", id: "keycap_F5", w: 6 }, 
      { label: "F6", id: "keycap_F6", w: 6 }, 
      { label: "F7", id: "keycap_F7", w: 6 }, 
      { label: "F8", id: "keycap_F8", w: 6 },
      { label: "F9", id: "keycap_F9", w: 6 }, 
      { label: "F10", id: "keycap_F10", w: 6 }, 
      { label: "F11", id: "keycap_F11", w: 6 }, 
      { label: "F12", id: "keycap_F12", w: 6 },
      { label: "INS", id: "keycap_Insert", w: 6 }, 
      { label: "HOME", id: "keycap_Home", w: 6 }, 
      { label: "PGUP", id: "keycap_PgUp", w: 6 },
      { label: "NUM", id: "keycap_NumLock", w: 6 }, 
      { label: "/", id: "keycap_KeySlash", w: 6 }, 
      { label: "*", id: "keycap_KeyStar", w: 6 }, 
      { label: "-", id: "keycap_KeyMinus", w: 6 }
    ]
  },
  {
    name: "Number Row",
    keys: [
      { label: "`~", id: "keycap_Grave", w: 6 }, 
      { label: "1", id: "keycap_1", w: 6 }, 
      { label: "2", id: "keycap_2", w: 6 }, 
      { label: "3", id: "keycap_3", w: 6 },
      { label: "4", id: "keycap_4", w: 6 }, 
      { label: "5", id: "keycap_5", w: 6 }, 
      { label: "6", id: "keycap_6", w: 6 }, 
      { label: "7", id: "keycap_7", w: 6 },
      { label: "8", id: "keycap_8", w: 6 }, 
      { label: "9", id: "keycap_9", w: 6 }, 
      { label: "0", id: "keycap_0", w: 6 }, 
      { label: "-", id: "keycap_Minus", w: 6 },
      { label: "=", id: "keycap_Equals", w: 6 }, 
      { label: "BACK", id: "keycap_BackSpace", w: 12 },
      { label: "DEL", id: "keycap_Delete", w: 6 }, 
      { label: "END", id: "keycap_End", w: 6 }, 
      { label: "PGDN", id: "keycap_PgDn", w: 6 },
      { label: "7", id: "keycap_Key7", w: 6 }, 
      { label: "8", id: "keycap_Key8", w: 6 }, 
      { label: "9", id: "keycap_Key9", w: 6 }, 
      { label: "+", id: "keycap_KeyPlus", w: 6 }
    ]
  },
  {
    name: "Tab Row",
    keys: [
      { label: "TAB", id: "keycap_Tab", w: 9 }, 
      { label: "Q", id: "keycap_Q", w: 6 }, 
      { label: "W", id: "keycap_W", w: 6 }, 
      { label: "E", id: "keycap_E", w: 6 },
      { label: "R", id: "keycap_R", w: 6 }, 
      { label: "T", id: "keycap_T", w: 6 }, 
      { label: "Y", id: "keycap_Y", w: 6 }, 
      { label: "U", id: "keycap_U", w: 6 },
      { label: "I", id: "keycap_I", w: 6 }, 
      { label: "O", id: "keycap_O", w: 6 }, 
      { label: "P", id: "keycap_P", w: 6 }, 
      { label: "[", id: "keycap_LeftBracket", w: 6 },
      { label: "]", id: "keycap_RightBracket", w: 6 }, 
      { label: "\\", id: "keycap_ReverseSlash", w: 9 },
      { label: "4", id: "keycap_Key4", w: 6 }, 
      { label: "5", id: "keycap_Key5", w: 6 }, 
      { label: "6", id: "keycap_Key6", w: 6 }
    ]
  },
  {
    name: "Caps Row",
    keys: [
      { label: "CAPS", id: "keycap_CapsLock", w: 11 }, 
      { label: "A", id: "keycap_A", w: 6 }, 
      { label: "S", id: "keycap_S", w: 6 }, 
      { label: "D", id: "keycap_D", w: 6 },
      { label: "F", id: "keycap_F", w: 6 }, 
      { label: "G", id: "keycap_G", w: 6 }, 
      { label: "H", id: "keycap_H", w: 6 }, 
      { label: "J", id: "keycap_J", w: 6 },
      { label: "K", id: "keycap_K", w: 6 }, 
      { label: "L", id: "keycap_L", w: 6 }, 
      { label: ";", id: "keycap_Semicolon", w: 6 }, 
      { label: "'", id: "keycap_Quote", w: 6 },
      { label: "ENTER", id: "keycap_Enter", w: 13 },
      { label: "1", id: "keycap_Key1", w: 6 }, 
      { label: "2", id: "keycap_Key2", w: 6 }, 
      { label: "3", id: "keycap_Key3", w: 6 }, 
      { label: "ENT", id: "keycap_KeyEnter", w: 6 }
    ]
  },
  {
    name: "Shift Row",
    keys: [
      { label: "SHIFT", id: "keycap_LShift", w: 14 }, 
      { label: "Z", id: "keycap_Z", w: 6 }, 
      { label: "X", id: "keycap_X", w: 6 }, 
      { label: "C", id: "keycap_C", w: 6 },
      { label: "V", id: "keycap_V", w: 6 }, 
      { label: "B", id: "keycap_B", w: 6 }, 
      { label: "N", id: "keycap_N", w: 6 }, 
      { label: "M", id: "keycap_M", w: 6 },
      { label: ",", id: "keycap_Comma", w: 6 }, 
      { label: ".", id: "keycap_Dot", w: 6 }, 
      { label: "/", id: "keycap_Slash", w: 6 }, 
      { label: "SHIFT", id: "keycap_RShift", w: 14 },
      { label: "↑", id: "keycap_Up", w: 6 },
      { label: "0", id: "keycap_Key0", w: 12 }, 
      { label: ".", id: "keycap_KeyDot", w: 6 }
    ]
  },
  {
    name: "Bottom Row",
    keys: [
      { label: "CTRL", id: "keycap_LCtrl", w: 9 }, 
      { label: "WIN", id: "keycap_Window", w: 9 }, 
      { label: "ALT", id: "keycap_LAlt", w: 9 },
      { label: "SPACE", id: "keycap_Space", w: 42 },
      { label: "ALT", id: "keycap_RAlt", w: 9 }, 
      { label: "FN", id: "keycap_Fn", w: 9 },
      { label: "MENU", id: "keycap_Menu", w: 9 }, 
      { label: "CTRL", id: "keycap_RCtrl", w: 9 },
      { label: "←", id: "keycap_Left", w: 6 }, 
      { label: "↓", id: "keycap_Down", w: 6 }, 
      { label: "→", id: "keycap_Right", w: 6 }
    ]
  }
];

// 키보드 레이아웃 매핑
const keyboardLayouts = {
  "60": layout60,
  "80": layout80,
  "100": layout100
};

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
  
  // 키보드 크기에 맞는 레이아웃 선택
  const layout = keyboardLayouts[size] || layout60;

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