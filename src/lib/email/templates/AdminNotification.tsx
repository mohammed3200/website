import React from 'react';
import { Text, Section, Heading, Button } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface AdminNotificationProps {
  adminName: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  locale?: 'ar' | 'en';
  timestamp?: Date;
}

export const AdminNotification = ({
  adminName,
  title,
  message,
  actionUrl,
  actionText,
  priority = 'NORMAL',
  locale = 'en',
  timestamp,
}: AdminNotificationProps) => {
  const isArabic = locale === 'ar';
  const textAlign = isArabic ? 'right' : 'left';

  // Get priority styling
  const getPriorityColor = () => {
    switch (priority) {
      case 'URGENT':
        return '#dc2626'; // red-600
      case 'HIGH':
        return '#ea580c'; // orange-600
      case 'NORMAL':
        return '#2563eb'; // blue-600
      case 'LOW':
        return '#16a34a'; // green-600
      default:
        return '#2563eb';
    }
  };

  const getPriorityLabel = () => {
    if (isArabic) {
      switch (priority) {
        case 'URGENT':
          return 'عاجل';
        case 'HIGH':
          return 'عالية';
        case 'NORMAL':
          return 'عادية';
        case 'LOW':
          return 'منخفضة';
        default:
          return 'عادية';
      }
    }
    return priority;
  };

  return (
    <BaseLayout locale={locale}>
      {/* Priority Badge */}
      <Section style={{ textAlign: 'center' as const, marginBottom: '16px' }}>
        <span
          style={{
            ...priorityBadge,
            backgroundColor: getPriorityColor(),
          }}
        >
          {getPriorityLabel()}
        </span>
      </Section>

      <Heading style={{ ...heading, textAlign }}>
        {isArabic ? `عزيزي/عزيزتي ${adminName}،` : `Dear ${adminName},`}
      </Heading>

      {/* Notification Title */}
      <Section style={notificationBox}>
        <Text style={{ ...notificationTitle, textAlign }}>
          📢 {title}
        </Text>
        <Text style={{ ...notificationMessage, textAlign }}>
          {message}
        </Text>
      </Section>

      {/* Timestamp */}
      {timestamp && (
        <Text style={{ ...timestampStyle, textAlign }}>
          {isArabic ? 'الوقت:' : 'Time:'}{' '}
          {timestamp.toLocaleString(isArabic ? 'ar-LY' : 'en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </Text>
      )}

      {/* Action Button */}
      {actionUrl && (
        <Section style={{ marginTop: '32px', textAlign: 'center' as const }}>
          <Button href={actionUrl} style={button}>
            {actionText || (isArabic ? 'اتخاذ إجراء' : 'Take Action')}
          </Button>
        </Section>
      )}

      {/* Instructions */}
      <Section style={instructionsBox}>
        <Text style={{ ...instructionsText, textAlign }}>
          {isArabic
            ? 'يمكنك إدارة تفضيلات الإشعارات الخاصة بك من لوحة تحكم المسؤول.'
            : 'You can manage your notification preferences from the admin dashboard.'}
        </Text>
      </Section>

      <Text style={{ ...signature, textAlign }}>
        {isArabic ? 'مع أطيب التحيات،' : 'Best regards,'}
        <br />
        <strong>
          {isArabic
            ? 'نظام إدارة مركز الريادة والحاضنات والتطوير التقني - مصراتة'
            : 'EBIC - Misrata Management System'}
        </strong>
      </Text>
    </BaseLayout>
  );
};

// Styles
const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 24px',
};

const priorityBadge = {
  display: 'inline-block',
  padding: '6px 16px',
  borderRadius: '20px',
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const notificationBox = {
  backgroundColor: '#f0f9ff',
  padding: '24px',
  borderRadius: '8px',
  border: '2px solid #3b82f6',
  marginTop: '24px',
};

const notificationTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 12px',
};

const notificationMessage = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '0',
};

const timestampStyle = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '16px 0 0',
  fontStyle: 'italic' as const,
};

const button = {
  backgroundColor: '#fe6601',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: 'bold',
  display: 'inline-block',
};

const instructionsBox = {
  backgroundColor: '#fffbeb',
  padding: '16px',
  borderRadius: '6px',
  border: '1px solid #fbbf24',
  marginTop: '32px',
};

const instructionsText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#92400e',
  margin: '0',
};

const signature = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '32px 0 0',
};

export default AdminNotification;
