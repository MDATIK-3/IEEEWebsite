import { useEffect, useState } from 'react';

export const useCountUp = ({ start = 0, end, duration = 2, inView }) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!inView) return;

    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [inView, start, end, duration]);

  return count;
};
