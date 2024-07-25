interface Props {
  fill?: string;
  size?: number;
  onClick?: () => void;
}

const UpArrowIcon = ({ size = 16, fill = "none", onClick }: Props) => (
  <svg width={size} height={size} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M2.72613 -1.86817e-07L4.27387 -1.19163e-07L7 5.81834L5.21922 5.81834L3.51759 1.83476L3.60992 1.88848L3.39008 1.88848L3.48241 1.83476L1.78078 5.81834L-2.54328e-07 5.81834L2.72613 -1.86817e-07Z"
      fill="#FB7070"
    />
    <path d="M4.33982 12L2.85364 12L2.85364 8.14039L4.33982 8.14039L4.33982 12Z" fill={fill} />
  </svg>
);

export default UpArrowIcon;
