import React from 'react';
import { Text, Section, Heading, Button } from '@react-email/components';
import BaseLayout from './BaseLayout';

interface StatusUpdateProps {
  name: string;
  type: 'collaborator' | 'innovator';
  status: 'approved' | 'rejected';
  locale?: 'ar' | 'en';
  reason?: string;
  nextSteps?: string[];
}

export const StatusUpdate = ({
  name,
  type,
  status,
  locale = 'en',
  reason,
  nextSteps,
}: StatusUpdateProps) => {
  const isArabic = locale === 'ar';
  const isApproved = status === 'approved';
  const textAlign = isArabic ? 'right' : 'left';

  return (
    <BaseLayout locale={locale}>
      {/* Icon */}
      <Section style={{ textAlign: 'center' as const, marginBottom: '24px' }}>
        <Text style={{ fontSize: '64px', margin: '0' }}>
          {isApproved ? '✅' : '❌'}
        </Text>
      </Section>

      <Heading style={{ ...heading, textAlign }}>
        {isArabic ? `عزيزي/عزيزتي ${name}،` : `Dear ${name},`}
      </Heading>

      {/* Status Box */}
      <Section style={isApproved ? approvalBox : rejectionBox}>
        <Text style={{ ...statusTitle, textAlign }}>
          {isArabic
            ? isApproved
              ? '🎉 تمت الموافقة على طلبك!'
              : '😔 نأسف لإبلاغك'
            : isApproved
              ? '🎉 Your Request Has Been Approved!'
              : '😔 We Regret to Inform You'}
        </Text>
        <Text style={{ ...statusText, textAlign }}>
          {isArabic
            ? isApproved
              ? `يسرنا إبلاغكم بأنه تمت الموافقة على ${
                  type === 'collaborator'
                    ? 'طلب التعاون الخاص بكم'
                    : 'مشروعكم الابتكاري'
                }!`
              : `بعد المراجعة الدقيقة، لم نتمكن من قبول ${
                  type === 'collaborator' ? 'طلب التعاون' : 'المشروع'
                } في هذا الوقت.`
            : isApproved
              ? `We are pleased to inform you that your ${
                  type === 'collaborator'
                    ? 'collaboration request'
                    : 'innovative project'
                } has been approved!`
              : `After careful review, we were unable to accept your ${
                  type === 'collaborator' ? 'collaboration request' : 'project'
                } at this time.`}
        </Text>
      </Section>

      {/* Reason (for rejections) */}
      {!isApproved && reason && (
        <Section style={{ marginTop: '24px' }}>
          <Text style={{ ...sectionTitle, textAlign }}>
            {isArabic ? '📝 السبب:' : '📝 Reason:'}
          </Text>
          <Text style={{ ...text, textAlign }}>{reason}</Text>
        </Section>
      )}

      {/* Next Steps */}
      {nextSteps && nextSteps.length > 0 && (
        <Section style={{ marginTop: '24px' }}>
          <Text style={{ ...sectionTitle, textAlign }}>
            {isArabic ? '👣 الخطوات القادمة:' : '👣 Next Steps:'}
          </Text>
          <ul
            style={{
              paddingRight: isArabic ? '20px' : '0',
              paddingLeft: isArabic ? '0' : '20px',
            }}
          >
            {nextSteps.map((step, index) => (
              <li key={index} style={{ ...listItem, textAlign }}>
                {step}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Approved: Call to Action */}
      {isApproved && (
        <Section style={{ marginTop: '32px', textAlign: 'center' as const }}>
          <Button
            href={`${process.env.NEXT_PUBLIC_APP_URL || 'https://ebic.cit.edu.ly'}/${locale}/contact`}
            style={button}
          >
            {isArabic ? 'تواصل معنا' : 'Contact Us'}
          </Button>
        </Section>
      )}

      {/* Rejected: Encouragement */}
      {!isApproved && (
        <Section style={encouragementBox}>
          <Text style={{ ...text, textAlign }}>
            {isArabic
              ? 'نشجعكم على تطوير مشروعكم والتقديم مرة أخرى في المستقبل. نحن هنا لدعمكم!'
              : 'We encourage you to develop your project and reapply in the future. We are here to support you!'}
          </Text>
        </Section>
      )}

      {/* Closing */}
      <Text style={{ ...text, textAlign, marginTop: '32px' }}>
        {isArabic
          ? `نقدر اهتمامكم ونتطلع ${isApproved ? 'للعمل معكم' : 'لفرص تعاون مستقبلية'}!`
          : `We appreciate your interest and look forward to ${
              isApproved
                ? 'working with you'
                : 'future collaboration opportunities'
            }!`}
      </Text>

      <Text style={{ ...signature, textAlign }}>
        {isArabic ? 'مع أطيب التحيات،' : 'Best regards,'}
        <br />
        <strong>
          {isArabic
            ? 'فريق مركز الريادة والحاضنات والتطوير التقني - مصراتة'
            : 'Entrepreneurship, Incubators & Technical Development Center - Misrata Team'}
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

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '16px 0',
};

const approvalBox = {
  backgroundColor: '#f0fdf4',
  padding: '24px',
  borderRadius: '8px',
  border: '2px solid #10b981',
  marginTop: '24px',
};

const rejectionBox = {
  backgroundColor: '#fef2f2',
  padding: '24px',
  borderRadius: '8px',
  border: '2px solid #ef4444',
  marginTop: '24px',
};

const statusTitle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 12px',
};

const statusText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '0',
};

const sectionTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1f2937',
  margin: '0 0 16px',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '1.8',
  color: '#4b5563',
  marginBottom: '8px',
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

const encouragementBox = {
  backgroundColor: '#fffbeb',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #fbbf24',
  marginTop: '24px',
};

const signature = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#4b5563',
  margin: '24px 0 0',
};

export default StatusUpdate;
