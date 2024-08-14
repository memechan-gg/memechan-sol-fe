import { LiveClaim } from "./LiveClaim";
import { PresaleClaim } from "./PresaleClaim";
import { ClaimProps } from "./types";

export const Claim = (props: ClaimProps) => {
  const { variant } = props;

  return variant === "LIVE" ? (
    <LiveClaim {...props} />
  ) : (
    <PresaleClaim
      tokenSymbol={props.tokenSymbol}
      quoteTokenInfo={props.quoteTokenInfo}
      seedPoolAddress={props.seedPoolAddress}
      memePrice={props.memePrice}
    />
  );
};
