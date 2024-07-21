import React from 'react';

const TwitterIcon = ({ size = 16, fillColor = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_481_42654)">
      <mask id="mask0_481_42654" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
        <path d="M0 0H16V16H0V0Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_481_42654)">
        <path d="M11.8333 1.77802H13.8781L9.41144 6.86061L14.6667 13.778H10.5524L7.32763 9.5835L3.64192 13.778H1.59525L6.37239 8.33981L1.33334 1.77896H5.55239L8.46287 5.61219L11.8333 1.77802ZM11.1143 12.5599H12.2476L4.93334 2.93281H3.71811L11.1143 12.5599Z" fill={fillColor}/>
      </g>
    </g>
    <defs>
      <clipPath id="clip0_481_42654">
        <rect width="16" height="16" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

export default TwitterIcon;
