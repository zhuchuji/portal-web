import { useState, useRef } from 'react';
import Edit from './Edit';
import Result from './Result';
import apiRequest from '../../utils/request';
import { ImageInfo } from '../../utils/image';
import Processing from '../../components/Processing';

enum Process {
  Edit,
  Generate,
}
const GeneratePoster: React.FC = () => {
  const [process, setProcess] = useState<Process>(Process.Edit);
  const [generatedImages, setGeneratedImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const abortController = useRef<AbortController>();

  const toPreview = async (data: { canvas: ImageInfo; target: ImageInfo; width: number; height: number }) => {
    abortController.current = new AbortController();
    try {
      setLoading(true);
      const res = await apiRequest.request<string[]>({
        method: 'post',
        url: '/api/v1/txt2img',
        data: {
          draw_image: data.canvas.data,
          image: data.target.data,
          width: data.width,
          height: data.height,
        },
        signal: abortController.current.signal,
      });
      if (res) {
        setGeneratedImages(res.map((imageData: string) => ({
          data: `data:${data.canvas.mimeType};base64,${imageData}`,
          mimeType: data.canvas.mimeType,
        })));
        setProcess(Process.Generate);
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelProcessing = () => {
    setLoading(false);
    if (abortController.current) {
      abortController.current.abort();
      abortController.current = undefined;
    }
  };

  return (
    <div>
      {process === Process.Edit && (
        <Edit
          onNext={toPreview}
        />
      )}
      {process === Process.Generate && (
        <Result
          imageInfos={generatedImages}
          onBack={() => {
            setProcess(Process.Edit);
          }}
        />
      )}
      {loading  && <Processing open={loading} onCancel={cancelProcessing} />}
    </div>
  );
};

export default GeneratePoster;
