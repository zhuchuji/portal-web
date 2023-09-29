import { atom } from "recoil";

export interface ProcessingState {
  show: boolean;
}

const processingState = atom<ProcessingState>({
  key: 'processingState',
  default: {
    show: false,
  }
});

export default processingState;
