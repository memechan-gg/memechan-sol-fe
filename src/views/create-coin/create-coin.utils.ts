import { AuthInstance, MemechanClientInstance } from "@/common/solana";
import { ADMIN_PUB_KEY, BoundPoolClient, MEMECHAN_QUOTE_TOKEN } from "@avernikoz/memechan-sol-sdk";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import { ICreateForm } from "./create-coin.types";
export function handleErrors(e: unknown) {
  /*if (e instanceof InvalidCoinNameError) {
    return toast.error("Invalid coin name");
  } else if (e instanceof InvalidCoinSymbolError) {
    return toast.error("Invalid coin symbol");
  } else if (e instanceof InvalidCoinDecimalsError) {
    return toast.error("Invalid coin decimals");
  } else if (e instanceof InvalidCoinTotalSupplyError) {
    return toast.error("Invalid coin total supply");
  } else if (e instanceof InvalidCoinDescriptionError) {
    return toast.error("Invalid coin description");
  } else if (e instanceof InvalidCoinImageError) {
    return toast.error("Invalid coin image");
  } else if (e instanceof InvalidSignerAddressError) {
    return toast.error("Invalid signer address");
  } else if (e instanceof SymbolEqualsToDescriptionError) {
    return toast.error("Symbol equals to description, please provide a different symbol");
  } else if (e instanceof NameEqualsToDescriptionError) {
    return toast.error("Name equals to description, please provide a different name");
  }*/

  return toast.error("An error occurred while creating meme coin, please try again");
}

export async function createCoin(data: ICreateForm, digest: string) {}

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

export async function createBondingCurvePool() {}

export async function handleAuthentication(address: string, sign: (message: Uint8Array) => Promise<Uint8Array>) {
  const messageToSign = await AuthInstance.requestMessageToSign(address);

  const signatureUint8Array = await sign(new TextEncoder().encode(messageToSign));
  const signature = new TextDecoder().decode(signatureUint8Array);

  console.log("signature:", signature.toString());
  console.log("walletAddress:", address);

  await AuthInstance.refreshSession({
    signedMessage: signature,
    walletAddress: address,
  });
}

export async function uploadImageToIPFS(file: File) {
  //let result = await CoinAPIInstance.uploadFile(file);
  //return `https://lavender-gentle-primate-223.mypinata.cloud/ipfs/${result.IpfsHash}?pinataGatewayToken=M45Jh03NicrVqTZJJhQIwDtl7G6fGS90bjJiIQrmyaQXC_xXj4BgRqjjBNyGV7q2`;
  return "";
}

export function validateCoinParams(data: ICreateForm, address: string, ipfsUrl: string) {}
