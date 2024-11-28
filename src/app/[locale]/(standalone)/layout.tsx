interface StandloneLayoutProps {
  children: React.ReactNode;
}

const StandloneLayout = ({ children }: StandloneLayoutProps) => {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-5">
        {children}
        </div>
    </main>
  );
};

export default StandloneLayout;
