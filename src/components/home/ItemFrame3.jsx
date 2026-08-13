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
  const [likingInProgress, setLikingInProgress] = useState(new Set()); // 좋아요 처리 중인 키보드 ID들
  const { user } = useAuthStore();
  const userId = user?.id || "";

  // API 기본 URL 설정
  const API_BASE_URL =
    "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app";

  // 공유된 키보드 목록 가져오기
  useEffect(() => {
    fetchSharedKeyboards();
  }, []);

  // 사용자의 좋아요 상태 가져오기
  useEffect(() => {
    if (user && userId && keyboards.length > 0) {
      fetchUserLikes();
    } else {
      setUserLikes(new Set());
    }
  }, [user, keyboards, userId]);

  // 키보드 목록 가져오기 함수
  const fetchSharedKeyboards = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/shareditems/find"
      );

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
        console.log("키보드 목록 로드 완료:", sortedKeyboards);
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

  // 사용자의 좋아요 목록 가져오기 함수
  const fetchUserLikes = async () => {
    if (!userId) {
      console.log("userId가 없어서 좋아요 확인 스킵");
      setUserLikes(new Set());
      return;
    }

    try {
      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/checkliked",
        { memberid: userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.status === "OK" &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        // 좋아요한 키보드들의 ID를 Set으로 변환
        const likedKeyboardIds = new Set(
          response.data.data.map((keyboard) => {
            console.log("좋아요한 키보드:", keyboard);
            return keyboard.id;
          })
        );
        console.log("좋아요한 키보드 ID 목록:", likedKeyboardIds);
        setUserLikes(likedKeyboardIds);
      } else {
        console.log("예상과 다른 응답 형식:", response.data);
        setUserLikes(new Set());
      }
    } catch (err) {
      console.error("=== 좋아요 확인 에러 ===");
      console.error("에러 메시지:", err.message);
      console.error("응답 상태:", err.response?.status);
      console.error("응답 데이터:", err.response?.data);

      // 404 에러인 경우 (사용자가 좋아요한 항목이 없는 경우)
      if (err.response?.status === 404) {
        console.log("404 에러 - 좋아요한 항목이 없음");
        setUserLikes(new Set());
      } else {
        // 다른 에러의 경우에도 빈 Set으로 설정하여 기능이 계속 작동하도록 함
        setUserLikes(new Set());
      }
    }
  };

  // 좋아요 처리 함수
  const handleLike = async (keyboardId) => {
    try {
      if (!userId) {
        setError("로그인이 필요합니다");
        return;
      }

      // 이미 처리 중인 경우 중복 요청 방지
      if (likingInProgress.has(keyboardId)) {
        return;
      }

      // 좋아요 처리 시작
      setLikingInProgress((prev) => new Set([...prev, keyboardId]));

      const response = await axios.post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/like",
        {
          memberid: userId,
          shareditemid: keyboardId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.status === "OK") {
        console.log("좋아요 처리 성공, 키보드 목록 새로고침");

        // 좋아요 처리 후 키보드 목록을 다시 불러와서 업데이트된 좋아요 개수 반영
        await fetchSharedKeyboards();

        // 사용자 좋아요 상태도 업데이트
        if (userLikes.has(keyboardId)) {
          // 좋아요 취소된 경우
          setUserLikes((prev) => {
            const newSet = new Set(prev);
            newSet.delete(keyboardId);
            return newSet;
          });
        } else {
          // 좋아요 추가된 경우
          setUserLikes((prev) => new Set([...prev, keyboardId]));
        }
      } else {
        throw new Error(response.data.message || "좋아요 처리에 실패했습니다.");
      }
    } catch (err) {
      console.error("좋아요 처리에 실패했습니다:", err);
      alert("좋아요 처리에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      // 좋아요 처리 완료
      setLikingInProgress((prev) => {
        const newSet = new Set(prev);
        newSet.delete(keyboardId);
        return newSet;
      });
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
                style={{
                  opacity: likingInProgress.has(keyboard.id) ? 0.6 : 1,
                  cursor: likingInProgress.has(keyboard.id)
                    ? "wait"
                    : "pointer",
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
