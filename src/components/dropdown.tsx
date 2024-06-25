import { Popover } from "@headlessui/react";
import { CaretDown } from "@phosphor-icons/react";
import { Fragment } from "react";

export function Dropdown({
  title,
  items,
  onItemChange,
  activeItem,
}: {
  title: string;
  items: string[];
  activeItem: string;
  onItemChange: (item: string) => void;
}) {
  return (
    <Popover>
      <Popover.Button>
        <div className="bg-regular flex flex-row gap-1 text-white font-bold py-1 px-2 rounded-lg">
          {title}: {activeItem.split("_").join(" ")} <CaretDown className="w-4 h-4" />
        </div>
      </Popover.Button>
      {/* Dropdown should show bottom */}
      <Popover.Panel className="absolute z-10 flex flex-col">
        {items.map((item) => (
          <Fragment key={item}>
            <div
              onClick={() => {
                onItemChange(item);
              }}
              className="bg-white text-regular text-xs text-left p-2 hover:bg-regular hover:text-white"
            >
              {item.split("_").join(" ")}
            </div>
          </Fragment>
        ))}
      </Popover.Panel>
    </Popover>
  );
}
