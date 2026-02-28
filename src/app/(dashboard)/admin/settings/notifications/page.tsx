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

const PREFERENCE_ITEMS = [
  {
    id: 'new-submissions',
    label: 'New Submissions',
    description: 'Get notified when new submissions are received',
    icon: Users,
    prefKey: 'emailNewSubmissions' as const,
  },
  {
    id: 'status-changes',
    label: 'Status Changes',
    description: 'Get notified when submission status changes',
    icon: Bell,
    prefKey: 'emailStatusChanges' as const,
  },
  {
    id: 'system-errors',
    label: 'System Errors',
    description: 'Receive critical system errors',
    icon: AlertTriangle,
    prefKey: 'emailSystemErrors' as const,
  },
  {
    id: 'security-alerts',
    label: 'Security Alerts',
    description: 'Get notified about suspicious activity',
    icon: Shield,
    prefKey: 'emailSecurityAlerts' as const,
  },
  {
    id: 'user-activity',
    label: 'User Activity',
    description: 'Daily user activity digest',
    icon: Users,
    prefKey: 'emailUserActivity' as const,
  },
  {
    id: 'backups',
    label: 'Database Backups',
    description: 'Receive automated database backup status',
    icon: Database,
    prefKey: 'emailBackups' as const,
  },
];

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
          {PREFERENCE_ITEMS.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor={item.id} className="flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Label>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
              <Switch
                id={item.id}
                checked={localPreferences[item.prefKey]}
                onCheckedChange={() => handleToggle(item.prefKey)}
              />
            </div>
          ))}
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
