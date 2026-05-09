interface AboutLayoutProps {
  children: React.ReactNode;
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return (
    <div className="flex-1 flex flex-col">
      {children}
    </div>
  );
}
