import { MEMECHAN_MEME_TOKEN_DECIMALS, ParsedMemeTicket, getTokenInfoByMint } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

export const getTicketsData = (data: ParsedMemeTicket[] | undefined) => {
  if (!data)
    return {
      tickets: [],
      stakedAmount: "0",
      availableTicketsAmount: "0",
      availableTickets: [],
      unavailableTicketsAmount: "0",
      unavailableTickets: [],
    };

  const currentTimestamp = Date.now();
  const availableTickets: ParsedMemeTicket[] = [];
  const unavailableTickets: ParsedMemeTicket[] = [];

  data.forEach((ticket) => {
    const unlockTicketTimestampInMs = new BigNumber(ticket.jsonFields.untilTimestamp).multipliedBy(1000).toNumber();

    if (currentTimestamp >= unlockTicketTimestampInMs) {
      availableTickets.push(ticket);
    } else {
      unavailableTickets.push(ticket);
    }
  });

  const rawAvailableAmount = availableTickets.reduce(
    (amount: BigNumber, ticket) => amount.plus(ticket.jsonFields.amount),
    new BigNumber(0),
  );
  const formattedAvailableAmount = rawAvailableAmount.div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();

  const rawUnavailableAmount = unavailableTickets.reduce(
    (amount: BigNumber, ticket) => amount.plus(ticket.jsonFields.amount),
    new BigNumber(0),
  );
  const formattedUnavailableAmount = rawUnavailableAmount.div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();

  const ticketFields = data.map((ticket) => ticket.jsonFields);
  const stakedAmount = ticketFields
    .reduce((staked, { vesting: { notional, released } }) => {
      const rest = new BigNumber(notional).minus(released);
      return staked.plus(rest);
    }, new BigNumber(0))
    .toFixed(0);

  const formattedStakedAmount = new BigNumber(stakedAmount).div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS).toString();

  return {
    tickets: data,
    stakedAmount: formattedStakedAmount,
    availableTicketsAmount: formattedAvailableAmount,
    availableTickets,
    unavailableTicketsAmount: formattedUnavailableAmount,
    unavailableTickets,
  };
};

type TokenInfoVariant =
  | { variant: "string"; quoteMint: string }
  | { variant: "publicKey"; quoteMint: PublicKey }
  | { variant?: undefined; quoteMint: string };

export const getTokenInfo = ({ variant, quoteMint }: TokenInfoVariant) => {
  if (variant === "publicKey" && quoteMint instanceof PublicKey) {
    return getTokenInfoByMint(quoteMint);
  } else if (variant === "string" || !variant) {
    return getTokenInfoByMint(new PublicKey(quoteMint));
  }
  throw new Error("Invalid variant or quoteMint type");
};
