import { FC, PropsWithChildren } from "react";

export const SidebarItem: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex w-full relative flex-col gap-3 p-4 bg-title bg-opacity-30 rounded-xl">{children}</div>
);
