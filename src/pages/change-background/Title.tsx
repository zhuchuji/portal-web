import { Typography } from "antd";
import { styled } from "styled-components";

const StyledTitle = styled(Typography.Title)`
  margin-bottom: 40px !important;
  text-align: center;
`;

const Title: React.FC<React.PropsWithChildren> = ({ children }) => (
  <StyledTitle level={5}>{children}</StyledTitle> 
);

export default Title;
