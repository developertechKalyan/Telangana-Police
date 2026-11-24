import type { Variants } from "framer-motion";

/** Child variant for items inside <StaggerGroup>: fade + slide up. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
