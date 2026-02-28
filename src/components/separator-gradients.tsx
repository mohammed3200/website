import { cn } from '@/lib/utils';

interface SeparatorProps {
  className?: string;
}

export const SeparatorGradients = ({ className }: SeparatorProps) => {
  return (
    <div className={cn('w-full h-1 relative', className)}>
      {/* Gradients */}
      <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-[#FE6601] to-transparent h-[2px] w-3/4 blur-sm" />
      <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-[#FE6601] to-transparent h-px w-3/4" />
      <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[##ed847e] to-transparent h-[5px] w-1/4 blur-sm" />
      <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-[##ed847e] to-transparent h-px w-1/4" />
    </div>
  );
};
