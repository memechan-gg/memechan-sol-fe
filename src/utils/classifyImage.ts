import * as nsfwjs from "nsfwjs";
import { NSFW_CLASSES, NSFW_THRESHOLD } from "./constants";

interface ClassifyImageProps {
  img: HTMLImageElement;
  model?: nsfwjs.NSFWJS | null;
  setValue?: (value: boolean) => void;
}

export const classifyImage = async ({ img, model, setValue }: ClassifyImageProps) => {
  if (!model) return;

  const predictions = await model.classify(img);
  const nsfwProbability = predictions.reduce((acc, curr) => {
    if (NSFW_CLASSES.includes(curr.className)) {
      return acc + curr.probability;
    }
    return acc;
  }, 0);

  const val = nsfwProbability > NSFW_THRESHOLD;
  setValue?.(val);

  return val;
};
