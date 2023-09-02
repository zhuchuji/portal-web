import { useRef, useState } from "react";
import { styled } from "styled-components";
import axios, { CancelTokenSource } from "axios";
import Uploader from "./Uploader";
import ImageEditor from "./ImageEditor";
import Processing from "./Processing";
import Preview from './Preview';
import Result from './Result';
import { ImageInfo } from './types';
import { message } from "antd";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  width: 600px;
`;

enum Progress {
  Upload,
  Preview,
  Result
}
const ChangeBackground: React.FC = () => {
  const [sourceImageInfo, setSourceImageInfo] = useState<ImageInfo>();
  const [previewImageInfo, setPreviewImageInfo] = useState<ImageInfo>();
  const [previewImageInfos, setPreviewImageInfos] = useState<ImageInfo[]>([]);
  const [resultImageInfos, setResultImageInfos] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<Progress>(Progress.Upload);
  const abortController = useRef<CancelTokenSource>();

  const extract = async (text: string) => {
    if (sourceImageInfo == null) {
      message.error('请先上传图片！');
    } else {
      setLoading(true);
      abortController.current = axios.CancelToken.source();
      try {
        const response = await axios.post('/api/v1/predict', {
          image: sourceImageInfo?.data,
          prompt: text,
        }, {
          cancelToken: abortController.current.token,
        });
        setPreviewImageInfos(response.data.data.masks.map((imageData: string) => ({
          mimeType: sourceImageInfo.mimeType,
          data: `data:${sourceImageInfo.mimeType};base64,${imageData}`,
        })));
        setPreviewImageInfo({
          mimeType: sourceImageInfo.mimeType,
          data: `data:${sourceImageInfo.mimeType};base64,${response.data.data.masks[1]}`
        });
        setProgress(Progress.Preview);
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelProcessing = () => {
    setLoading(false);
    if (abortController.current) {
      abortController.current.cancel();
      abortController.current = undefined;
    }
  };

  const generate = async (scene: number) => {
    if (previewImageInfo != null) {
      setLoading(true);
      abortController.current = axios.CancelToken.source();
      try {
        const response = await axios.post('/api/v1/img2img', {
          image: previewImageInfo.data,
          scene,
        }, {
          cancelToken: abortController.current.token,
        });
        setResultImageInfos(response.data.data.map((base64String: string) => ({
          mimeType: previewImageInfo.mimeType,
          data: `data:${previewImageInfo.mimeType};base64,${base64String}`
        })));
        setProgress(Progress.Result);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Wrapper>
      {progress === Progress.Upload && (
        <Content>
          {sourceImageInfo != undefined ? (
            <ImageEditor
              imageData={sourceImageInfo.data}
              onDelete={() => {
                setSourceImageInfo(undefined);
              }}
              onSubmit={extract}
            />
          ) : (
            <Uploader
              onChangeImage={(info) => {
                setSourceImageInfo(info);
              }}
            />
          )}
        </Content>
      )}
      {progress === Progress.Preview && previewImageInfo != null && (
        <Preview
          imageInfos={previewImageInfos}
          onCancel={() => setProgress(Progress.Upload)}
          onConfirm={generate}
        />
      )}
      {progress === Progress.Result && (
        <Content>
          <Result
            imageInfos={resultImageInfos}
            onBack={() => setProgress(Progress.Preview)}
          />
        </Content>
      )}
      <Processing
        open={loading}
        onCancel={cancelProcessing}
      />
    </Wrapper>
  );
};

export default ChangeBackground;
