interface CustomDateProps {
  creationDate: Date;
}

const CustomDate = ({ creationDate }: CustomDateProps) => {
  const formatDate = (date: Date): string => {
    const twoDigit = (num: number) => num.toString().padStart(2, "0");

    const year = date.getFullYear().toString().slice(-2);
    const month = twoDigit(date.getMonth() + 1);
    const day = twoDigit(date.getDate());
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

    const hours = twoDigit(date.getHours());
    const minutes = twoDigit(date.getMinutes());
    // const seconds = twoDigit(date.getSeconds());

    return `${month}/${day}/${year} (${weekday}) ${hours}:${minutes}`;
  };

  const formattedDateTime = formatDate(new Date(creationDate));

  return <p className="text-[13px] font-normal leading-5 text-mono-500">{formattedDateTime}</p>;
};

export default CustomDate;
