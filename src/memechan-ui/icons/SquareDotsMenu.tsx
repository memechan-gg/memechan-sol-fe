interface Props {
  fill?: string;
  size?: number;
  onClick?: () => void;
}

const SquareDotsMenu = ({ size = 16, fill = "none", onClick }: Props) => (
  <svg width={size} height={size} viewBox="0 0 2 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0H2V1.71429H0V0Z" fill={fill} />
    <path d="M0 5.14286H2V6.85714H0V5.14286Z" fill={fill} />
    <path d="M0 10.2857H2V12H0V10.2857Z" fill={fill} />
  </svg>
);

export default SquareDotsMenu;
