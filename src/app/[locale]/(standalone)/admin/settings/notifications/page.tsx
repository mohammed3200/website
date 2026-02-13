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

export default function NotificationPreferencesPage() {
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
      toast.success('Notification preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
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
        <h1 className="text-3xl font-bold text-gray-900">
          Notification Preferences
        </h1>
        <p className="text-gray-600 mt-1">
          Configure how and when you receive notifications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Choose which types of notifications you want to receive via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="new-submissions"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                New Submissions
              </Label>
              <p className="text-sm text-gray-500">
                Get notified when new collaborators or innovators register
              </p>
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
                Status Changes
              </Label>
              <p className="text-sm text-gray-500">
                Get notified when submissions are approved or rejected
              </p>
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
                System Errors
              </Label>
              <p className="text-sm text-gray-500">
                Get notified about system errors and failures
              </p>
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
                Security Alerts
              </Label>
              <p className="text-sm text-gray-500">
                Get notified about security-related events and failed login
                attempts
              </p>
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
                User Activity
              </Label>
              <p className="text-sm text-gray-500">
                Get notified about user account creation and role changes
              </p>
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
                Database Backups
              </Label>
              <p className="text-sm text-gray-500">
                Get notified when database backups complete
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
          <CardTitle>Notification Delivery</CardTitle>
          <CardDescription>
            Choose how frequently you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="digest-mode">Delivery Mode</Label>
            <Select
              value={localPreferences.digestMode}
              onValueChange={handleDigestModeChange}
            >
              <SelectTrigger id="digest-mode" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">
                  Immediate - Receive notifications as they happen
                </SelectItem>
                <SelectItem value="daily">
                  Daily Digest - Receive a summary once per day
                </SelectItem>
                <SelectItem value="weekly">
                  Weekly Digest - Receive a summary once per week
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Note: Daily and weekly digests are coming soon. Currently, all
              notifications are sent immediately.
            </p>
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
          Reset
        </Button>
        <Button onClick={handleSave} disabled={updatePreferences.isPending}>
          {updatePreferences.isPending ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
