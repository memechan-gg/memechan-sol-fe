// context/ReferrerContext.tsx
import { useRouter } from "next/router";
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react";

export type ReferrerContextType = {
  referrer: string | undefined;
  setReferrer: (value: string | undefined) => void;
};

const ReferrerContext = createContext<ReferrerContextType>({
  referrer: undefined,
  setReferrer: () => {},
});

export const ReferrerProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const [referrer, setReferrer] = useState<string | undefined>(undefined);

  useEffect(() => {
    const queryReferrer = router.query.referrer as string;

    if (queryReferrer) {
      setReferrer(queryReferrer);
    }
  }, [router.query]);

  return <ReferrerContext.Provider value={{ referrer, setReferrer }}>{children}</ReferrerContext.Provider>;
};

export const useReferrerContext = () => {
  return useContext(ReferrerContext);
};
