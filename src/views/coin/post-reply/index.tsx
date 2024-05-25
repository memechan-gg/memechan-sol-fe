export const PostReply = ({ openDialog }: { openDialog: () => void }) => {
  return (
    <div>
      <div className="flex w-full">
        <div role="button" className="text-sm font-bold text-link" onClick={openDialog}>
          Post a reply
        </div>
      </div>
    </div>
  );
};
