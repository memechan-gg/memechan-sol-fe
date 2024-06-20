import * as nsfwjs from "nsfwjs";
import { useEffect, useState } from "react";

export function useNSFWModel() {
  const [model, setModel] = useState<nsfwjs.NSFWJS | null>(null);

  useEffect(() => {
    async function loadModel() {
      const loadedModel = await nsfwjs.load();
      setModel(loadedModel);
    }
    loadModel();
  }, []);

  return model;
}
