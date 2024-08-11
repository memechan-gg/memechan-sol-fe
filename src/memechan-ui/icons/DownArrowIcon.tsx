interface Props {
  fill?: string;
  size?: number;
  onClick?: () => void;
}

const DownArrowIcon = ({ size = 16, fill = "none", onClick }: Props) => (
  <svg width={size} height={size} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.27387 12L2.72613 12L-2.54328e-07 6.18166L1.78078 6.18166L3.48241 10.1652L3.39008 10.1115L3.60992 10.1115L3.51759 10.1652L5.21922 6.18166L7 6.18166L4.27387 12Z"
      fill={fill}
    />
    <path
      d="M2.66018 -1.1628e-07L4.14636 -1.81243e-07L4.14636 3.85961L2.66018 3.85961L2.66018 -1.1628e-07Z"
      fill={fill}
    />
  </svg>
);

export default DownArrowIcon;
