import { cn } from "@/utils";
import { RpcConnectionDialog } from "@/views/rpc-connection/rpc-connection-dialog";
import { Popover } from "@headlessui/react";
import Link from "next/link";
import { Button } from "./button";

export default function SideMenu(props) {
  return (
    <div>
      <Popover>
        <Popover.Button>
          <div className=" w-[137px] h-10 pink-border dark  items-center border-2 rounded transition-all duration-300 overflow-hidden flex">
            <div
              role="button"
              className={cn(
                "bg-title bg-opacity-15 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-25",
              )}
            >
              {props.account.address.slice(0, 3)}...
              {props.account.address.slice(-3)}
              <Button className=" bg-dark rounded-none border-l-2 border-primaryPink">...</Button>
            </div>
          </div>
        </Popover.Button>
        <Popover.Panel className=" absolute z-10 flex flex-col">
          <Link href={`/profile/${props.account.address}`}>
            <div
              role="button"
              className="bg-white w-full text-regular text-xs text-left p-2 hover:bg-regular hover:text-white"
            >
              Profile
            </div>
          </Link>
          <Link href={`/vesting`}>
            <div
              role="button"
              className="bg-white w-full text-regular text-xs text-left p-2 hover:bg-regular hover:text-white"
            >
              $CHAN vesting
            </div>
          </Link>
          <RpcConnectionDialog />
          <button
            onClick={() => props.disconnect()}
            className="bg-white text-regular text-xs text-left p-2 hover:bg-regular hover:text-white"
          >
            Disconnect
          </button>
        </Popover.Panel>
      </Popover>
    </div>
  );
}
