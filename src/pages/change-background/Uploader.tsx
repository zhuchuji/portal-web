import { useEffect, useState } from 'react';
import { Upload, Row, Col, Typography, List } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import Title from "./Title";
import { ImageInfo } from "./types";
import { fileToBase64String, urlToBase64String } from "../../utils/image";
import { Image } from "./style";
import perfume from "./images/perfume.jpg";
import bag from "./images/bag.jpg";
import cup from "./images/cup.jpg";

const { Dragger } = Upload;
const { Paragraph } = Typography;

interface UploaderProps {
  onChangeImage: (info: ImageInfo) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onChangeImage }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>();

  const [officialImages, setOfficialImages] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([ urlToBase64String(cup), urlToBase64String(perfume), urlToBase64String(bag)]).then(images => {
      setOfficialImages(images);
    })
  }, []);

  const selectImage = (index: number) => {
    setSelectedImageIndex(index);
    onChangeImage({
      data: officialImages[index],
      mimeType: 'image/jpeg',
    });
  }

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
              <List.Item>
                <Image src={item} active={selectedImageIndex === index} onClick={() => selectImage(index)} />
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Uploader;
