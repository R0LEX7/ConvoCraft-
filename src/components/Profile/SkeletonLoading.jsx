import { Card, Skeleton } from "@nextui-org/react";

export const SkeletonLoading = () => {
  return (
    <Card
      className="w-2/3 h-18 flex  flex-col gap-2 items-center p-2 "
      radius="lg"
    >
      <div>
        <Skeleton className="flex rounded-full w-32 h-32" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-3 lg:w-2/5 md:w-2/5 w-full rounded-lg" />
        <Skeleton className="h-3 lg:w-2/5 md:w-2/5 w-full rounded-lg" />
      </div>
    </Card>
  );
};
