import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuthStore } from "../../api/useAuthStore";
import axios from "axios";
import { shareItem } from "../../api/shareItem"; // 공유 기능 import 추가
import { FiShare2 } from "react-icons/fi"; // 공유 아이콘 추가

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

// 좋아요 아이콘과 숫자를 표시하는 배지 추가
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

// 공유 배지 추가
const ShareBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 5;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

// 알림 토스트 컴포넌트 추가
const Toast = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.success ? "#4caf50" : "#f44336")};
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  opacity: ${(props) => (props.show ? 1 : 0)};
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  transition: opacity 0.3s, visibility 0.3s;
`;

// 좋아요 아이콘 컴포넌트
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const MyCustomKeyboard = () => {
  const [keyboards, setKeyboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    success: true,
  });

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
          // API 응답에서 각 키보드에 likes 필드가 없다면 추가 API 호출로 좋아요 정보를 가져와야 할 수 있음
          // 여기서는 응답에 likes 필드가 있다고 가정합니다
          setKeyboards(response.data.data);
        } else {
          throw new Error("응답 형식이 올바르지 않습니다");
        }
      } catch (err) {
        console.error("키보드 목록 불러오기 오류:", err);
        setError(
          err.response?.data?.message || "데이터를 불러오는데 실패했습니다"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKeyboards();
  }, [userEmail]);

  // 토스트 메시지 표시 함수
  const showToast = (message, success = true) => {
    setToast({ show: true, message, success });
    setTimeout(() => {
      setToast({ ...toast, show: false });
    }, 3000);
  };

  // 공유 기능 처리 함수
  const handleShare = async (keyboard, e) => {
    e.stopPropagation(); // 카드 전체 클릭 이벤트 방지

    if (!userEmail) {
      showToast("로그인이 필요합니다.", false);
      return;
    }

    try {
      // FormData 객체 생성
      const formData = new FormData();

      // JSON 데이터 생성
      const jsonData = {
        email: userEmail,
        barebonecolor: keyboard.barebonecolor || "string",
        keyboardtype: keyboard.keyboardtype || "string",
        keycapcolor: keyboard.keycapcolor || "string",
        design: keyboard.design || "string",
        switchcolor: keyboard.switchcolor || "string",
      };

      console.log("공유할 키보드 데이터:", keyboard);
      console.log("FormData에 추가할 JSON:", jsonData);

      // FormData에 JSON 추가
      formData.append(
        "DTO",
        new Blob([JSON.stringify(jsonData)], {
          type: "application/json",
        })
      );

      // 이미지 처리
      if (keyboard.imageUrl) {
        try {
          // 이미지 URL에서 데이터 가져오기 (CORS 문제 발생 가능)
          const imageResponse = await fetch(keyboard.imageUrl);
          const imageBlob = await imageResponse.blob();

          // 파일 이름 생성
          const fileName = `shared_keyboard_${new Date().getTime()}.png`;
          const file = new File([imageBlob], fileName, { type: "image/png" });

          // FormData에 파일 추가
          formData.append("file", file);
        } catch (imageError) {
          console.error("이미지 처리 오류:", imageError);
          // 이미지 처리 오류가 있어도 JSON 데이터만으로 계속 진행
        }
      }

      console.log("FormData 내용 확인:");
      for (let pair of formData.entries()) {
        console.log(pair[0], typeof pair[1], pair[1]);
      }

      // API 호출
      const result = await shareItem(formData);
      console.log("API 응답:", result);

      if (result.success) {
        showToast("키보드가 성공적으로 공유되었습니다!", true);
      } else {
        throw new Error(result.message || "공유 중 오류가 발생했습니다.");
      }
    } catch (err) {
      console.error("키보드 공유 오류:", err);
      showToast(err.message || "공유 중 오류가 발생했습니다.", false);
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

      {hasKeyboards ? (
        <VerticalScroll>
          <KeyboardGrid>
            {keyboards.map((keyboard, index) => (
              <KeyboardCard key={keyboard.id}>
                {/* 좋아요 배지 */}
                <LikesBadge>
                  <LikeIcon /> {keyboard.likes || 0}
                </LikesBadge>

                {/* 공유 배지 추가 */}
                <ShareBadge onClick={(e) => handleShare(keyboard, e)}>
                  <FiShare2 size={14} /> 공유
                </ShareBadge>

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
        <EmptyState>
          <h3>아직 만든 커스텀 키보드가 없습니다.</h3>
          <p>새로운 키보드 설정을 만들어 보세요!</p>
        </EmptyState>
      )}

      {/* 토스트 메시지 컴포넌트 */}
      <Toast show={toast.show} success={toast.success}>
        {toast.message}
      </Toast>
    </Container>
  );
};

export default MyCustomKeyboard;
