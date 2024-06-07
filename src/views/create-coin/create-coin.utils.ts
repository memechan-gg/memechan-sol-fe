import { AuthInstance, TokenApiInstance } from "@/common/solana";
import {
  ADMIN_PUB_KEY,
  BoundPoolClient,
  CoinDescriptionTooLargeError,
  InvalidCoinDescriptionError,
  InvalidCoinImageError,
  InvalidCoinNameError,
  InvalidCoinSymbolError,
  MAX_DESCRIPTION_LENGTH,
  MAX_NAME_LENGTH,
  MAX_SYMBOL_LENGTH,
  MEMECHAN_QUOTE_TOKEN,
  MemeTicketClient,
  MemechanClient,
  validateCreateCoinParams,
} from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import { ICreateForm } from "./create-coin.types";

export function handleErrors(e: unknown) {
  if (e instanceof InvalidCoinNameError) {
    return toast.error(`Invalid coin name. Coin name can contain ${MAX_NAME_LENGTH} symbols as max.`);
  } else if (e instanceof InvalidCoinSymbolError) {
    return toast.error(`Invalid coin symbol. Coin symbol can contain ${MAX_SYMBOL_LENGTH} symbols as max.`);
  } else if (e instanceof InvalidCoinDescriptionError) {
    return toast.error(
      `Invalid coin description. Coin description can contain ${MAX_DESCRIPTION_LENGTH} symbols as max.`,
    );
  } else if (e instanceof InvalidCoinImageError) {
    return toast.error("Invalid coin image");
  } else if (e instanceof CoinDescriptionTooLargeError) {
    return toast.error(`Coin description is too large. Max ${MAX_DESCRIPTION_LENGTH} symbols are allowed.`);
  } else if (e instanceof Error) {
    return toast.error(`Unexpected error occured during coin creation: ${e.message}`);
  }

  console.error(`[handleErrors] error: `, e);
  return toast.error("Unrecognized error occurred while creating meme coin. Please try again");
}

export async function createCoinOnBE({ discord, telegram, twitter, website }: ICreateForm, signatures: string[]) {
  await TokenApiInstance.createToken({
    txDigests: signatures,
    socialLinks: { discord, telegram, twitter, website },
  });
}

export async function createMemeCoinAndPool({
  data,
  ipfsUrl,
  publicKey,
  inputAmount,
  client,
}: {
  data: ICreateForm;
  publicKey: PublicKey;
  ipfsUrl: string;
  inputAmount?: string;
  client: MemechanClient;
}) {
  return await BoundPoolClient.getCreateNewBondingPoolAndBuyAndTokenWithBuyMemeTransaction({
    admin: ADMIN_PUB_KEY,
    client,
    payer: publicKey,
    tokenMetadata: {
      ...data,
      image: ipfsUrl,
      telegram: data.telegram ?? "",
      twitter: data.twitter ?? "",
      discord: data.discord ?? "",
      website: data.website ?? "",
    },
    quoteToken: MEMECHAN_QUOTE_TOKEN,
    buyMemeTransactionArgs:
      inputAmount !== undefined
        ? {
            inputAmount,
            // TODO: Implement output amount printing to user
            minOutputAmount: "0",
            slippagePercentage: 0,
            user: publicKey,
            memeTicketNumber: MemeTicketClient.TICKET_NUMBER_START,
          }
        : undefined,
  });
}

export async function handleAuthentication(address: string, sign: (message: Uint8Array) => Promise<Uint8Array>) {
  const messageToSign = await AuthInstance.requestMessageToSign(address);
  const encodedMessage = new TextEncoder().encode(messageToSign);

  const signatureUint8Array = await sign(encodedMessage);
  const signatureHex = Buffer.from(signatureUint8Array).toString("hex");

  await AuthInstance.refreshSession({
    signedMessage: signatureHex,
    walletAddress: address,
  });
}

export async function uploadImageToIPFS(file: File) {
  let result = await TokenApiInstance.uploadFile(file);
  return `https://lavender-gentle-primate-223.mypinata.cloud/ipfs/${result.IpfsHash}?pinataGatewayToken=M45Jh03NicrVqTZJJhQIwDtl7G6fGS90bjJiIQrmyaQXC_xXj4BgRqjjBNyGV7q2`;
}

export function validateCoinParamsWithoutImage(data: ICreateForm) {
  validateCreateCoinParams({
    name: data.name,
    description: data.description,
    image: "https://mock.com",
    symbol: data.symbol,
  });
}

export function validateCoinParamsWithImage(data: ICreateForm, ipfsUrl: string) {
  validateCreateCoinParams({ name: data.name, description: data.description, image: ipfsUrl, symbol: data.symbol });
}
