import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload';
import Title from './Title';
import { ImageInfo } from './types';
import { fileToBase64String } from '../../utils/image';

const { Dragger } = Upload;



interface UploaderProps {
  onChangeImage: (info: ImageInfo) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onChangeImage }) => (
  <div>
    <Title>上传你想处理的图片</Title>
    <Dragger
      accept='image/*'
      maxCount={1}
      height={500}
      showUploadList={false}
      beforeUpload={(file, fileList) => {
        return false;
      }}
      onChange={async (info) => {
        const data = await fileToBase64String(info.file as RcFile);
        onChangeImage({
          mimeType: info.file.type || 'image/jpeg',
          data,
        })
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或者将文件拖至此区域进行上传</p>
    </Dragger>
  </div>
  
);

export default Uploader;