import React, { useState } from "react";
import styled from "styled-components";

const KeyboardContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: none;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background-color: #e0e0e0;
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin: 0 1px;
  font-size: 14px;
  user-select: none;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
  }
`;

// 레이아웃: 총 5줄, 각 줄은 총합 100의 비율로 구성
const layout = [
  {
    keys: [
      { label: "ESC", w: 6 }, { label: "1", w: 6 }, { label: "2", w: 6 }, { label: "3", w: 6 },
      { label: "4", w: 6 }, { label: "5", w: 6 }, { label: "6", w: 6 }, { label: "7", w: 6 },
      { label: "8", w: 6 }, { label: "9", w: 6 }, { label: "0", w: 6 }, { label: "-", w: 6 },
      { label: "=", w: 6 }, { label: "BACK", w: 16 }
    ]
  },
  {
    keys: [
      { label: "TAB", w: 10 }, { label: "Q", w: 6 }, { label: "W", w: 6 }, { label: "E", w: 6 },
      { label: "R", w: 6 }, { label: "T", w: 6 }, { label: "Y", w: 6 }, { label: "U", w: 6 },
      { label: "I", w: 6 }, { label: "O", w: 6 }, { label: "P", w: 6 }, { label: "[", w: 6 },
      { label: "]", w: 6 }, { label: "\\", w: 6 }
    ]
  },
  {
    keys: [
      { label: "CAPS", w: 12 }, { label: "A", w: 6 }, { label: "S", w: 6 }, { label: "D", w: 6 },
      { label: "F", w: 6 }, { label: "G", w: 6 }, { label: "H", w: 6 }, { label: "J", w: 6 },
      { label: "K", w: 6 }, { label: "L", w: 6 }, { label: ";", w: 6 }, { label: "'", w: 6 },
      { label: "ENTER", w: 12 }
    ]
  },
  {
    keys: [
      { label: "SHIFT", w: 14 }, { label: "Z", w: 6 }, { label: "X", w: 6 }, { label: "C", w: 6 },
      { label: "V", w: 6 }, { label: "B", w: 6 }, { label: "N", w: 6 }, { label: "M", w: 6 },
      { label: ",", w: 6 }, { label: ".", w: 6 }, { label: "/", w: 6 }, { label: "SHIFT", w: 14 }
    ]
  },
  {
    keys: [
      { label: "CTRL", w: 8 }, { label: "WIN", w: 8 }, { label: "ALT", w: 8 },
      { label: "SPACE", w: 40 },
      { label: "ALT", w: 8 }, { label: "FN", w: 8 }, { label: "CTRL", w: 10 }
    ]
  }
];

export const KeycapArray = () => {
  const [currentRow, setCurrentRow] = useState(0);

  const handlePrev = () => {
    if (currentRow > 0) setCurrentRow(currentRow - 1);
  };

  const handleNext = () => {
    if (currentRow < layout.length - 1) setCurrentRow(currentRow + 1);
  };

  return (
    <KeyboardContainer>
      <ArrowButton onClick={handlePrev} disabled={currentRow === 0}>〈</ArrowButton>
      <RowWrapper>
        <Row>
          {layout[currentRow].keys.map((key, idx) => (
            <KeyCap key={idx} flex={key.w}>
              {key.label}
            </KeyCap>
          ))}
        </Row>
      </RowWrapper>
      <ArrowButton onClick={handleNext} disabled={currentRow === layout.length - 1}>〉</ArrowButton>
    </KeyboardContainer>
  );
};
