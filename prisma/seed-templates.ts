import 'dotenv/config';
import { PrismaClient, Channel } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({
  adapter,
  log: ['error'],
});

const TEMPLATES = [
  {
    slug: 'submission_confirmation',
    channel: Channel.BOTH,
    nameAr: 'تأكيد استلام الطلب',
    nameEn: 'Submission Confirmation',
    subjectAr: 'تم استلام طلبك بنجاح',
    subjectEn: 'Submission Received Successfully',
    bodyAr: `مرحباً {{name}}،

تم استلام طلبك بنجاح. سنقوم بمراجعته والرد عليك قريباً.

رقم الطلب: {{submissionId}}`,
    bodyEn: `Hello {{name}},

Your submission has been received successfully. We will review it and get back to you soon.

Submission ID: {{submissionId}}`,
    variables: JSON.stringify(['name', 'type', 'submissionId']),
  },
  {
    slug: 'status_update_approved',
    channel: Channel.BOTH,
    nameAr: 'تحديث الحالة: تمت الموافقة',
    nameEn: 'Status Update: Approved',
    subjectAr: '✅ تهانينا! تمت الموافقة على طلبك',
    subjectEn: '✅ Congratulations! Your request has been approved',
    bodyAr: `مرحباً {{name}}،

يسعدنا إخبارك بأنه تمت الموافقة على طلبك.

الخطوات القادمة:
{{nextSteps}}`,
    bodyEn: `Hello {{name}},

We are pleased to inform you that your request has been approved.

Next Steps:
{{nextSteps}}`,
    variables: JSON.stringify(['name', 'type', 'nextSteps']),
  },
  {
    slug: 'status_update_rejected',
    channel: Channel.BOTH,
    nameAr: 'تحديث الحالة: مرفوض',
    nameEn: 'Status Update: Rejected',
    subjectAr: 'تحديث بخصوص طلبك',
    subjectEn: 'Update regarding your request',
    bodyAr: `مرحباً {{name}}،

ناسف لإخبارك بأنه لم يتم قبول طلبك في الوقت الحالي.

السبب:
{{reason}}`,
    bodyEn: `Hello {{name}},

We regret to inform you that your request was not accepted at this time.

Reason:
{{reason}}`,
    variables: JSON.stringify(['name', 'type', 'reason']),
  },
  {
    slug: 'password_reset',
    channel: Channel.EMAIL,
    nameAr: 'إعادة تعيين كلمة المرور',
    nameEn: 'Password Reset',
    subjectAr: '🔐 طلب إعادة تعيين كلمة المرور',
    subjectEn: '🔐 Password Reset Request',
    bodyAr: `مرحباً {{name}}،

لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. انقر على الرابط أدناه للمتابعة:
{{resetLink}}

الرابط صالح لمدة {{expiresIn}}.`,
    bodyEn: `Hello {{name}},

We received a request to reset your password. Click the link below to proceed:
{{resetLink}}

Link expires in {{expiresIn}}.`,
    variables: JSON.stringify(['name', 'resetLink', 'expiresIn']),
  },
  {
    slug: 'welcome',
    channel: Channel.BOTH,
    nameAr: 'رسالة ترحيب',
    nameEn: 'Welcome Message',
    subjectAr: '🎉 مرحباً بك في المنصة',
    subjectEn: '🎉 Welcome to the Platform',
    bodyAr: `مرحباً {{name}}،

يسعدنا انضمامك إلينا بصفتك {{role}}.

يمكنك تسجيل الدخول من هنا:
{{loginLink}}`,
    bodyEn: `Hello {{name}},

We are excited to have you join us as a {{role}}.

You can login here:
{{loginLink}}`,
    variables: JSON.stringify(['name', 'role', 'loginLink']),
  },
  {
    slug: 'two_factor_auth',
    channel: Channel.EMAIL, // Can be both later
    nameAr: 'رمز التحقق الثنائي',
    nameEn: 'Two-Factor Authentication',
    subjectAr: '🔐 رمز التحقق الخاص بك',
    subjectEn: '🔐 Your Verification Code',
    bodyAr: `مرحباً {{name}}،

رمز التحقق الخاص بك هو: {{code}}

صلاحية الرمز: {{expiresIn}}`,
    bodyEn: `Hello {{name}},

Your verification code is: {{code}}

Expires in: {{expiresIn}}`,
    variables: JSON.stringify(['name', 'code', 'expiresIn']),
  },
  {
    slug: 'email_verification',
    channel: Channel.EMAIL,
    nameAr: 'تأكيد البريد الإلكتروني',
    nameEn: 'Email Verification',
    subjectAr: '✉️ يرجى تأكيد بريدك الإلكتروني',
    subjectEn: '✉️ Please verify your email',
    bodyAr: `مرحباً {{name}}،

يرجى النقر على الرابط أدناه لتأكيد بريدك الإلكتروني:
{{verificationLink}}

الرابط صالح لمدة {{expiresIn}}.`,
    bodyEn: `Hello {{name}},

Please click the link below to verify your email:
{{verificationLink}}

Link expires in {{expiresIn}}.`,
    variables: JSON.stringify(['name', 'verificationLink', 'expiresIn']),
  },
  {
    slug: 'admin_notification',
    channel: Channel.BOTH,
    nameAr: 'تنبيه إداري',
    nameEn: 'Admin Notification',
    subjectAr: '📢 تنبيه إداري: {{title}}',
    subjectEn: '📢 Admin Alert: {{title}}',
    bodyAr: `مرحباً {{adminName}}،

لديك تنبيه جديد:
{{message}}

لمزيد من التفاصيل:
{{actionUrl}}`,
    bodyEn: `Hello {{adminName}},

You have a new alert:
{{message}}

For more details:
{{actionUrl}}`,
    variables: JSON.stringify(['adminName', 'title', 'message', 'actionUrl']),
  },
];

async function main() {
  console.log('🌱 Starting Message Templates Seeding...');

  for (const template of TEMPLATES) {
    await prisma.messageTemplate.upsert({
      where: { slug: template.slug },
      update: {
        // Only update basic fields, preserve body edits if any?
        // For now, let's update everything to ensure seed consistency
        nameAr: template.nameAr,
        nameEn: template.nameEn,
        channel: template.channel,
        subjectAr: template.subjectAr,
        subjectEn: template.subjectEn,
        bodyAr: template.bodyAr,
        bodyEn: template.bodyEn,
        variables: template.variables,
        isSystem: true,
      },
      create: {
        ...template,
        isSystem: true,
      },
    });
    console.log(`  ✓ Seeded template: ${template.slug}`);
  }

  console.log('✅ Message Templates Seeding Completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
