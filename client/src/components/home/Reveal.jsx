import { useEffect, useRef, useState } from 'react';

/**
 * Fades + lifts its children into view the first time they scroll on screen.
 * Content is visible by default when IntersectionObserver is unavailable,
 * and motion is dropped for users who prefer reduced motion.
 */
const Reveal = ({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(
    () => typeof window === 'undefined' || !('IntersectionObserver' in window)
  );

  useEffect(() => {
    if (visible || !ref.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [visible]);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,translate] duration-700 ease-out-expo motion-reduce:transition-none ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
