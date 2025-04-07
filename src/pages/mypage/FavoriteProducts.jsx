import React, { useState, useEffect, useRef } from "react";
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
  position: relative;

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

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const KeyboardCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  position: relative;

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

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  margin-top: 180px;
`;

const LikesBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  z-index: 5;
`;

const LikeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="red"
    stroke="white"
    strokeWidth="1"
    style={{ marginRight: "4px" }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const FavoriteProducts = () => {
  const [viewMode, setViewMode] = useState("vertical");
  const [keyboards, setKeyboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const horizontalScrollRef = useRef(null);

  useEffect(() => {
    const fetchLikedKeyboards = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/checkliked",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ memberid: 1 }), // 우선 1로 고정
          }
        );

        if (!response.ok) {
          throw new Error("API 요청에 실패했습니다.");
        }

        const result = await response.json();

        if (result.status === "OK" && result.data) {
          setKeyboards(result.data);
        } else {
          throw new Error(
            result.message || "데이터를 불러오는데 실패했습니다."
          );
        }
      } catch (err) {
        setError(err.message);
        console.error("좋아요한 키보드를 불러오는데 실패했습니다:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedKeyboards();
  }, []);

  const scroll = (direction) => {
    if (horizontalScrollRef.current) {
      const scrollAmount = 300;
      const currentScroll = horizontalScrollRef.current.scrollLeft;

      horizontalScrollRef.current.scrollLeft =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>관심 상품</Title>
        <Description>좋아요를 누른 키보드 목록입니다.</Description>
        <LoadingState>
          <h3>데이터를 불러오는 중입니다...</h3>
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>관심 상품</Title>
        <Description>좋아요를 누른 키보드 목록입니다.</Description>
        <EmptyState>
          <h3>오류가 발생했습니다.</h3>
          <p>{error}</p>
        </EmptyState>
      </Container>
    );
  }

  const hasKeyboards = keyboards.length > 0;

  return (
    <Container>
      <Title>관심 상품</Title>
      <Description>좋아요를 누른 키보드 목록입니다.</Description>

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
              {keyboards.map((keyboard) => (
                <KeyboardCard key={keyboard.id}>
                  <LikesBadge>
                    <LikeIcon /> {keyboard.likes}
                  </LikesBadge>
                  <KeyboardImage image={keyboard.imageUrl}>
                    {!keyboard.imageUrl && (
                      <KeyboardImagePlaceholder>
                        키보드 이미지
                      </KeyboardImagePlaceholder>
                    )}
                  </KeyboardImage>
                  <KeyboardInfo>
                    <KeyboardName>
                      {keyboard.keyboardtype || `키보드 #${keyboard.id}`}
                    </KeyboardName>
                    <KeyboardDate>
                      생성일: {formatDate(keyboard.createdAt)}
                    </KeyboardDate>
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
              {keyboards.map((keyboard) => (
                <HorizontalKeyboardCard key={keyboard.id}>
                  <LikesBadge>
                    <LikeIcon /> {keyboard.likes}
                  </LikesBadge>
                  <KeyboardImage image={keyboard.imageUrl}>
                    {!keyboard.imageUrl && (
                      <KeyboardImagePlaceholder>
                        키보드 이미지
                      </KeyboardImagePlaceholder>
                    )}
                  </KeyboardImage>
                  <KeyboardInfo>
                    <KeyboardName>
                      {keyboard.keyboardtype || `키보드 #${keyboard.id}`}
                    </KeyboardName>
                    <KeyboardDate>
                      생성일: {formatDate(keyboard.createdAt)}
                    </KeyboardDate>
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
          <h3>아직 좋아요를 누른 키보드가 없습니다.</h3>
          <p>관심있는 키보드에 좋아요를 누르세요!</p>
        </EmptyState>
      )}
    </Container>
  );
};

export default FavoriteProducts;
