import React, { useState, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  height: 80vh;
  overflow: hidden;
  margin-top: -70px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Description = styled.p`
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
`;

const ViewToggle = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const ToggleButton = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => (props.active ? "#4a90e2" : "#f0f0f0")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: none;
  margin-right: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? "#3a7bc8" : "#e0e0e0")};
  }
`;

const HorizontalScrollContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 1200px;
`;

const HorizontalScroll = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 15px;
  scrollbar-width: thin;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ddd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
  }
`;

const LeftArrow = styled(ArrowButton)`
  left: -18px;
`;
const RightArrow = styled(ArrowButton)`
  right: -18px;
`;

const HorizontalKeyboardCard = styled.div`
  flex: 0 0 auto;
  width: 280px;
  margin-right: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const VerticalScroll = styled.div`
  width: 100%;
  max-width: 1200px;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  padding-right: 15px;
  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
`;

const KeyboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  width: 100%;
`;

const KeyboardCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
`;

const KeyboardImage = styled.div`
  width: 100%;
  height: 180px;
  background-color: #f0f0f0;
  background-image: ${(props) =>
    props.image ? `url(${props.image})` : "none"};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const KeyboardImagePlaceholder = styled.div`
  color: #999;
  font-size: 14px;
`;

const KeyboardInfo = styled.div`
  padding: 12px;
  background-color: white;
`;

const KeyboardName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
`;

const KeyboardDate = styled.div`
  font-size: 12px;
  color: #888;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #f9f9f9;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-top: 180px;
`;

const ArrowIcon = ({ direction }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: direction === "left" ? "rotate(180deg)" : "none" }}
  >
    <path
      d="M5.5 3L10.5 8L5.5 13"
      stroke="#333"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const mockKeyboards = [
  { id: 1, name: "김호연", date: "2025-03-28", image: null },
  { id: 2, name: "현지훈", date: "2025-03-25", image: null },
  { id: 3, name: "조우주", date: "2025-03-20", image: null },
  { id: 4, name: "염정규", date: "2025-03-18", image: null },
];

const MyCustomKeyboard = () => {
  const [viewMode, setViewMode] = useState("vertical");
  const horizontalScrollRef = useRef(null);
  const hasKeyboards = mockKeyboards.length > 0;

  const scroll = (direction) => {
    if (horizontalScrollRef.current) {
      const scrollAmount = 1200;
      const currentScroll = horizontalScrollRef.current.scrollLeft;

      horizontalScrollRef.current.scrollLeft =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
    }
  };

  return (
    <Container>
      <Title>나의 커스텀 키보드</Title>
      <Description>내가 만든 커스텀 키보드 목록입니다.</Description>

      {hasKeyboards && (
        <ViewToggle>
          <ToggleButton
            active={viewMode === "vertical"}
            onClick={() => setViewMode("vertical")}
          >
            세로 스크롤 (가로 5개)
          </ToggleButton>
          <ToggleButton
            active={viewMode === "horizontal"}
            onClick={() => setViewMode("horizontal")}
          >
            가로 스크롤
          </ToggleButton>
        </ViewToggle>
      )}

      {hasKeyboards ? (
        viewMode === "vertical" ? (
          <VerticalScroll>
            <KeyboardGrid>
              {mockKeyboards.map((keyboard) => (
                <KeyboardCard key={keyboard.id}>
                  <KeyboardImage image={keyboard.image}>
                    {!keyboard.image && (
                      <KeyboardImagePlaceholder>
                        키보드 이미지
                      </KeyboardImagePlaceholder>
                    )}
                  </KeyboardImage>
                  <KeyboardInfo>
                    <KeyboardName>{keyboard.name}</KeyboardName>
                    <KeyboardDate>생성일: {keyboard.date}</KeyboardDate>
                  </KeyboardInfo>
                </KeyboardCard>
              ))}
            </KeyboardGrid>
          </VerticalScroll>
        ) : (
          <HorizontalScrollContainer>
            <LeftArrow onClick={() => scroll("left")}>
              <ArrowIcon direction="left" />
            </LeftArrow>

            <HorizontalScroll ref={horizontalScrollRef}>
              {mockKeyboards.map((keyboard) => (
                <HorizontalKeyboardCard key={keyboard.id}>
                  <KeyboardImage image={keyboard.image}>
                    {!keyboard.image && (
                      <KeyboardImagePlaceholder>
                        키보드 이미지
                      </KeyboardImagePlaceholder>
                    )}
                  </KeyboardImage>
                  <KeyboardInfo>
                    <KeyboardName>{keyboard.name}</KeyboardName>
                    <KeyboardDate>생성일: {keyboard.date}</KeyboardDate>
                  </KeyboardInfo>
                </HorizontalKeyboardCard>
              ))}
            </HorizontalScroll>

            <RightArrow onClick={() => scroll("right")}>
              <ArrowIcon direction="right" />
            </RightArrow>
          </HorizontalScrollContainer>
        )
      ) : (
        <EmptyState>
          <h3>아직 만든 커스텀 키보드가 없습니다.</h3>
          <p>새로운 키보드 설정을 만들어 보세요!</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default MyCustomKeyboard;
