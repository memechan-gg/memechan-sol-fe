import React from "react";

const PointsHeader: React.FC = () => {
  return (
    <header className="flex gap-10 justify-center self-stretch px-4 py-1.5 w-full text-sm font-bold leading-loose text-green-600 whitespace-nowrap bg-neutral-700">
      <div className="gap-2 self-stretch">Points</div>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/c7ced871618d2c3589cadfc2d193d813d69b8c026a79c5b157b7db1de80e4dc8?placeholderIfAbsent=true&apiKey=eb6ecc156c044c5d8658095d2908b55b"
        alt=""
        className="object-contain shrink-0 my-auto w-4 aspect-square"
      />
    </header>
  );
};

export default PointsHeader;
