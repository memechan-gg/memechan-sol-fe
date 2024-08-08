import { createContext, FC, PropsWithChildren, useContext, useState } from "react";

export type PopupContextType = {
  isPopupOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
  setIsPopupOpen: (value: boolean) => void;
};

const PopupContext = createContext<PopupContextType>({
  isPopupOpen: false,
  openPopup: () => {},
  closePopup: () => {},
  setIsPopupOpen: (value: boolean) => {},
});

export const usePopup = () => {
  return useContext(PopupContext);
};

export const PopupProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <PopupContext.Provider
      value={{
        isPopupOpen,
        openPopup,
        closePopup,
        setIsPopupOpen,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

export const usePopupContext = () => {
  return useContext(PopupContext);
};
