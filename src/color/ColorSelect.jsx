import styled from "styled-components";

const ColorZoneContainer = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
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

const defaultColors = [
  "#FF5733", "#FFC300", "#FF33FF", "#33FF57", "#33A1FF",
  "#8D33FF", "#FF5733", "#FFD700", "#00FA9A", "#DC143C"
];

export const ColorSelect = ({ colors = defaultColors }) => {
  return (
    <ColorZoneContainer>
      {colors.map((color, index) => (
        <ColorZone key={index} color={color} />
      ))}
    </ColorZoneContainer>
  );
};
