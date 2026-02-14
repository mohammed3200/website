'use client';

import { useState } from 'react';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/features/admin/api/use-notifications';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export const useNotificationSettings = () => {
  const t = useTranslations('Admin.Notifications.preferences');
  const { data, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const preferences = data?.preferences || {};

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
  useState(() => {
    if (data?.preferences) {
      setLocalPreferences({
        emailNewSubmissions: data.preferences.emailNewSubmissions ?? true,
        emailStatusChanges: data.preferences.emailStatusChanges ?? true,
        emailSystemErrors: data.preferences.emailSystemErrors ?? true,
        emailSecurityAlerts: data.preferences.emailSecurityAlerts ?? true,
        emailUserActivity: data.preferences.emailUserActivity ?? true,
        emailBackups: data.preferences.emailBackups ?? false,
        digestMode:
          (data.preferences.digestMode as 'immediate' | 'daily' | 'weekly') ??
          'immediate',
      });
    }
  });

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
