import styled from "styled-components";
import { MainBanner } from "../../components/home/MainBanner";
import { ItemFrame1 } from "../../components/home/ItemFrame1";
import { ItemFrame2 } from "../../components/home/ItemFrame2";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
`;

const Frame1 = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  border: solid 1px;
`;

const Frame2 = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  border: solid 1px;
`;

const Frame3 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 500px;
  border: solid 1px;
`;

export const MainPage = () => {
  return (
    <Container>
      <MainBanner />
      <Frame1>
        <ItemFrame1 />
      </Frame1>

      <Frame2>
        <ItemFrame2/>
      </Frame2>

      <Frame3>
        공유 컴포넌트
      </Frame3>
    </Container>
  );
};