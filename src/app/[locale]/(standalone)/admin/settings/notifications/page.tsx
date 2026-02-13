'use client';

import { useState } from 'react';
import {
  useNotificationPreferences,
  useUpdateNotificationPreferences,
} from '@/features/admin/api/use-notifications';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bell,
  Mail,
  Shield,
  AlertTriangle,
  Users,
  Database,
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export default function NotificationPreferencesPage() {
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
    digestMode: preferences.digestMode ?? 'immediate',
  });

  const handleToggle = (key: keyof typeof localPreferences) => {
    if (key === 'digestMode') return; // Handle separately
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('emailTitle')}</h1>
        <p className="text-gray-600 mt-1">{t('emailDesc')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t('emailTitle')}
          </CardTitle>
          <CardDescription>{t('emailDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="new-submissions"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {t('newSubmissions')}
              </Label>
              <p className="text-sm text-gray-500">{t('newSubmissionsDesc')}</p>
            </div>
            <Switch
              id="new-submissions"
              checked={localPreferences.emailNewSubmissions}
              onCheckedChange={() => handleToggle('emailNewSubmissions')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="status-changes"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                {t('statusChanges')}
              </Label>
              <p className="text-sm text-gray-500">{t('statusChangesDesc')}</p>
            </div>
            <Switch
              id="status-changes"
              checked={localPreferences.emailStatusChanges}
              onCheckedChange={() => handleToggle('emailStatusChanges')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="system-errors"
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                {t('systemErrors')}
              </Label>
              <p className="text-sm text-gray-500">{t('systemErrorsDesc')}</p>
            </div>
            <Switch
              id="system-errors"
              checked={localPreferences.emailSystemErrors}
              onCheckedChange={() => handleToggle('emailSystemErrors')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="security-alerts"
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                {t('securityAlerts')}
              </Label>
              <p className="text-sm text-gray-500">{t('securityAlertsDesc')}</p>
            </div>
            <Switch
              id="security-alerts"
              checked={localPreferences.emailSecurityAlerts}
              onCheckedChange={() => handleToggle('emailSecurityAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="user-activity"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                {t('userActivity')}
              </Label>
              <p className="text-sm text-gray-500">{t('userActivityDesc')}</p>
            </div>
            <Switch
              id="user-activity"
              checked={localPreferences.emailUserActivity}
              onCheckedChange={() => handleToggle('emailUserActivity')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="backups" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                {t('databaseBackups')}
              </Label>
              <p className="text-sm text-gray-500">
                {t('databaseBackupsDesc')}
              </p>
            </div>
            <Switch
              id="backups"
              checked={localPreferences.emailBackups}
              onCheckedChange={() => handleToggle('emailBackups')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('deliveryTitle')}</CardTitle>
          <CardDescription>{t('deliveryDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="digest-mode">{t('deliveryMode')}</Label>
            <Select
              value={localPreferences.digestMode}
              onValueChange={handleDigestModeChange}
            >
              <SelectTrigger id="digest-mode" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">
                  {t('modes.immediate')}
                </SelectItem>
                <SelectItem value="daily">{t('modes.daily')}</SelectItem>
                <SelectItem value="weekly">{t('modes.weekly')}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">{t('digestNote')}</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setLocalPreferences({
              emailNewSubmissions: preferences.emailNewSubmissions ?? true,
              emailStatusChanges: preferences.emailStatusChanges ?? true,
              emailSystemErrors: preferences.emailSystemErrors ?? true,
              emailSecurityAlerts: preferences.emailSecurityAlerts ?? true,
              emailUserActivity: preferences.emailUserActivity ?? true,
              emailBackups: preferences.emailBackups ?? false,
              digestMode: preferences.digestMode ?? 'immediate',
            });
          }}
        >
          {t('actions.reset')}
        </Button>
        <Button onClick={handleSave} disabled={updatePreferences.isPending}>
          {updatePreferences.isPending
            ? t('actions.saving')
            : t('actions.save')}
        </Button>
      </div>
    </div>
  );
}
