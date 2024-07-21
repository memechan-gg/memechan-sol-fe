const MenuIcon = ({ color = "#f95292", size = 16, strokeWidth = 2, fill = "none" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.5 2.5H8.5V3.21429H7.5V2.5ZM7.5 7.64286H8.5V8.35714H7.5V7.64286ZM7.5 12.7857H8.5V13.5H7.5V12.7857Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </svg>
);

export default MenuIcon;
