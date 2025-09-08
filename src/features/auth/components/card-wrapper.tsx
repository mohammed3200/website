"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

import { Header } from "@/features/auth/components/header";
import { Social } from "@/features/auth/components/social";


interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel?: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
        </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
    </Card>
  );
};
