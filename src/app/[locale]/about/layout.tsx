import React from 'react';

interface AboutLayoutProps {
  children: React.ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-grow">{children}</div>
    </div>
  );
}
