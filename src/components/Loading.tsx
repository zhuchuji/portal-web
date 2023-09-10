import { Spin } from "antd";
import { styled } from "styled-components";

const Mask = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  
`;

const Loading: React.FC = () => (
  <Mask>
    <Spin size='large' />
  </Mask>
);

export default Loading;
