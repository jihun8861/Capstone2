import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../api/useAuthStore";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  height: 80vh;
  overflow: hidden;
  margin-top: -30px;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1400px) {
    grid-template-columns: repeat(5, 1fr);
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

const KeyboardDetails = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const LoadingState = styled.div`
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

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #fff0f0;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: center;
  margin-top: 180px;
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const MyCustomKeyboard = () => {
  const [viewMode, setViewMode] = useState("vertical");
  const [keyboards, setKeyboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const horizontalScrollRef = useRef(null);

  const { user } = useAuthStore();
  const userEmail = user?.email || "";

  useEffect(() => {
    const fetchKeyboards = async () => {
      if (!userEmail) {
        setLoading(false);
        setError("로그인이 필요합니다.");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(
          "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/items/find",
          { email: userEmail },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        );

        if (
          response.data &&
          response.data.status === "OK" &&
          Array.isArray(response.data.data)
        ) {
          setKeyboards(response.data.data);
        } else {
          throw new Error("응답 형식이 올바르지 않습니다");
        }
      } catch (err) {
        console.error("키보드 목록 불러오기 오류:", err);
        console.log(userEmail);
        setError("키보드 목록을 불러오는 데 실패했습니다. 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchKeyboards();
  }, [userEmail]);

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

  const getKeyboardName = (keyboard, index) => {
    return keyboard.keyboardtype && keyboard.keyboardtype !== "string"
      ? keyboard.keyboardtype
      : `커스텀 키보드 ${index + 1}`;
  };

  if (!userEmail) {
    return (
      <Container>
        <Title>나의 커스텀 키보드</Title>
        <ErrorState>
          <h3>로그인이 필요합니다</h3>
          <p>키보드 목록을 보려면 로그인해 주세요.</p>
        </ErrorState>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <Title>나의 커스텀 키보드</Title>
        <LoadingState>
          <h3>키보드 목록을 불러오는 중입니다...</h3>
        </LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>나의 커스텀 키보드</Title>
        <ErrorState>
          <h3>오류가 발생했습니다</h3>
          <p>{error}</p>
        </ErrorState>
      </Container>
    );
  }

  const hasKeyboards = keyboards.length > 0;

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
            세로 스크롤
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
              {keyboards.map((keyboard, index) => (
                <KeyboardCard key={keyboard.id}>
                  <KeyboardImage image={keyboard.imageUrl}>
                    {!keyboard.imageUrl && (
                      <KeyboardImagePlaceholder>
                        키보드 이미지
                      </KeyboardImagePlaceholder>
                    )}
                  </KeyboardImage>
                  <KeyboardInfo>
                    <KeyboardName>
                      {getKeyboardName(keyboard, index)}
                    </KeyboardName>
                    <KeyboardDate>
                      생성일: {formatDate(keyboard.createdAt)}
                    </KeyboardDate>
                    <KeyboardDetails>
                      {keyboard.barebonecolor !== "string" &&
                        `바디: ${keyboard.barebonecolor} • `}
                      {keyboard.keycapcolor !== "string" &&
                        `키캡: ${keyboard.keycapcolor} • `}
                      {keyboard.switchcolor !== "string" &&
                        `스위치: ${keyboard.switchcolor}`}
                    </KeyboardDetails>
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
              {keyboards.map((keyboard, index) => (
                <HorizontalKeyboardCard key={keyboard.id}>
                  <KeyboardImage image={keyboard.imageUrl}>
                    {!keyboard.imageUrl && (
                      <KeyboardImagePlaceholder>
                        키보드 이미지
                      </KeyboardImagePlaceholder>
                    )}
                  </KeyboardImage>
                  <KeyboardInfo>
                    <KeyboardName>
                      {getKeyboardName(keyboard, index)}
                    </KeyboardName>
                    <KeyboardDate>
                      생성일: {formatDate(keyboard.createdAt)}
                    </KeyboardDate>
                    <KeyboardDetails>
                      {keyboard.barebonecolor !== "string" &&
                        `바디: ${keyboard.barebonecolor} • `}
                      {keyboard.keycapcolor !== "string" &&
                        `키캡: ${keyboard.keycapcolor} • `}
                      {keyboard.switchcolor !== "string" &&
                        `스위치: ${keyboard.switchcolor}`}
                    </KeyboardDetails>
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
