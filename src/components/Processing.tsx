import { Modal, Spin, Button } from "antd";
import { styled } from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

interface ProcessingProps {
  open: boolean;
  onCancel: () => void;
}

const Processing: React.FC<ProcessingProps> = ({
  open,
  onCancel,
}) => {
  return (
    <Modal
      open={open}
      maskClosable={false}
      closeIcon={false}
      footer={
        <Wrapper>
          <Button style={{ paddingLeft: '40px', paddingRight: '40px' }} onClick={onCancel}>取消</Button>
        </Wrapper>
      }
    >
      <div style={{ padding: '100px', marginBottom: '20px' }}>
        <Spin size="large" tip="处理中，请等待...">
          <div />
        </Spin>
      </div>
    </Modal>
  );
};

export default Processing;
