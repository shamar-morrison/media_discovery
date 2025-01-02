export function debounce(func: (...args: any[]) => void, delay: number) {
  let timer: NodeJS.Timeout | null = null;

  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      func(...args);
      timer = null;
    }, delay);
  };
}
