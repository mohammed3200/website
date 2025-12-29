import React from "react";

interface EntrepreneurshipLayoutProps {
  children: React.ReactNode;
}

const EntrepreneurshipLayout = ({ children }: EntrepreneurshipLayoutProps) => {
  return (
    <div className="flex-1 h-full flex flex-col">
      <div className="grow">{children}</div>
      <div className="grow-0">
      </div>
    </div>
  );
};

export default EntrepreneurshipLayout;
