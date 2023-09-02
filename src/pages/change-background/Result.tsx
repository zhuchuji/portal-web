import { Button, Space, Row, Col, List } from "antd";
import { useState } from "react";
import { styled } from "styled-components";
import { ImageInfo } from "./types";
import Title from './Title';
import { base64StringToBlob, downloadImage } from "../../utils/image";

const ListItem = styled.div`
  margin: 10px;
  cusor: pointer;
`;

const ThemeImage = styled.img<{ active: boolean }>`
  width: 100%;
  border: 4px solid;
  border-radius: 4px;
  border-color: ${props => props.active ? '#ffd666' : 'transparent'};
`;


interface ResultProps {
  imageInfos: ImageInfo[];
  onBack: () => void;
}

const Result: React.FC<ResultProps> = ({
  imageInfos,
  onBack,
}) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const download = () => {
    const { data, mimeType } = imageInfos[selectedImage];
    const blob = base64StringToBlob(data, mimeType);
    downloadImage(blob);
  }

  return (
    <Row gutter={40}>
      <Col span={24} style={{ overflow: 'auto', maxHeight: '100%' }}>
        <Title>查看生成结果</Title>
        <List
          style={{ marginBottom: '40px', height: '600px', overflow: 'auto' }}
          grid={{ column: 2 }}
          dataSource={imageInfos}
          renderItem={(item, index) => (
            <ListItem>
              <ThemeImage src={item.data} active={selectedImage === index} onClick={() => setSelectedImage(index)} />
            </ListItem>
          )}
        />
        <Space wrap style={{ marginBottom: "20px" }}>
          <Button onClick={onBack}>重绘所选图片</Button>
          <Button block type="primary" onClick={download}>
            下载所选图片
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default Result;
