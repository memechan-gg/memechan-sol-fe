import { MAX_STROKE_DASHOFFSET, PART_TO_DECREASE_PROGRESS } from "@/config/config";
import { useCallback, useEffect, useState } from "react";
import { useInterval } from "usehooks-ts";
import { RefreshTimeIcon } from "./refresh-time-icon";

export const OutputAmountRefresher = ({ refreshOutputAmount }: { refreshOutputAmount: () => {} }) => {
  const [strokeDashoffset, setStrokeDashoffset] = useState<number>(MAX_STROKE_DASHOFFSET);

  useEffect(() => {
    if (strokeDashoffset === 0) refreshOutputAmount();
  }, [strokeDashoffset, refreshOutputAmount]);

  const updateRefresherProgress = useCallback(() => {
    setStrokeDashoffset((prevOffset) => {
      if (prevOffset === 0) return MAX_STROKE_DASHOFFSET;
      if (prevOffset < PART_TO_DECREASE_PROGRESS) return 0;

      return prevOffset - PART_TO_DECREASE_PROGRESS;
    });
  }, []);

  useInterval(updateRefresherProgress, 1_000);

  return <RefreshTimeIcon strokeDashoffset={strokeDashoffset} onClick={refreshOutputAmount} />;
};
