import { ChevronDown } from "lucide-react";
import {
  Button,
  type ButtonProps,
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui";
import { cn } from "~/lib";

type Props = {
  actions: JSX.Element[];
} & ButtonProps &
  React.RefAttributes<HTMLButtonElement>;

export const ActionsButton = ({ actions, ...props }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          {...props}
          variant={props.variant ?? "outline"}
          className={cn(
            "flex w-full items-center gap-1 md:w-auto",
            props.className,
          )}
        >
          Actions
          <ChevronDown size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 pb-8" side="bottom">
        <SheetHeader>
          <SheetTitle>Actions</SheetTitle>
        </SheetHeader>
        <SheetFooter className="flex-col gap-4 md:gap-0">
          {actions.map((action) => (
            <SheetClose key={action.key} asChild>
              {action}
            </SheetClose>
          ))}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
