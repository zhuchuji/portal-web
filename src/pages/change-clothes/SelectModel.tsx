import { List, Typography } from "antd";
import { styled } from "styled-components";

import Title from "../../components/Title";
import modelImage1 from "./images/model_image_1.png";
import modelImage2 from "./images/model_image_2.png";
import modelImage3 from "./images/model_image_3.png";
import modelImage4 from "./images/model_image_4.png";

const { Paragraph } = Typography;

const models = [
  {
    id: 1,
    imageUrl: modelImage1,
    title: "名称1",
  },
  {
    id: 2,
    imageUrl: modelImage2,
    title: "名称2",
  },
  {
    id: 3,
    imageUrl: modelImage3,
    title: "名称3",
  },
  {
    id: 4,
    imageUrl: modelImage4,
    title: "名称4",
  },
];

interface SelectModelProps {
  onSelect: (image: string) => void;
}

const SelectModel: React.FC<SelectModelProps> = ({
  onSelect,
}) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "800px" }}>
        <Title>请选择您的衣服想更换在哪位模特身上</Title>
        <List
          grid={{ column: 4 }}
          dataSource={models}
          renderItem={(item) => (
            <List.Item key={item.id} style={{ position: 'relative', margin: '10px', cursor: 'pointer' }} onClick={() => onSelect(item.imageUrl)}>
                <img style={{ width: "100%" }} src={item.imageUrl} />
                <Paragraph
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    margin: 0,
                    width: "100%",
                    background: "rgba(90, 90, 90, 0.6)",
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  {item.title}
                </Paragraph>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default SelectModel;
