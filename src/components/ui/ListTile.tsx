import { type HTMLAttributes } from "react";
import { Button, Separator, Skeleton } from ".";
import Link from "next/link";
import { cn } from "~/lib";

type Props = {
  href?: string;
  title: string;
  subtitle?: string;
  isLastItem: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ListTile = ({
  href,
  title,
  subtitle,
  isLastItem,
  ...props
}: Props) => {
  return (
    <div {...props} className={cn("w-full", props.className)}>
      <Button
        className="flex h-auto w-full flex-col items-start px-0"
        variant="ghost"
        asChild={!!href}
      >
        {!!href ? (
          <Link href={href} className="flex w-full flex-col items-start">
            <div className="text-lg">{title}</div>
            {subtitle && <span className="text-xs">{subtitle}</span>}
          </Link>
        ) : (
          <>
            <div className="w-full overflow-hidden text-ellipsis text-start text-lg">
              {title}
            </div>
            {subtitle && (
              <span className="w-full overflow-hidden text-ellipsis text-start text-xs">
                {subtitle}
              </span>
            )}
          </>
        )}
      </Button>
      {isLastItem && <Separator />}
    </div>
  );
};

type SkeletonProps = {
  hasSubtitle?: boolean;
  isLastItem: boolean;
} & HTMLAttributes<HTMLDivElement>;

export const ListTileSkeleton = ({
  hasSubtitle = false,
  isLastItem,
  ...props
}: SkeletonProps) => {
  return (
    <div {...props} className={cn("w-full", props.className)}>
      <Button
        disabled
        className="flex h-auto w-full flex-col items-start gap-1 px-0"
        variant="ghost"
      >
        <Skeleton className="h-6 w-32" />
        {hasSubtitle && <Skeleton className="h-4 w-24" />}
      </Button>
      {isLastItem && <Separator />}
    </div>
  );
};
