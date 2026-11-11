import { motion, type Variants } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: -50 },
  right: { x: 50 },
  none: {},
};

function makeVariants(direction: Direction): Variants {
  return {
    hidden: { opacity: 0, ...offset[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  };
}

export function MotionSection({
  children,
  direction = "up",
  delay = 0,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
  as?: "div" | "section";
}) {
  const MotionComponent = Component === "section" ? motion.section : motion.div;

  return (
    <MotionComponent
      className={className}
      variants={makeVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </MotionComponent>
  );
}

export const StaggerGroup = forwardRef<
  HTMLDivElement,
  { children: ReactNode; className?: string; staggerDelay?: number }
>(function StaggerGroup({ children, className, staggerDelay = 0.08 }, ref) {
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  );
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
