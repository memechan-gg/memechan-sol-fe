import { ColorVariants } from "@/globalTypes";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "../Card";

type SwapType = "Buy" | "Sell";

interface TableColumn {
  key: string;
  label: string;
  textColor?: ColorVariants;
}

interface TableProps {
  data: {
    swapTime?: string;
    swapType?: string | SwapType;
    usdPrice?: number;
    initiatorAddress?: string;
  }[];
  columns: TableColumn[];
  tableTitle: string;
}

const Table = ({ tableTitle, data, columns }: TableProps) => {
  if (!data || data.length === 0) {
    return <p>No data available</p>;
  }

  return (
    <Card>
      <Card.Header>
        <Typography variant="h4">{tableTitle}</Typography>
      </Card.Header>
      <Card.Body additionalStyles="!p-0">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`pl-1 xs:pl-2 sm:pl-4 text-left ${index < columns.length - 1 ? "border-r" : ""} border-b border-mono-400`}
                >
                  <Typography color="mono-500">{column.label}</Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, index) => (
                  <td
                    key={column.key}
                    className={`pl-1 xs:pl-2 sm:pl-4 h-8 truncate ${rowIndex < data.length - 1 ? "border-b" : ""} ${
                      index < columns.length - 1 ? "border-r" : ""
                    } border-mono-400`}
                  >
                    <Typography
                      color={item.swapType === "Sell" ? "red-100" : "green-100"}
                      className={column.key === "initiatorAddress" ? "underline" : ""}
                    >
                      {item[column.key as keyof typeof item] !== undefined
                        ? item[column.key as keyof typeof item]
                        : "-"}
                    </Typography>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card.Body>
    </Card>
  );
};

export default Table;
