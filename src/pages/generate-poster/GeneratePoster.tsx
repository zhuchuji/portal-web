import { useState } from 'react';
import Edit from './Edit';
import Preview from './Preview';

enum Process {
  Edit,
  Preview,
  Generate,
}
const GeneratePoster: React.FC = () => {
  const [process, setProcess] = useState<Process>(Process.Edit);
  const [image, setImage] = useState<string>();

  const toPreview = (image: string) => {
    setImage(image);
    setProcess(Process.Preview);
  };

  return (
    <div>
      {process === Process.Edit && (
        <Edit
          onNext={toPreview}
        />
      )}
      {process === Process.Preview && (
        <Preview
          imageInfos={[]}
          onCancel={() => {
            setProcess(Process.Edit);
          }}
          onConfirm={async () => {
            setProcess(Process.Generate);
          }}
        />
      )}
    </div>
  );
};

export default GeneratePoster;
