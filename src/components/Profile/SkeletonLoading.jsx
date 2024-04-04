import { Card, Skeleton } from "@nextui-org/react";

export const SkeletonLoading = () => {
  return (
    <div className="h-[85vh] w-80  sm:w-96 flex justify-center items-center">
      <Card
        className="w-full h-5/6 flex  flex-col gap-2 justify-center items-center p-2 "
        radius="lg"
      >
        <div>
          <Skeleton className="flex rounded-full w-32 h-32" />
        </div>
        <div className="w-full flex flex-col my-2 gap-2 justify-center items-center">
          <Skeleton className="h-3 lg:w-2/5 md:w-2/5 w-full rounded-lg" />
          <Skeleton className="h-3 lg:w-2/5 md:w-2/5 w-full rounded-lg" />
        </div>
        <Skeleton className="h-6 w-5/6   rounded-lg" />
      </Card>
    </div>
  );
};
