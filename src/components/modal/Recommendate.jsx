import styled from "styled-components";

const DescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  height: 100%;
  overflow-y: auto;
  background-color: white;
  border-left: 1px solid #e6e5e1;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h3`
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #004aad;
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  color: #999;
  padding: 0 15px;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  margin-bottom: 15px;
  color: #ccc;
`;

const RecommendationSection = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  color: #444;
  font-size: 16px;
  margin-bottom: 12px;
  margin-top: 20px;
`;

const ColorCombination = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  border-left: 3px solid #004aad;
`;

const ComboTitle = styled.p`
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
  font-size: 15px;
`;

const ColorItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #555;
`;

const ColorSwatch = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background-color: ${props => props.color};
  margin-right: 10px;
  border: 1px solid #ddd;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const LoadingIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Spinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #004aad;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DescriptionText = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
`;

// AI 추천 결과를 표시하는 컴포넌트
export const Recommendate = ({ recommendationResult, isLoading }) => {
  // 로딩 중일 때 표시할 컴포넌트
  if (isLoading) {
    return (
      <DescriptionWrapper>
        <LoadingIndicator>
          <Spinner />
          <Description>AI가 추천 색상을 분석 중입니다...</Description>
        </LoadingIndicator>
      </DescriptionWrapper>
    );
  }

  // 추천 결과가 없을 때 표시할 빈 상태 컴포넌트
  if (!recommendationResult) {
    return (
      <DescriptionWrapper>
        <EmptyState>
          <EmptyIcon>🎨</EmptyIcon>
          <Description>
            키보드를 커스터마이징하고 "추천받기" 버튼을 클릭하면 AI가 추천하는 색상 조합을 볼 수 있습니다.
          </Description>
        </EmptyState>
      </DescriptionWrapper>
    );
  }

  // 추천된 키보드 정보 가져오기
  const keyboards = recommendationResult.data?.keyboards || [];
  const descriptions = recommendationResult.data?.description || [];

  return (
    <DescriptionWrapper>
      <Title>AI 추천 결과</Title>
      <Description>{recommendationResult.message}</Description>
      
      {keyboards.length > 0 && (
        <RecommendationSection>
          <SectionTitle>추천 색상 조합</SectionTitle>
          {keyboards.map((keyboard, index) => (
            <ColorCombination key={index}>
              <ComboTitle>조합 {index + 1}</ComboTitle>
              <ColorItem>
                <ColorSwatch color={keyboard.barebone} />
                <span>베어본: {keyboard.barebone}</span>
              </ColorItem>
              <ColorItem>
                <ColorSwatch color={keyboard.keycap} />
                <span>키캡: {keyboard.keycap}</span>
              </ColorItem>
              <ColorItem>
                <ColorSwatch color={keyboard.switch} />
                <span>스위치: {keyboard.switch}</span>
              </ColorItem>
            </ColorCombination>
          ))}
        </RecommendationSection>
      )}
      
      {descriptions.length > 0 && (
        <RecommendationSection>
          <SectionTitle>키보드 설명</SectionTitle>
          {descriptions.map((desc, index) => (
            <DescriptionText key={index}>{desc}</DescriptionText>
          ))}
        </RecommendationSection>
      )}
    </DescriptionWrapper>
  );
};