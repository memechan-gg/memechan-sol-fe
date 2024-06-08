export const RefreshTimeIcon = ({ strokeDashoffset }: { strokeDashoffset: number }) => {
  return (
    <svg width="12" height="12" viewBox="0 0 10 10">
      <circle className="fill-transparent stroke-slate-100" cx="5" cy="5" r="4" strokeWidth="2px"></circle>
      <circle
        className="fill-transparent stroke-red-700"
        strokeLinecap="round"
        strokeLinejoin="round"
        cx="5"
        cy="5"
        r="4"
        strokeWidth="2.4px"
        transform="rotate(-90 5 5)"
        style={{ strokeDasharray: "25.1327px", strokeDashoffset: `${strokeDashoffset}px` }}
      ></circle>
    </svg>
  );
};
