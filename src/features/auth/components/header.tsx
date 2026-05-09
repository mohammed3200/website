import { MainLogo } from '@/constants';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface HeaderProps {
  label?: string;
}

export const Header = ({ label }: HeaderProps) => {
  const t = useTranslations('Common');
  return (
    <div className="w-full flex flex-col gap-y-2 items-center">
      <div className="w-full flex flex-row justify-between items-center">
        <Image
          src={MainLogo.LogoCollege}
          alt="College Icon"
          width={70}
          height={70}
        />
        <Image
          src={MainLogo.Logo}
          alt="Leadership Icon"
          width={50}
          height={50}
        />
      </div>
        <h1 className="text-xl font-semibold font-din-regular">
          {t('centerName')}
        </h1>
      {label && <p className="text-muted-foreground text-sm">{label}</p> }
    </div>
  );
};
