export const inputVariants = {
  hidden: { opacity: 0, width: 0 },
  visible: {
    opacity: 1,
    width: "100%",
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    width: 0,
    transition: {
      duration: 0.5,
    },
  },
};
export const cardsVariants = {
  hidden: { opacity: 0.01, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1, // Stagger animation by index
    },
  }),
};
export const headingVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
    },
  },
};
export const shakeAnimation = {
  visible: {
    x: [0, -5, 5, -5, 5, -5, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 6,
    },
  },
};
