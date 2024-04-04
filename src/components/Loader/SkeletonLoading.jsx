import { Card, Skeleton } from "@nextui-org/react";

export const SkeletonLoading = () => {
  return (
    <Card
      className="w-5/6 h-18 flex  gap-2 flex-row items-center p-2 "
      radius="lg"
    >
      <div>
        <Skeleton className="flex rounded-full w-12 h-12" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 lg:w-3/5 md:w-3/5 w-full rounded-lg" />
        <Skeleton className="h-3 lg:w-3/5 md:w-3/5 w-full rounded-lg" />
      </div>
    </Card>
  );
};
