import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
  Img,
} from '@react-email/components';

interface BaseLayoutProps {
  children: React.ReactNode;
  locale?: 'ar' | 'en';
  previewText?: string;
}

const BaseLayout = ({ children, locale = 'en' }: BaseLayoutProps) => {
  const isArabic = locale === 'ar';
  const dir = isArabic ? 'rtl' : 'ltr';

  // Dynamic asset URLs
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ebic.cit.edu.ly';
  const logoUrl = `${baseUrl}/assets/icons/logo.svg`;
  const headerBgUrl = `${baseUrl}/assets/images/backgroundHeader.svg`;

  return (
    <Html dir={dir} lang={locale}>
      <Head />
      <Body style={body}>
        <Container style={container}>
          {/* Header with Background Image */}
          {/* 
            EMAIL-SAFE APPROACH: Use background-image in style attribute
            This works in most email clients (Gmail, Outlook, Apple Mail)
          */}
          <Section
            style={{
              ...header,
              backgroundImage: `linear-gradient(180deg, rgba(38, 50, 56, 0.85) 6.73%, rgba(59, 80, 87, 0.85) 51.44%, rgba(81, 110, 117, 0.85) 89.9%), url(${headerBgUrl})`,
              backgroundBlendMode: 'overlay',
            }}
          >
            {/* Content */}
            <Img
              src={logoUrl}
              alt="EBIC Logo"
              width="80"
              height="100"
              style={logoStyle}
            />

            <Text style={headerTitle}>
              {isArabic
                ? 'مركز ريادة الأعمال وحاضنات الأعمال - مصراتة'
                : 'Entrepreneurship and Business Incubators Center - Misurata'}
            </Text>
            <Text style={headerSubtitle}>
              {isArabic
                ? 'كلية التقنية الصناعية - مصراتة'
                : 'Misurata College of Industrial Technology'}
            </Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={hr} />
            <Text style={footerText}>
              © {new Date().getFullYear()}{' '}
              {isArabic
                ? 'مركز ريادة الأعمال وحاضنات الأعمال - مصراتة. جميع الحقوق محفوظة.'
                : 'Entrepreneurship and Business Incubators Center - Misurata. All rights reserved.'}
            </Text>
            <Text style={footerContact}>
              📧{' '}
              <Link href="mailto:ebic@cit.edu.ly" style={link}>
                ebic@cit.edu.ly
              </Link>
              {' | '}
              🌐{' '}
              <Link href="https://ebic.cit.edu.ly" style={link}>
                www.ebic.cit.edu.ly
              </Link>
            </Text>
            <Text style={footerAddress}>
              {isArabic
                ? 'مصراتة، ليبيا | كلية التقنية الصناعية'
                : 'Misurata, Libya | College of Industrial Technology'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const body: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: 0,
  padding: 0,
};

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  border: '1px solid #eaeaea',
};

const header: React.CSSProperties = {
  background:
    'linear-gradient(180deg, rgba(38, 50, 56, 0.98) 6.73%, #3B5057 51.44%, #516E75 89.9%)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '40px 20px',
  textAlign: 'center' as const,
  borderRadius: '10% 10% 0 0',
  position: 'relative',
};

const logoStyle: React.CSSProperties = {
  display: 'block',
  margin: '0 auto 15px',
};

const headerTitle: React.CSSProperties = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 8px',
  textShadow: '0 1px 2px rgba(0,0,0,0.3)',
};

const headerSubtitle: React.CSSProperties = {
  fontSize: '14px',
  color: '#e0e0e0',
  margin: 0,
  textShadow: '0 1px 1px rgba(0,0,0,0.3)',
};

const content: React.CSSProperties = {
  padding: '30px',
  backgroundColor: '#ffffff',
};

const footer: React.CSSProperties = {
  padding: '20px 30px',
  backgroundColor: '#f8f9fa',
  textAlign: 'center',
};

const hr: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #eaeaea',
  margin: '20px 0',
};

const footerText: React.CSSProperties = {
  fontSize: '12px',
  color: '#7f8c8d',
  margin: '0 0 8px',
};

const footerContact: React.CSSProperties = {
  fontSize: '12px',
  color: '#7f8c8d',
  margin: '0 0 8px',
};

const footerAddress: React.CSSProperties = {
  fontSize: '12px',
  color: '#7f8c8d',
  margin: 0,
};

const link: React.CSSProperties = {
  color: '#3498db',
  textDecoration: 'underline',
};

export default BaseLayout;
