import { useEffect, useState } from "react";
import { Upload, Row, Col, Typography, List, Space, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import Title from "../../components/Title";
import { ImageInfo } from "./types";
import { fileToBase64String, urlToBase64ImageInfo } from "../../utils/image";
import { Image } from "./style";
import clothesImage1 from "./images/clothes_image_1.jpg";
import clothesImage2 from "./images/clothes_image_2.jpeg";
import clothesImage3 from "./images/clothes_image_3.png";

const { Dragger } = Upload;
const { Paragraph } = Typography;

const officialImages = [
  {
    id: 1,
    imageUrl: clothesImage1,
  },
  {
    id: 2,
    imageUrl: clothesImage2,
  },
  {
    id: 3,
    imageUrl: clothesImage3,
  },
];

interface SelectClothesProps {
  onChangeImage: (info: ImageInfo) => void;
  onCancel: () => void;
}

const SelectClothes: React.FC<SelectClothesProps> = ({
  onChangeImage,
  onCancel,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>();

  const selectImage = async (index: number) => {
    setSelectedImageIndex(index);
    onChangeImage(await urlToBase64ImageInfo(officialImages[index].imageUrl));
  };

  return (
    <div style={{ width: "90%", minWidth: "1000px" }}>
      <Title>上传你想处理的图片</Title>
      <Row gutter={40}>
        <Col span={16}>
          <Dragger
            accept="image/*"
            maxCount={1}
            height={500}
            showUploadList={false}
            beforeUpload={(file, fileList) => {
              return false;
            }}
            onChange={async (info) => {
              const data = await fileToBase64String(info.file as RcFile);
              onChangeImage({
                mimeType: info.file.type || "image/jpeg",
                data,
              });
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或者将文件拖至此区域进行上传</p>
          </Dragger>
        </Col>
        <Col span={8} style={{ borderLeft: "1px solid #ccc" }}>
          <Paragraph>选择官方图片</Paragraph>
          <List
            grid={{ column: 2 }}
            dataSource={officialImages}
            renderItem={(item, index) => (
              <List.Item key={item.id}>
                <Image
                  src={item.imageUrl}
                  active={selectedImageIndex === index}
                  onClick={() => selectImage(index)}
                />
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Space>
        <Button onClick={onCancel}>返回</Button>
      </Space>
    </div>
  );
};

export default SelectClothes;
