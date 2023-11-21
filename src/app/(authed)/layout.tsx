import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return children;
}
//TODO: Redirect if not authed
