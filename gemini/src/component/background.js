// BackgroundAnimation.js
import React from 'react';
import { motion } from 'framer-motion';
const TRANSITION = {
  duration: 5,
  ease: 'linear',
};
export const varColor2x = {
  animate: {
    background: ['#19dcea', '#b22cff'],
    transition: TRANSITION,
  },
};
// ... (similar code for other variants)
const BackgroundAnimation = ({ variant }) => {
  return (
    <motion.div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
      }}
      variants={variant}
      initial="initial"
      animate="animate"
    />
  );
};
export default BackgroundAnimation;