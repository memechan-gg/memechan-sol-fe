import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";

// export interface SlideCardProps {
//   image: string;
//   name: string;
//   symbol: string;
//   onClick?: () => void;
//   children?: React.ReactNode;
// }

export default function SlideCard(/* { data }: { data: SlideCardProps } */) {
  return (
    <>
      <Card.Body additionalStyles="custom-outer-shadow w-fit sm:w-[404px] !p-0 border border-mono-400">
        <div className="flex">
          <div className="relative w-[136px] h-[136px]">
            <div className="absolute top-2 left-2 z-10">
              <img src="/top-badge.png" alt="badge" />
            </div>

            <img src="/apple-touch-icon.png" alt="picture" />
          </div>
          <div className="mx-3 my-5">
            <div className="flex flex-col">
              <Typography variant="h4" className="mb-1">
                Thikdik
              </Typography>
              <Typography>THIK</Typography>
            </div>
            <div className="flex flex-col mt-2">
              <Typography variant="h4" className="mb-1">
                Marketcap
              </Typography>
              <Typography>$66,666</Typography>
            </div>
          </div>
        </div>
      </Card.Body>
    </>
  );
}
