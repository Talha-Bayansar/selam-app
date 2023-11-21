import { type HTMLAttributes } from "react";
import { Button, Separator } from ".";
import Link from "next/link";
import { cn } from "~/lib";

type Props = {
  href: string;
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
      >
        <Link href={href} className="flex w-full flex-col items-start">
          <p>{title}</p>
          {subtitle && <span>{subtitle}</span>}
        </Link>
      </Button>
      {isLastItem && <Separator />}
    </div>
  );
};
