import { MEMECHAN_MEME_TOKEN_DECIMALS, MemeTicketFields } from "@rinegade/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";

// export const getBondingCurvePercentage = (uniqueHolders: Map<string, MemeTicketFields[]>) => {
//   const rawBondingCurveAmount = Array.from(uniqueHolders.values()).reduce(
//     (result, holderTickets) => {
//       holderTickets.forEach((ticket) => {
//         result = result.sub(ticket.amount);
//       });

//       return result;
//     },
//     new BN(MAX_TICKET_TOKENS).mul(new BN(10 ** MEMECHAN_MEME_TOKEN_DECIMALS)),
//   );

//   const formattedBondingCurveAmount = new BigNumber(rawBondingCurveAmount.toString())
//     .div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS)
//     .toString();

//   const bondingCurvePercentage = new BigNumber(formattedBondingCurveAmount)
//     .div(MAX_TICKET_TOKENS)
//     .multipliedBy(100)
//     .toFixed(2);

//   return bondingCurvePercentage;
// };

export const getSlicedAddress = (address: string | PublicKey) => {
  const stringAddress = address.toString();

  return stringAddress.slice(0, 6) + "..." + stringAddress.slice(-4);
};

export const getBoundPoolHolderPercentage = (tickets: MemeTicketFields[], maxTicketTokens: number) => {
  const ticketsMemeAmount = tickets
    .reduce((sum, ticket) => sum.plus(ticket.amount.toString()), new BigNumber(0))
    .div(10 ** MEMECHAN_MEME_TOKEN_DECIMALS);

  const percentage = ticketsMemeAmount.div(maxTicketTokens).multipliedBy(100).toFixed(2);

  return percentage;
};

export const getSlicedAddressV2 = (address: string | PublicKey) => {
  const stringAddress = address.toString();

  return stringAddress.slice(0, 4) + "..." + stringAddress.slice(-4);
};
