import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useAuthStore } from "../../api/useAuthStore";

// styled-components 트랜지언트 프롭(transient props) 적용
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 30px 20px;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  font-size: 24px;
  text-align: center;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
  max-width: 700px;
`;

const HorizontalScrollContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 10px 0;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const KeyboardRow = styled.div`
  display: flex;
  gap: 20px;
  padding: 10px 5px;
  min-width: max-content;
`;

const KeyboardCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  position: relative;
  background-color: white;
  min-width: 250px;
  width: 250px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
`;

const KeyboardImage = styled.div`
  width: 100%;
  height: 150px;
  background-color: #f5f5f5;
  background-image: ${(props) =>
    props.$image ? `url(${props.$image})` : "none"};
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
  padding: 15px;
  background-color: white;
`;

const KeyboardTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const KeyboardMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  color: #777;
`;

const KeyboardOwner = styled.span``;

const KeyboardDate = styled.span``;

const LikesBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: ${(props) =>
    props.$isLiked ? "rgba(255, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.6)"};
  color: white;
  border-radius: 20px;
  padding: 5px 10px;
  font-size: 12px;
  display: flex;
  align-items: center;
  z-index: 5;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  width: 100%;
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #fff0f0;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  text-align: center;
`;

const NoResultsState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
  font-size: 16px;
`;

// SVG 아이콘 컴포넌트로 분리하여 정의
const LikeIcon = ({ isLiked }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={isLiked ? "red" : "none"}
    stroke={isLiked ? "white" : "white"}
    strokeWidth="1"
    style={{ marginRight: "4px" }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

export const ItemFrame3 = () => {
  // 상태 관리
  const [keyboards, setKeyboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLikes, setUserLikes] = useState(new Set());
  const { user } = useAuthStore();

  // API 기본 URL 설정
  const API_BASE_URL =
    "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app";

  // 공유된 키보드 목록 가져오기
  useEffect(() => {
    fetchSharedKeyboards();
  }, []);

  // 현재 사용자의 좋아요 상태 처리
  useEffect(() => {
    if (user && user.id && keyboards.length > 0) {
      // 좋아요한 키보드 ID 설정 - 서버에서 반환된 데이터 기반
      const likedKeyboardIds = new Set();

      // 여기서 사용자가 좋아요한 키보드를 식별하는 로직이 필요합니다
      // API가 해당 사용자의 좋아요 정보를 제공한다면 그것을 사용하고,
      // 그렇지 않다면 클라이언트에서 추적해야 합니다.

      setUserLikes(likedKeyboardIds);
    } else {
      setUserLikes(new Set());
    }
  }, [user, keyboards]);

  // 키보드 목록 가져오기 함수
  const fetchSharedKeyboards = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/shareditems/find`);

      if (
        response.data &&
        response.data.status === "OK" &&
        response.data.data
      ) {
        // 데이터 순서 정렬 (최신순)
        const sortedKeyboards = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setKeyboards(sortedKeyboards);
      } else {
        throw new Error(
          response.data?.message || "데이터를 불러오는데 실패했습니다."
        );
      }
    } catch (err) {
      setError(err.message || "키보드 목록을 불러오는 중 오류가 발생했습니다.");
      console.error("공유된 키보드를 불러오는데 실패했습니다:", err);
    } finally {
      setLoading(false);
    }
  };

  // 좋아요 처리 함수
  const handleLike = async (keyboardId) => {
    // 로그인 여부 확인
    if (!user || !user.id) {
      alert("좋아요를 누르려면 로그인이 필요합니다.");
      return;
    }

    try {
      // 현재 좋아요 상태 확인
      const isCurrentlyLiked = userLikes.has(keyboardId);

      // 낙관적 UI 업데이트 (UI를 먼저 변경)
      setUserLikes((prev) => {
        const newLikes = new Set(prev);
        if (isCurrentlyLiked) {
          newLikes.delete(keyboardId);
        } else {
          newLikes.add(keyboardId);
        }
        return newLikes;
      });

      // 좋아요 수 업데이트
      setKeyboards((prev) =>
        prev.map((keyboard) =>
          keyboard.id === keyboardId
            ? {
                ...keyboard,
                likes: isCurrentlyLiked
                  ? Math.max(0, keyboard.likes - 1)
                  : keyboard.likes + 1,
              }
            : keyboard
        )
      );

      // API 요청
      try {
        const response = await axios.post(
          `${API_BASE_URL}/like`,
          {
            memberId: user.id,
            sharedItemId: keyboardId,
          },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        );

        // API 응답 확인
        if (!response.data || response.data.status !== "OK") {
          console.warn("좋아요 API 응답이 예상과 다릅니다:", response.data);
          // 여기서는 에러를 던지지 않고 경고만 기록합니다.
        }
      } catch (apiError) {
        console.error("좋아요 API 요청 실패:", apiError);
        // API 오류가 발생해도 UI를 원래대로 되돌리지 않습니다.
        // 서버 동기화 문제는 다음 페이지 로드 시 해결됩니다.
      }
    } catch (err) {
      console.error("좋아요 처리 중 예상치 못한 오류:", err);
    }
  };

  // 로딩 상태 표시
  if (loading) {
    return (
      <Container>
        <Title>사용자 공유 키보드</Title>
        <Description>
          다른 사용자들이 공유한 키보드 디자인을 확인해보세요.
        </Description>
        <LoadingState>
          <h3>키보드 목록을 불러오는 중입니다...</h3>
        </LoadingState>
      </Container>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <Container>
        <Title>사용자 공유 키보드</Title>
        <Description>
          다른 사용자들이 공유한 키보드 디자인을 확인해보세요.
        </Description>
        <ErrorState>
          <h3>오류가 발생했습니다.</h3>
          <p>{error}</p>
        </ErrorState>
      </Container>
    );
  }

  // 결과가 없는 경우
  if (keyboards.length === 0) {
    return (
      <Container>
        <Title>사용자 공유 키보드</Title>
        <Description>
          다른 사용자들이 공유한 키보드 디자인을 확인해보세요.
        </Description>
        <NoResultsState>
          <p>공유된 키보드가 없습니다.</p>
        </NoResultsState>
      </Container>
    );
  }

  // 정상 렌더링
  return (
    <Container>
      <Title>사용자 공유 키보드</Title>
      <Description>
        다른 사용자들이 공유한 키보드 디자인을 확인하고 영감을 얻어보세요.
      </Description>

      <HorizontalScrollContainer>
        <KeyboardRow>
          {keyboards.map((keyboard) => (
            <KeyboardCard
              key={keyboard.id}
              onClick={() => {
                // 키보드 상세보기 기능 (미구현)
                console.log(`키보드 상세보기: ${keyboard.id}`);
              }}
            >
              <LikesBadge
                $isLiked={userLikes.has(keyboard.id)}
                onClick={(e) => {
                  e.stopPropagation(); // 클릭 이벤트 버블링 방지
                  handleLike(keyboard.id);
                }}
              >
                <LikeIcon isLiked={userLikes.has(keyboard.id)} />
                {keyboard.likes || 0}
              </LikesBadge>

              <KeyboardImage $image={keyboard.imageUrl}>
                {!keyboard.imageUrl && (
                  <KeyboardImagePlaceholder>
                    키보드 이미지
                  </KeyboardImagePlaceholder>
                )}
              </KeyboardImage>

              <KeyboardInfo>
                <KeyboardTitle>
                  {keyboard.title || `키보드 #${keyboard.id}`}
                </KeyboardTitle>
                <KeyboardMeta>
                  <KeyboardOwner>제작: {keyboard.sharedBy}</KeyboardOwner>
                  <KeyboardDate>{formatDate(keyboard.createdAt)}</KeyboardDate>
                </KeyboardMeta>
              </KeyboardInfo>
            </KeyboardCard>
          ))}
        </KeyboardRow>
      </HorizontalScrollContainer>
    </Container>
  );
};
