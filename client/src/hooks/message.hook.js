import { useCallback } from 'react';

const useMessage = () => useCallback((text) => {
  if (window.M && text) {
    window.M.toast({ html: text });
  }
}, []);

export default useMessage;
