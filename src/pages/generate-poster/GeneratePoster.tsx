import { useState } from 'react';
import Edit from './Edit';

enum Process {
  Edit,
  Preview,
  Generate,
}
const GeneratePoster: React.FC = () => {
  const [process, setProcess] = useState<Process>(Process.Edit);

  return (
    <div>
      {process === Process.Edit && (
        <Edit />
      )}
    </div>
  );
}

export default GeneratePoster;
