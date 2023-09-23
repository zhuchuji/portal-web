import { styled } from "styled-components";

export const Image = styled.img<{ active: boolean }>`
  width: 100%;
  border: 4px solid;
  border-radius: 4px;
  border-color: ${(props) => (props.active ? "#ffd666" : "transparent")};
`;
