import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export const Statistics = () => {
  const stats = [
    {
      value: 100,
      label: "Active Projects",
      suffix: "+",
    },
    {
      value: 1000,
      label: "Tasks Completed",
      suffix: "+",
    },
    {
      value: 25,
      label: "Teams Using TeamSync",
      suffix: "+",
    },
    {
      value: 99,
      label: "Uptime",
      suffix: "%",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
      {stats.map((stat) => (
        <Counter key={stat.label} {...stat} />
      ))}
    </div>
  );
};

interface CounterProps {
  value: number;
  label: string;
  suffix?: string;
}

const Counter = ({ value, label, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="space-y-2 text-center"
    >
      <h3 className="text-3xl font-bold sm:text-4xl">
        {count}
        {suffix}
      </h3>
      <p className="text-lg text-muted-foreground">{label}</p>
    </motion.div>
  );
};
