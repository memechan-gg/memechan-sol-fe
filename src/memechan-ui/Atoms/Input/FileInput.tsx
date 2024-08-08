import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Typography } from "../Typography";

interface Props {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
}

const FileInput = ({ file, setFile }: Props) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <div className="flex flex-col flex-grow items-center justify-center gap-2 w-full">
      {file ? (
        <div className="flex justify-between items-center primary-border rounded-sm w-full py-[18px] px-4">
          <span className="truncate">
            <Typography>{file.name}</Typography>
          </span>
          <button onClick={() => setFile(null)} className="text-xs flex">
            <FontAwesomeIcon icon={faClose} className="text-red-100" size="xl" />
          </button>
        </div>
      ) : (
        <>
          <label htmlFor="file-upload" className="hidden"></label>
          <input
            id="file-upload"
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/gif"
            multiple={false}
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="file-upload"
            className="primary-border rounded-sm py-[17px] flex justify-center cursor-pointer w-full text-mono-500"
          >
            <Typography align="center" color="mono-500">
              Attach file{" "}
            </Typography>
          </label>
        </>
      )}
    </div>
  );
};

export default FileInput;
