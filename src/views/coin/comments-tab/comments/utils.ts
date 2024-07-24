import { CoinThread, CoinThreadWithParsedMessage } from "../../coin.types";

export function filterThreads(threads: CoinThread[]): CoinThreadWithParsedMessage[] {
  const newThreads: CoinThreadWithParsedMessage[] = [];

  threads.forEach((thread) => {
    try {
      const parsedMessage = JSON.parse(thread.message);

      if (isCoinThreadMessage(parsedMessage)) {
        const newThread = { ...thread, message: parsedMessage };
        newThreads.push(newThread);
      }
    } catch (error) {
      console.error(error);
    }
  });

  return newThreads;
}

function isCoinThreadMessage(data: unknown): data is { message: string; replyTo?: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string" &&
    (!("replyTo" in data) || ("replyTo" in data && typeof data.replyTo === "string"))
  );
}
