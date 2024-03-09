// 防抖
export const debounce = (func: any, delay = 300) => {
  let timer: any;

  return (...args: any) => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      func(args);
    }, delay);
  };
};
