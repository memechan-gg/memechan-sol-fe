import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

const DarkModeToggle = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setTheme(systemTheme === "dark" ? "dark" : "light");
  }, [systemTheme, setTheme]);

  if (!mounted) return null;
  return (
    <div className="flex justify-center lg:bg-transparent bg-board dark:bg-dark">
      <button
        className="bg-title bg-opacity-15 items-center text-xs justify-center flex flex-row gap-2 font-bold text-regular px-4 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-25"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon/>}
      </button>
    </div>
  );
};

export default DarkModeToggle;
