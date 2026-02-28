'use client';

import { useNotificationSettings } from '@/features/admin/hooks/use-notification-settings';
import {
  Bell,
  Mail,
  Shield,
  AlertTriangle,
  Users,
  Database,
} from 'lucide-react';

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

const NotificationPreferencesPage = () => {
  const {
    localPreferences,
    isLoading,
    isSaving,
    handleToggle,
    handleDigestModeChange,
    handleSave,
    handleReset,
  } = useNotificationSettings();

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
        <h1 className="text-3xl font-bold text-gray-900">Email Preferences</h1>
        <p className="text-gray-600 mt-1">Manage what emails you receive</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Preferences
          </CardTitle>
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
                Get notified when new submissions are received
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
                Get notified when submission status changes
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
                Receive critical system errors
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
                Get notified about suspicious activity
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
                Daily user activity digest
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
                Receive automated database backup status
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
          <CardTitle>Delivery Options</CardTitle>
          <CardDescription>
            Choose how often you want to receive these emails
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
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-2">
              Note: Critical security alerts and system errors will always be
              sent immediately regardless of your digest settings.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          Reset Changes
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferencesPage;
