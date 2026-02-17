'use client';

import React, { JSX, useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/responsive-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTranslations } from 'next-intl';

export const useConfirm = (
  title: string,
  message: string,
  variant: ButtonProps['variant'] = 'default',
): [() => JSX.Element, () => Promise<unknown>] => {
  const t = useTranslations('ui');
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    if (promise) {
      promise.resolve(false);
    }
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    setPromise(null); // Clear state directly after resolving
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="pt-8">
          <CardHeader className="p-0">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <div className="pt-4 w-full flex flex-col gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="w-full lg:w-auto"
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className="w-full lg:w-auto"
            >
              {t('confirm')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </ResponsiveModal>
  );

  return [ConfirmationDialog, confirm];
};
