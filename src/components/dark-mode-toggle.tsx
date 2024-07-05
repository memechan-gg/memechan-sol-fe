import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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
        className="text-black text-sm hover:text-gray-800 dark:text-white dark:hover:text-gray-300 z-50"
        onClick={toggleTheme}
      >
        {theme === "dark" ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
};

export default DarkModeToggle;
