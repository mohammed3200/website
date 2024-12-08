import { Footer } from "@/components";
import React from "react";

interface EntrepreneurshipLayoutProps {
  children: React.ReactNode;
}

const EntrepreneurshipLayout = ({ children }: EntrepreneurshipLayoutProps) => {
  return (
    <div className="flex-1 min-h-screen flex flex-col">
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
};

export default EntrepreneurshipLayout;
