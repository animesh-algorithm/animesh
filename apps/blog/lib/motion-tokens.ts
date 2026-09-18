export const motionTokens = {
  duration: {
    instant: 0.08,
    fast: 0.18,
    normal: 0.35,
    slow: 0.6,
  },
  easing: {
    smooth: [0.22, 1, 0.36, 1] as const,
  },
  distance: {
    sm: 8,
    md: 16,
    lg: 24,
  },
};

export const springs = {
  progress: {
    stiffness: 180,
    damping: 30,
    mass: 0.4,
  },
};
