'use client';
import { cn } from '../../shadcn/utils';
import { motion, useSpring, useTransform, useInView } from 'motion/react';
import type { SpringOptions } from 'motion/react';
import { useEffect, useRef, type JSX } from 'react';

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  as?: keyof JSX.IntrinsicElements;
  once?: boolean;
};

export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = 'span',
  once = true,
}: AnimatedNumberProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  // start at 0
  const spring = useSpring(0, springOptions);
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, value, spring]);

  // 🔑 simplified typing to avoid union explosion
  const MotionComponent: any = motion(as as any);

  return (
    <MotionComponent ref={ref} className={cn('tabular-nums', className)}>
      {display}
    </MotionComponent>
  );
}
