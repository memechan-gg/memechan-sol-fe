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
    const seconds = twoDigit(date.getSeconds());

    return `${month}/${day}/${year}(${weekday})${hours}:${minutes}:${seconds}`;
  };

  const formattedDateTime = formatDate(new Date(creationDate));

  return <div className="text-xs font-medium text-regular">{formattedDateTime}</div>;
};

export default CustomDate;
