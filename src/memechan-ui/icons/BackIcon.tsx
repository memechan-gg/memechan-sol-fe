interface Props {
  fill?: string;
  size?: number;
  onClick?: () => void;
}

const BackIcon = ({ size = 16, fill = "none", onClick }: Props) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
    <path
      d="M2 9.27387V7.72613L7.81834 5V6.78078L3.83476 8.48241L3.88848 8.39008V8.60992L3.83476 8.51759L7.81834 10.2192V12L2 9.27387Z"
      fill={fill}
    />
    <path d="M14 7.66018V9.14636H10.1404V7.66018H14Z" fill={fill} />
  </svg>
);

export default BackIcon;
