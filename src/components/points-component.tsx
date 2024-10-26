import { usePointsBalance } from "@/hooks/useGetPoints";
import { useGetReferralLink } from "@/hooks/useGetReferralLink";
import { Button } from "@/memechan-ui/Atoms";
import { Divider } from "@/memechan-ui/Atoms/Divider/Divider";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { parseChainValue } from "@/utils/parseChainValue";
import { faCopy } from "@fortawesome/free-solid-svg-icons/faCopy";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

export const PointsComponent = ({ onClick }: { onClick?: () => void }) => {
  const { theme } = useTheme();
  const { data: points } = usePointsBalance();
  const { data: referralLink } = useGetReferralLink();

  console.log(points);
  const handleCopyReferral = () => {
    navigator.clipboard
      .writeText(referralLink || "")
      .then(() => {
        toast.success("Referral link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };
  return (
    <div className="sm:relative focus-visible:outline-none">
      <Popover>
        {({ open, close }) => {
          return (
            <>
              <Popover.Button as="div" className="h-10 focus-visible:outline-none">
                <div className="sm:h-[40px]">
                  <Button
                    variant="secondary"
                    startIcon={<div className="text-[16px] animate-pulse">🔥</div>}
                    className={`pl-3 pr-6 py-2 sm:pr-3 sm:pl-3 gap-x-2 ${
                      theme === "light"
                        ? "text-primary-100 hover:text-mono-200 active:text-mono-200"
                        : "text-primary-100 sm:hover:text-mono-600"
                    }`}
                    onClick={onClick}
                  >
                    <div className="flex flex-col items-start">
                      <p className="text-[13px] font-bold inline-block">
                        {parseChainValue(points?.toNumber() ?? 0, 0, 2)}
                      </p>
                      <p className="text-[13px] font-normal inline-block">Points</p>
                    </div>
                  </Button>
                </div>
              </Popover.Button>
              <Popover.Panel className="fixed inset-0 sm:absolute sm:top-12 sm:left-[-195px] sm:w-[293px] sm:h-[368px] flex items-center justify-center bg-[#19191957] backdrop-blur-[0.5px] z-50 px-10 sm:px-0">
                <Card>
                  <Card.Header>
                    <div className="flex items-center justify-between w-full">
                      <Typography variant="h4" color="green-100">
                        Points
                      </Typography>
                      <FontAwesomeIcon
                        icon={faXmark}
                        color="#fff"
                        className="sm:hover:cursor-pointer"
                        onClick={() => {
                          close();
                        }}
                      />
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div className="flex flex-col gap-y-2 mt-1">
                      <Typography variant="h3" color="mono-600" className="leading-none">
                        Your points
                      </Typography>
                      <Typography variant="body" color="mono-500">
                        Earn more by trading memecoins on memechan.gg
                      </Typography>
                      <div className="w-full mt-1 border border-primary-100 flex justify-between items-center px-4 py-2">
                        <p>🔥</p>
                        <Typography variant="h2" color="primary-100">
                          {parseChainValue(points?.toNumber() ?? 0, 0, 5)} Points
                        </Typography>
                      </div>
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-y-2 mt-3">
                      <Typography variant="h3" color="mono-600" className="leading-none">
                        Your referral link
                      </Typography>
                      <Typography variant="body" color="mono-500">
                        Invite friends using your referral link and earn 25% of all the points they accumulate
                      </Typography>
                      <div className="mt-1 w-full border border-primary-100 flex justify-between items-center px-4 py-2 gap-x-4">
                        <Typography
                          variant="body"
                          color="primary-100"
                          className="text-ellipsis overflow-hidden whitespace-nowrap"
                        >
                          {referralLink}
                        </Typography>
                        <div
                          className={`${
                            theme === "light"
                              ? "text-primary-100 hover:text-mono-200 active:text-mono-200"
                              : "text-primary-100 sm:hover:text-mono-600"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faCopy}
                            onClick={() => {
                              handleCopyReferral();
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Popover.Panel>
            </>
          );
        }}
      </Popover>
    </div>
  );
};
