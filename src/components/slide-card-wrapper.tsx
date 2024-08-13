import { MouseEvent, useRef, useState } from "react";

export interface SlideCardWrapperProps {
  children: React.ReactNode;
}
export const SlideCardWrapper = ({ children }: SlideCardWrapperProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // This prevents image dragging
    if (!wrapperRef.current) return;
    setIsDragging(true);
    console.log(wrapperRef);
    setStartX(e.pageX - wrapperRef.current.offsetLeft);
    setScrollLeft(wrapperRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !wrapperRef.current) return;
    e.preventDefault();
    const x = e.pageX - wrapperRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Adjust the scroll speed by changing this multiplier
    wrapperRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={wrapperRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeaveOrUp}
      onMouseUp={handleMouseLeaveOrUp}
      onMouseMove={handleMouseMove}
      className="custom-scroll-wrapper overflow-x-hidden w-full cursor-grab active:cursor-grabbing"
      style={{ whiteSpace: "nowrap", overflowX: "scroll" }}
    >
      <div className="flex space-x-3" style={{ display: "inline-flex" }}>
        {children}
      </div>
    </div>
  );
};

export default SlideCardWrapper;
