import React, { useState } from "react";
import styled from "styled-components";
import { FiShare2 } from "react-icons/fi";
import { fetchKeyboardRecommendation } from "../../api/recommendation";

// 스타일 컴포넌트 정의
const RecommendationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow-y: auto;
`;

const RecommendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: white;
  padding: 10px 16px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  margin-bottom: 15px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f0f0;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  svg {
    font-size: 18px;
  }
`;

const DescriptionTitle = styled.h4`
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
  color: #333;
`;

const RecommendationItem = styled.div`
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const ColorDisplay = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const ColorSwatch = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${props => props.color};
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
`;

const ColorLabel = styled.span`
  font-size: 14px;
  color: #333;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #333;
  animation: spin 1s ease-in-out infinite;
  margin-left: 10px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const DescriptionText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #555;
  margin: 5px 0;
`;

const EmptyMessage = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-top: 20px;
`;

export const RecommendationComponent = ({ 
  size, 
  baseColor, 
  switchColor, 
  keycapColors,
  onApplyRecommendation
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState(null);

  const handleRecommendation = async () => {
    try {
      setIsLoading(true);

      const result = await fetchKeyboardRecommendation({
        size,
        baseColor,
        switchColor,
        keycapColors,
      });

      if (result.status === "OK") {
        // 전체 응답 결과를 저장
        setRecommendationResult(result);
        
        // 부모 컴포넌트에 첫 번째 추천 결과 전달
        if (result.data?.keyboards?.length > 0) {
          const recommendedKeyboard = result.data.keyboards[0];
          onApplyRecommendation(
            recommendedKeyboard.barebone || baseColor,
            recommendedKeyboard.switch || switchColor,
            recommendedKeyboard.keycap
          );
        }
      } else {
        alert("추천 색상을 가져오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 추천 결과를 렌더링하는 함수
  const renderRecommendationResults = () => {
    if (!recommendationResult) {
      return (
        <EmptyMessage>
          키보드를 커스터마이징하고 "추천받기" 버튼을 클릭하면 AI가 추천하는 색상 조합을 볼 수 있습니다.
        </EmptyMessage>
      );
    }

    const keyboards = recommendationResult.data?.keyboards || [];
    const descriptions = recommendationResult.data?.description || [];

    return (
      <>
        {keyboards.length > 0 && (
          <>
            <DescriptionTitle>추천 색상 조합</DescriptionTitle>
            {keyboards.map((keyboard, index) => (
              <RecommendationItem key={index}>
                <strong>조합 {index + 1}</strong>
                <ColorDisplay>
                  <ColorSwatch color={keyboard.barebone} />
                  <ColorLabel>베어본: {keyboard.barebone}</ColorLabel>
                </ColorDisplay>
                <ColorDisplay>
                  <ColorSwatch color={keyboard.keycap} />
                  <ColorLabel>키캡: {keyboard.keycap}</ColorLabel>
                </ColorDisplay>
                <ColorDisplay>
                  <ColorSwatch color={keyboard.switch} />
                  <ColorLabel>스위치: {keyboard.switch}</ColorLabel>
                </ColorDisplay>
              </RecommendationItem>
            ))}
          </>
        )}
        
        {descriptions.length > 0 && (
          <>
            <DescriptionTitle>키보드 설명</DescriptionTitle>
            {descriptions.map((desc, index) => (
              <DescriptionText key={index}>{desc}</DescriptionText>
            ))}
          </>
        )}
      </>
    );
  };

  // 버튼 렌더링
  const renderRecommendButton = () => (
    <RecommendButton onClick={handleRecommendation} disabled={isLoading}>
      <FiShare2 />
      {isLoading ? '추천 중...' : '추천받기'}
      {isLoading && <LoadingSpinner />}
    </RecommendButton>
  );

  return (
    <RecommendationContainer>
      {renderRecommendButton()}
      {renderRecommendationResults()}
    </RecommendationContainer>
  );
};