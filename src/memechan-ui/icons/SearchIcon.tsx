import React from 'react';

const SearchIcon = ({ color = "#f95292", size = 12, strokeWidth = 2, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" fill='none' xmlns="http://www.w3.org/2000/svg">
    <path d="M4.89796 8.57143C5.91837 8.57143 6.78571 8.21428 7.5 7.5C8.21429 6.78571 8.57143 5.91837 8.57143 4.89796C8.57143 3.87755 8.21429 3.0102 7.5 2.29592C6.78571 1.58163 5.91837 1.22449 4.89796 1.22449C3.87755 1.22449 3.0102 1.58163 2.29592 2.29592C1.58163 3.0102 1.22449 3.87755 1.22449 4.89796C1.22449 5.91837 1.58163 6.78571 2.29592 7.5C3.0102 8.21428 3.87755 8.57143 4.89796 8.57143ZM4.89796 9.79592C3.53061 9.79592 2.37245 9.32143 1.42347 8.37245C0.47449 7.42347 0 6.26531 0 4.89796C0 3.53061 0.47449 2.37245 1.42347 1.42347C2.37245 0.47449 3.53061 0 4.89796 0C6.26531 0 7.42347 0.47449 8.37245 1.42347C9.32143 2.37245 9.79592 3.53061 9.79592 4.89796C9.79592 5.46939 9.70673 6.00775 9.52837 6.51306C9.35 7.01837 9.09735 7.48 8.77041 7.89796L11.8163 10.9439C11.9388 11.0663 12 11.2118 12 11.3804C12 11.549 11.9388 11.6943 11.8163 11.8163C11.6939 11.9384 11.5486 11.9996 11.3804 12C11.2122 12.0004 11.0667 11.9392 10.9439 11.8163L7.89796 8.77041C7.47959 9.09694 7.01796 9.34959 6.51306 9.52837C6.00816 9.70714 5.4698 9.79632 4.89796 9.79592Z" fill={color}/>
  </svg>
);

export default SearchIcon;

