'use client';

import { useState, useEffect } from 'react';
import { useGetNotificationPreferences } from '@/features/admin/api/notifications/use-get-notification-preferences';
import { usePutNotificationPreferences } from '@/features/admin/api/notifications/use-put-notification-preferences';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export const useNotificationSettings = () => {
  const t = useTranslations('Admin.Notifications.preferences');
  const { data, isLoading } = useGetNotificationPreferences();
  const updatePreferences = usePutNotificationPreferences();

  const preferences = data || {};

  const [localPreferences, setLocalPreferences] = useState({
    emailNewSubmissions: preferences.emailNewSubmissions ?? true,
    emailStatusChanges: preferences.emailStatusChanges ?? true,
    emailSystemErrors: preferences.emailSystemErrors ?? true,
    emailSecurityAlerts: preferences.emailSecurityAlerts ?? true,
    emailUserActivity: preferences.emailUserActivity ?? true,
    emailBackups: preferences.emailBackups ?? false,
    digestMode:
      (preferences.digestMode as 'immediate' | 'daily' | 'weekly') ??
      'immediate',
  });

  // Sync state when data is loaded
  useEffect(() => {
    if (data) {
      setLocalPreferences({
        emailNewSubmissions: data.emailNewSubmissions ?? true,
        emailStatusChanges: data.emailStatusChanges ?? true,
        emailSystemErrors: data.emailSystemErrors ?? true,
        emailSecurityAlerts: data.emailSecurityAlerts ?? true,
        emailUserActivity: data.emailUserActivity ?? true,
        emailBackups: data.emailBackups ?? false,
        digestMode:
          (data.digestMode as 'immediate' | 'daily' | 'weekly') ?? 'immediate',
      });
    }
  }, [data]);

  const handleToggle = (key: keyof typeof localPreferences) => {
    if (key === 'digestMode') return;
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleDigestModeChange = (value: string) => {
    setLocalPreferences((prev) => ({
      ...prev,
      digestMode: value as 'immediate' | 'daily' | 'weekly',
    }));
  };

  const handleSave = async () => {
    try {
      await updatePreferences.mutateAsync(localPreferences);
      toast.success(t('messages.success'));
    } catch (error) {
      toast.error(t('messages.error'));
    }
  };

  const handleReset = () => {
    setLocalPreferences({
      emailNewSubmissions: preferences.emailNewSubmissions ?? true,
      emailStatusChanges: preferences.emailStatusChanges ?? true,
      emailSystemErrors: preferences.emailSystemErrors ?? true,
      emailSecurityAlerts: preferences.emailSecurityAlerts ?? true,
      emailUserActivity: preferences.emailUserActivity ?? true,
      emailBackups: preferences.emailBackups ?? false,
      digestMode:
        (preferences.digestMode as 'immediate' | 'daily' | 'weekly') ??
        'immediate',
    });
  };

  return {
    localPreferences,
    isLoading,
    isSaving: updatePreferences.isPending,
    handleToggle,
    handleDigestModeChange,
    handleSave,
    handleReset,
    t,
  };
};
