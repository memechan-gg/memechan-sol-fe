export async function waitForDelay(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}
