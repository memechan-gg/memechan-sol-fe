import { CommentsPanel } from "../comments-panel";

export interface CommentsTabProps {
  coinAddress: string;
  coinCreator: string;
}
export function CommentsTab({ coinAddress, coinCreator }: CommentsTabProps) {
  return <CommentsPanel coinType={coinAddress} coinCreator={coinCreator} />;
}
