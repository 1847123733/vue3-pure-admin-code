// bus总线
// import { emitter } from '@/utils/mitt';
import mitt from 'mitt';
const bus = mitt();
export const useBus = () => {
  // 发送事件
  const emit = (emitName: string) => {
    bus.emit(emitName);
  };

  // 接收事件
  const on = (emitName: string, fuc) => {
    bus.on(emitName, () => {
      fuc();
    });
  };

  return {
    emit,
    on
  };
};
