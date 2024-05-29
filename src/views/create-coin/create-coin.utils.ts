import { AuthInstance, MemechanClientInstance, TokenApiInstance } from "@/common/solana";
import {
  ADMIN_PUB_KEY,
  BoundPoolClient,
  InvalidCoinDescriptionError,
  InvalidCoinImageError,
  InvalidCoinNameError,
  InvalidCoinSymbolError,
  MEMECHAN_QUOTE_TOKEN,
  NameEqualsToDescriptionError,
  SymbolEqualsToDescriptionError,
  validateCreateCoinParams,
} from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import { ICreateForm } from "./create-coin.types";

export function handleErrors(e: unknown) {
  if (e instanceof InvalidCoinNameError) {
    return toast.error("Invalid coin name");
  } else if (e instanceof InvalidCoinSymbolError) {
    return toast.error("Invalid coin symbol");
  } else if (e instanceof InvalidCoinDescriptionError) {
    return toast.error("Invalid coin description");
  } else if (e instanceof InvalidCoinImageError) {
    return toast.error("Invalid coin image");
  } else if (e instanceof SymbolEqualsToDescriptionError) {
    return toast.error("Symbol equals to description, please provide a different symbol or description");
  } else if (e instanceof NameEqualsToDescriptionError) {
    return toast.error("Name equals to description, please provide a different name or description");
  }

  return toast.error("Unrecognized error occurred while creating meme coin. Please try again");
}

export async function createCoinOnBE({ discord, telegram, twitter, website }: ICreateForm, signatures: string[]) {
  await TokenApiInstance.createToken({
    txDigests: signatures,
    socialLinks: { discord, telegram, twitter, website },
  });
}

export async function createMemeCoin(data: ICreateForm, publicKey: PublicKey, ipfsUrl: string) {
  return await BoundPoolClient.getCreateNewBondingPoolAndTokenTransaction({
    client: MemechanClientInstance,
    quoteToken: MEMECHAN_QUOTE_TOKEN,
    tokenMetadata: {
      ...data,
      image: ipfsUrl,
      telegram: data.telegram ?? "",
      twitter: data.twitter ?? "",
      discord: data.discord ?? "",
      website: data.website ?? "",
    },
    payer: publicKey,
    admin: ADMIN_PUB_KEY,
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
