import styled from "styled-components";

const ColorZoneContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  position: absolute;
  bottom: 0;
`;

const ColorZone = styled.div`
  flex: 1;
  background-color: ${(props) => props.color};
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  height: 80px;

  &:hover {
    transform: translateY(-5px);
  }
`;

// 청(파랑), 적(빨강), 갈(갈색), 흑(검정)
const defaultColors = [
  "#0000FF", // 청
  "#FF0000", // 적
  "#8B4513", // 갈
  "#000000"  // 흑
];

export const ColorSelect = ({ colors = defaultColors, onColorSelect }) => {
  const handleColorClick = (color) => {
    if (onColorSelect) {
      onColorSelect(color);
    }
  };

  return (
    <ColorZoneContainer>
      {colors.map((color, index) => (
        <ColorZone 
          key={index} 
          color={color} 
          onClick={() => handleColorClick(color)}
        />
      ))}
    </ColorZoneContainer>
  );
};
