const Disclaimer = ({ headerText, bodyText }: { headerText: string; bodyText: string }) => {
  return (
    <div className="card-shadow card-bg border border-monochrome-400 rounded-sm min-h-[218px] max-h-[218px]">
      <div className="text-yellow-100">{headerText}</div>
      <div>{bodyText}</div>
    </div>
  );
};

export default Disclaimer;
