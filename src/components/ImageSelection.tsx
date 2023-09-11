import { styled } from "styled-components";

const ImageSelection = styled.img<{ selected?: boolean }>`
  margin: 10px;
  width: 100%;
  border: 4px solid;
  border-radius: 4px;
  border-color: ${(props) => (props.selected ? "#ffd666" : "transparent")};
  cursor: pointer;
`;

export default ImageSelection;
