import { useRef, useState } from "react";
import { styled } from "styled-components";
import Uploader from "./Uploader";
import ImageEditor from "./ImageEditor";
import Processing from "./Processing";
import Preview, { ConfirmCallback } from "./Preview";
import Result from "./Result";
import { ImageInfo, ExtractApiResponseData } from "./types";
import { message } from "antd";
import apiRequest from "../../utils/request";

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
  Result,
}
const ChangeBackground: React.FC = () => {
  const [sourceImageInfo, setSourceImageInfo] = useState<ImageInfo>();
  const [previewImageInfos, setPreviewImageInfos] = useState<ImageInfo[]>([]);
  const [resultImageInfos, setResultImageInfos] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<Progress>(Progress.Upload);
  const abortController = useRef<AbortController>();
  const cachedImages = useRef<ExtractApiResponseData>({ masks: [], blended_images: [], images: [] });
  const cachedText = useRef<string>('');

  const extract = async (text: string) => {
    if (sourceImageInfo == null) {
      message.error("请先上传图片！");
    } else {
      setLoading(true);
      abortController.current = new AbortController();
      try {
        const data = await apiRequest.request<ExtractApiResponseData>({
          method: 'post',
          url: "/api/v1/predict",
          data: {
            image: sourceImageInfo?.data,
            prompt: text,
          },
          signal: abortController.current.signal,
        });
        if (data) {
          setPreviewImageInfos(
            data.images.map((imageData: string) => ({
                mimeType: sourceImageInfo.mimeType,
                data: `data:${sourceImageInfo.mimeType};base64,${imageData}`,
              }))
          );
          cachedImages.current = data;
          cachedText.current = text;
        }
        setProgress(Progress.Preview);
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelProcessing = () => {
    setLoading(false);
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = undefined;
    }
  };

  const generate: ConfirmCallback = async ({
    imageIndex,
    scene,
  }) => {
    if (previewImageInfos.length > 0) {
      setLoading(true);
      abortController.current = new AbortController();
      try {
        const data = await apiRequest.request<string[]>({
          method: 'post',
          url: "/api/v1/img2img",
          data: {
            mask: cachedImages.current.masks[imageIndex],
            blended_images: cachedImages.current.blended_images,
            masks: cachedImages.current.masks,
            images: cachedImages.current.images,
            index: imageIndex,
            scene,
          },
          signal: abortController.current.signal,
        });
        if (data) {
          setResultImageInfos(
            data.map((base64String: string) => ({
              mimeType: previewImageInfos[0].mimeType,
              data: `data:${previewImageInfos[0].mimeType};base64,${base64String}`,
            }))
          );
          setProgress(Progress.Result);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Wrapper>
      {progress === Progress.Upload && (
        <>
          {sourceImageInfo != undefined ? (
            <Content>
              <ImageEditor
                imageData={sourceImageInfo.data}
                initialText={cachedText.current}
                onDelete={() => {
                  setSourceImageInfo(undefined);
                }}
                onSubmit={extract}
              />
            </Content>
          ) : (
            <Uploader
              onChangeImage={(info) => {
                setSourceImageInfo(info);
              }}
            />
          )}
        </>
      )}
      {progress === Progress.Preview && (
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
      <Processing open={loading} onCancel={cancelProcessing} />
    </Wrapper>
  );
};

export default ChangeBackground;
