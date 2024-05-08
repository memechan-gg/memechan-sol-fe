import { HoldersProps } from "../coin.types";

export const Holders = ({ holders }: HoldersProps) => {
  const renderHolderType = (type: "bonding_curve" | "dev" | string | undefined) => {
    switch (type) {
      case "bonding_curve":
        return "(bonding curve)";
      case "dev":
        return "(dev)";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs font-bold text-regular">Holders</div>
      <div className="flex flex-col gap-1">
        {holders.map((holder) => (
          <div key={holder.address} className="flex justify-between flex-row gap-2 text-xs font-bold text-regular">
            <div>
              <span className="font-normal">{holder.address}</span> {renderHolderType(holder.type)}
            </div>
            <div>{holder.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};
