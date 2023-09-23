import {
  Button,
  Space,
  Row,
  Col,
  List,
  Typography,
  Tabs,
  Carousel,
} from "antd";
import {
  CaretLeftOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { useState } from "react";
import { styled } from "styled-components";
import Title from "../../components/Title";
import { ImageInfo } from "./types";
import { base64StringToBlob, downloadImage } from '../../utils/image';
import { Image } from './style';
import sceneImage1 from './images/scence_image_1.png';
import sceneImage2 from './images/scence_image_2.png';

const ListWrapper = styled.div`
  overflow: auto;
  max-height: 400px;
`;

const ListItem = styled.div`
  margin: 10px;
  cusor: pointer;
`;

const CarouselWrapper = styled.div`
  margin-bottom: 20px;

  .ant-carousel .slick-prev,
  .ant-carousel .slick-prev:hover,
  .ant-carousel .slick-prev:focus {
    font-size: 40px;
    left: 0;
    z-index: 2;
    color: #ccc;
  }

  .ant-carousel .slick-next,
  .ant-carousel .slick-next:hover,
  .ant-carousel .slick-next:focus {
    font-size: 40px;
    right: 20px;
    top: 50%;
    z-index: 2;
    color: #ccc;
  }
`;

const { Paragraph } = Typography;

const scenes = [
  {
    imageUrl: sceneImage1,
    name: "园林场景",
    id: 1,
  },
  {
    imageUrl: sceneImage2,
    name: "街头",
    id: 2,
  },
];

export type ConfirmCallback = (data: { imageIndex: number; scene: number; }) => Promise<void>;

interface PreviewProps {
  imageInfos: ImageInfo[];
  onCancel: () => void;
  onConfirm: ConfirmCallback;
}

const Preview: React.FC<PreviewProps> = ({
  imageInfos,
  onCancel,
  onConfirm,
}) => {
  const [selectedScene, setSelectedScene] = useState<number>(scenes[0].id);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const tabs: TabsProps["items"] = [
    {
      key: "1",
      label: "推荐场景",
      children: (
        <ListWrapper>
          <List
            grid={{ column: 2 }}
            dataSource={scenes}
            renderItem={(item) => (
              <ListItem key={item.id}>
                <Image
                  src={item.imageUrl}
                  active={selectedScene === item.id}
                  onClick={() => setSelectedScene(item.id)}
                />
                <Paragraph>{item.name}</Paragraph>
              </ListItem>
            )}
          />
        </ListWrapper>
      ),
    },
    {
      key: "2",
      label: "自定义场景",
      children: <div />,
    },
    {
      key: "3",
      label: "历史记录",
      children: <div />,
    },
  ];

  const download = () => {
    const { data, mimeType } = imageInfos[selectedImageIndex];
    const blob = base64StringToBlob(data, mimeType);
    downloadImage(blob);
  }

  return (
    <Row style={{ width: "80%", minWidth: "900px" }} gutter={40}>
      <Col span={16} style={{ overflow: "auto", maxHeight: "100%" }}>
        <Title>选择结果</Title>
        <CarouselWrapper>
          <Carousel
            initialSlide={selectedImageIndex}
            arrows={true}
            prevArrow={<CaretLeftOutlined />}
            nextArrow={<CaretRightOutlined />}
            afterChange={(currentSlide) => setSelectedImageIndex(currentSlide)}
          >
            {imageInfos.map(({ data }, index) => (
              <img style={{ width: '100%' }} key={index} src={data} />
            ))}
          </Carousel>
        </CarouselWrapper>

        <Space wrap style={{ marginBottom: "20px" }}>
          <Button onClick={download}>下载所选图片</Button>
          <Button onClick={onCancel}>不满意，重新调整</Button>
        </Space>
        <div>
          <Button
            block
            type="primary"
            onClick={() => {
              onConfirm({ imageIndex: selectedImageIndex, scene: selectedScene });
            }}
          >
            开始生成
          </Button>
        </div>
      </Col>
      <Col span={8} style={{ borderLeft: "1px solid #ccc" }}>
        <div
          style={{
            borderRadius: "4px",
            border: "1px solid #aaa",
          }}
        >
          <Tabs items={tabs} style={{ margin: "0 10px" }} />
        </div>
      </Col>
    </Row>
  );
};

export default Preview;
