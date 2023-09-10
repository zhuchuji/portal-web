import { styled } from 'styled-components';
import { CloseSquareTwoTone } from '@ant-design/icons';
import { Typography, Input, Button } from 'antd';
import { useState } from 'react';
import Title from '../../components/Title';

const { Paragraph } = Typography;

const ImageWrapper = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 100%;
`;

const Close = styled(CloseSquareTwoTone)`
  position: absolute;
  z-index: 10;
  top: 4px;
  right: 4px;
  font-size: 30px;
`;

interface ImageEditorProps {
  imageData: string;
  initialText: string;
  onDelete: () => void;
  onSubmit: (text: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({
  imageData,
  initialText,
  onDelete,
  onSubmit,
}) => {
  const [text, setText] = useState<string>(initialText);

  return (
    <div>
      <Title>选择你想保留的区域，可以鼠标左键点击物体，或者在下方输入</Title>
      <ImageWrapper>
        <Image src={imageData} />
        <Close onClick={onDelete} />
      </ImageWrapper>
      <Paragraph style={{ marginTop: '10px' }}>鼠标点击要保留的物体，或输入文字描述你想保留的内容主体</Paragraph>
      <Input placeholder="输入文字描述你想保留的内容主体，如香水，杯子等" value={text} onChange={(e) => { setText(e.target.value); }}/>
      <Button block type="primary" style={{ marginTop: '10px' }} size="large" onClick={() => onSubmit(text)}>开始识别</Button>
    </div>
  );
}

export default ImageEditor;
