import React from 'react';

const CloseIcon = ({ color = "#f95292", size = 16, strokeWidth = 2, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2L8 8M14 14L8 8M8 8L14 2L2 14" stroke={color} strokeWidth={strokeWidth} />
  </svg>
);

export default CloseIcon;
