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

export async function createCoin(data: ICreateForm, digest: string) {
  
}

export async function createMemeCoin(data: ICreateForm, address: string, ipfsUrl: string) {
}

export async function createBondingCurvePool() {}

export async function handleAuthentication(
  address: string,
  sign: ((message: Uint8Array) => Promise<Uint8Array>)
) {
  /*
  let messageToSign = await AuthInstance.requestMessageToSign(address);

  let signature = await sign({
    message: new TextEncoder().encode(messageToSign),
  });

  await AuthInstance.refreshSession({
    signedMessage: signature.signature,
    walletAddress: address,
  });*/
}

export async function uploadImageToIPFS(file: File) {
  //let result = await CoinAPIInstance.uploadFile(file);
  //return `https://lavender-gentle-primate-223.mypinata.cloud/ipfs/${result.IpfsHash}?pinataGatewayToken=M45Jh03NicrVqTZJJhQIwDtl7G6fGS90bjJiIQrmyaQXC_xXj4BgRqjjBNyGV7q2`;
  return '';
}

export function validateCoinParams(data: ICreateForm, address: string, ipfsUrl: string) {
}
