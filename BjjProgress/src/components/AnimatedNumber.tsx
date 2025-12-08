import React, { useEffect, useState } from 'react';
import { Text, TextProps } from 'react-native';

interface Props extends TextProps {
  value: number;
  duration?: number;
  formatter?: (val: number) => string;
}

export const AnimatedNumber = ({ value, duration = 1000, formatter, ...props }: Props) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = Math.floor(easeProgress * value);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <Text {...props}>
      {formatter ? formatter(displayValue) : displayValue}
    </Text>
  );
};
