import CloseIcon from "@/memechan-ui/icons/CloseIcon";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

interface Props {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
}

const FileInput = ({ file, setFile }: Props) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // TODO:EDO:2
  // make css for INPUT to be pitch perfect as it is in FIGMA
  // https://www.figma.com/design/9dHzMvZyvOwsPlFMPv6lXf/memechan.gg?node-id=576-68521&t=xJg0UxajLzZyeSqo-4
  return (
    <div className="flex flex-col items-center justify-center gap-2 w-full">
      {file ? (
        <div className="flex justify-between items-center border border-regular rounded-lg w-full p-1">
          <span className="text-regular truncate">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-xs text-error">
            <CloseIcon />
          </button>
        </div>
      ) : (
        <>
          <label htmlFor="file-upload" className="text-regular text-xs mb-2 self-start">
            Attach file
          </label>
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
            className="border border-regular rounded-lg p-2 inline-block cursor-pointer w-full text-center"
          >
            Choose a file
          </label>
        </>
      )}
    </div>
  );
};

export default FileInput;
