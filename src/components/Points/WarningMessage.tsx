import React from "react";

const WarningMessage: React.FC = () => {
  return (
    <div className="flex gap-4 items-start px-4 py-2 mt-3 w-full text-sm text-yellow-500 border border-solid border-neutral-700 max-w-[374px]">
      <span className="leading-loose" aria-hidden="true">
        ⚠️
      </span>
      <p className="flex-1 shrink leading-5 basis-0">
        The more points already distributed the less points you will earn for each SOL spent. Hurry up!
      </p>
    </div>
  );
};

export default WarningMessage;
