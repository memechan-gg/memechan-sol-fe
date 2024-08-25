import { useTheme } from "next-themes";

interface PointsDisplayProps {
  points: number;
}

const PointsComponent = ({ points }: PointsDisplayProps) => {
  const { theme } = useTheme();

  return (
    <div className="h-10 flex items-center gap-2 px-3 rounded-sm border border-pink-500 border-solid bg-inherit box-content">
      <span className="text-base tracking-normal text-neutral-800" aria-hidden="true">
        🔥
      </span>
      <div className="text-sm leading-4 text-pink-500">
        <span className="font-semibold">{points.toLocaleString()}</span>
        <br />
        <span className="font-light">Points</span>
      </div>
    </div>
  );
};

export default PointsComponent;
