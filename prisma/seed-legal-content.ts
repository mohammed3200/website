/**
 * Legal Content Seed Script — Bilingual (Arabic + English)
 *
 * Seeds default Terms of Use and Privacy Policy content.
 * Safe to run multiple times (uses upsert on type+locale composite key).
 *
 * Usage:
 *   bun run seed:legal
 */

import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const db = new PrismaClient({ adapter, log: ['error'] });

interface LegalContentSeed {
  type: 'terms' | 'privacy';
  locale: 'ar' | 'en';
  title: string;
  content: string;
}

const legalContent: LegalContentSeed[] = [
  // ─── Terms of Use ─────────────────────────────────────────
  {
    type: 'terms',
    locale: 'en',
    title: 'Terms of Use',
    content: `<h2>1. Acceptance of Terms</h2>
<p>By accessing and using the Entrepreneurship and Business Incubators Center (EBIC) platform, you agree to comply with and be bound by these Terms of Use. If you do not agree to these terms, please do not use this platform.</p>

<h2>2. Platform Purpose</h2>
<p>This platform is operated by the Center for Entrepreneurship and Business Incubators at the College of Industrial Technology — Misurata. It serves as a digital hub for managing collaborator registrations, innovator project submissions, and related services.</p>

<h2>3. User Responsibilities</h2>
<ul>
<li>Provide accurate and truthful information during registration</li>
<li>Maintain the confidentiality of your account credentials</li>
<li>Use the platform only for its intended purposes</li>
<li>Comply with all applicable local and national laws</li>
<li>Respect the intellectual property rights of others</li>
</ul>

<h2>4. Registration and Submissions</h2>
<p>All registrations and project submissions are subject to review by our team. Submission of an application does not guarantee acceptance. The center reserves the right to approve, reject, or request additional information for any application.</p>

<h2>5. Intellectual Property</h2>
<p>All content, designs, and materials on this platform are the property of EBIC. Users retain ownership of their submitted project ideas and documents. By submitting, you grant EBIC the right to review and evaluate your materials for the purpose of program consideration.</p>

<h2>6. Data Protection</h2>
<p>We are committed to protecting your personal data. Please refer to our Privacy Policy for detailed information on how we collect, use, and protect your data.</p>

<h2>7. Limitation of Liability</h2>
<p>EBIC shall not be liable for any indirect, incidental, or consequential damages arising from the use of this platform. The platform is provided "as is" without warranties of any kind.</p>

<h2>8. Modifications</h2>
<p>EBIC reserves the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting on this page. Continued use of the platform constitutes acceptance of the modified terms.</p>

<h2>9. Contact</h2>
<p>For questions about these Terms of Use, please contact us through the "Contact Us" page on our platform.</p>`,
  },
  {
    type: 'terms',
    locale: 'ar',
    title: 'شروط الاستخدام',
    content: `<h2>1. قبول الشروط</h2>
<p>باستخدامك لمنصة مركز ريادة الأعمال وحاضنات الأعمال (EBIC)، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام المنصة.</p>

<h2>2. الغرض من المنصة</h2>
<p>تُدار هذه المنصة من قبل مركز ريادة الأعمال وحاضنات الأعمال في كلية التقنية الصناعية — مصراتة. وتعمل كمنصة رقمية لإدارة تسجيل الشركاء المتعاونين وطلبات المبتكرين والخدمات ذات الصلة.</p>

<h2>3. مسؤوليات المستخدم</h2>
<ul>
<li>تقديم معلومات دقيقة وصحيحة أثناء التسجيل</li>
<li>الحفاظ على سرية بيانات حسابك</li>
<li>استخدام المنصة فقط للأغراض المخصصة لها</li>
<li>الامتثال لجميع القوانين المحلية والوطنية المعمول بها</li>
<li>احترام حقوق الملكية الفكرية للآخرين</li>
</ul>

<h2>4. التسجيل والطلبات</h2>
<p>تخضع جميع التسجيلات وطلبات المشاريع لمراجعة فريقنا. تقديم الطلب لا يضمن القبول. يحتفظ المركز بحق الموافقة أو الرفض أو طلب معلومات إضافية لأي طلب.</p>

<h2>5. الملكية الفكرية</h2>
<p>جميع المحتويات والتصاميم والمواد في هذه المنصة هي ملك لمركز EBIC. يحتفظ المستخدمون بملكية أفكارهم ووثائق مشاريعهم المقدمة. بتقديم طلبك، فإنك تمنح المركز الحق في مراجعة وتقييم موادك لغرض النظر في البرنامج.</p>

<h2>6. حماية البيانات</h2>
<p>نحن ملتزمون بحماية بياناتك الشخصية. يرجى الرجوع إلى سياسة الخصوصية للحصول على معلومات تفصيلية حول كيفية جمعنا لبياناتك واستخدامها وحمايتها.</p>

<h2>7. حدود المسؤولية</h2>
<p>لا يتحمل المركز أي مسؤولية عن أي أضرار غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام هذه المنصة. يتم تقديم المنصة "كما هي" دون ضمانات من أي نوع.</p>

<h2>8. التعديلات</h2>
<p>يحتفظ المركز بحق تعديل شروط الاستخدام في أي وقت. تصبح التغييرات سارية فور نشرها على هذه الصفحة. يعتبر استمرار استخدام المنصة قبولاً بالشروط المعدلة.</p>

<h2>9. التواصل</h2>
<p>لأي استفسارات حول شروط الاستخدام، يرجى التواصل معنا من خلال صفحة "تواصل معنا" على المنصة.</p>`,
  },

  // ─── Privacy Policy ───────────────────────────────────────
  {
    type: 'privacy',
    locale: 'en',
    title: 'Privacy Policy',
    content: `<h2>1. Introduction</h2>
<p>The Entrepreneurship and Business Incubators Center (EBIC) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform.</p>

<h2>2. Information We Collect</h2>
<p>We collect the following types of information:</p>
<ul>
<li><strong>Registration Data:</strong> Company name, contact information (email, phone), location, and website</li>
<li><strong>Project Data:</strong> Project descriptions, objectives, development stage, and uploaded files</li>
<li><strong>Media Files:</strong> Images, documents, and other files uploaded during registration</li>
<li><strong>Usage Data:</strong> Browser type, access times, and pages viewed (collected automatically)</li>
</ul>

<h2>3. How We Use Your Information</h2>
<ul>
<li>Processing and evaluating your registration applications</li>
<li>Communicating with you about your application status</li>
<li>Improving our platform and services</li>
<li>Sending relevant notifications and updates</li>
<li>Generating anonymized statistical reports</li>
</ul>

<h2>4. Data Storage and Security</h2>
<p>Your data is stored securely using industry-standard encryption and security measures. We use secure cloud storage for uploaded files and encrypted database connections for all personal data. Access to personal data is restricted to authorized personnel only.</p>

<h2>5. Data Sharing</h2>
<p>We do not sell, trade, or otherwise transfer your personal information to outside parties. Your data may only be shared with:</p>
<ul>
<li>Authorized center staff for application review purposes</li>
<li>Third-party service providers essential to platform operation (hosting, email delivery), bound by confidentiality agreements</li>
</ul>

<h2>6. Your Rights</h2>
<p>You have the right to:</p>
<ul>
<li>Request access to your personal data</li>
<li>Request correction of inaccurate data</li>
<li>Request deletion of your data (subject to legal obligations)</li>
<li>Withdraw consent for data processing</li>
</ul>

<h2>7. Cookies</h2>
<p>We use essential cookies for authentication and session management. These cookies are necessary for the proper functioning of the platform and cannot be disabled.</p>

<h2>8. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify users of significant changes through the platform. The latest version will always be available on this page.</p>

<h2>9. Contact Us</h2>
<p>If you have questions about this Privacy Policy or your personal data, please contact us through the "Contact Us" page.</p>`,
  },
  {
    type: 'privacy',
    locale: 'ar',
    title: 'سياسة الخصوصية',
    content: `<h2>1. المقدمة</h2>
<p>يلتزم مركز ريادة الأعمال وحاضنات الأعمال (EBIC) بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمعنا لمعلوماتك الشخصية واستخدامها وحمايتها عند استخدام منصتنا.</p>

<h2>2. المعلومات التي نجمعها</h2>
<p>نقوم بجمع الأنواع التالية من المعلومات:</p>
<ul>
<li><strong>بيانات التسجيل:</strong> اسم الشركة، معلومات الاتصال (البريد الإلكتروني، الهاتف)، الموقع، والموقع الإلكتروني</li>
<li><strong>بيانات المشروع:</strong> وصف المشروع، الأهداف، مرحلة التطوير، والملفات المرفوعة</li>
<li><strong>ملفات الوسائط:</strong> الصور والمستندات والملفات الأخرى المرفوعة أثناء التسجيل</li>
<li><strong>بيانات الاستخدام:</strong> نوع المتصفح، أوقات الوصول، والصفحات المعروضة (يتم جمعها تلقائياً)</li>
</ul>

<h2>3. كيف نستخدم معلوماتك</h2>
<ul>
<li>معالجة وتقييم طلبات التسجيل الخاصة بك</li>
<li>التواصل معك بشأن حالة طلبك</li>
<li>تحسين منصتنا وخدماتنا</li>
<li>إرسال الإشعارات والتحديثات ذات الصلة</li>
<li>إعداد تقارير إحصائية مجهولة المصدر</li>
</ul>

<h2>4. تخزين البيانات وأمانها</h2>
<p>يتم تخزين بياناتك بشكل آمن باستخدام التشفير وإجراءات الأمان القياسية في الصناعة. نستخدم تخزيناً سحابياً آمناً للملفات المرفوعة واتصالات قاعدة بيانات مشفرة لجميع البيانات الشخصية. يقتصر الوصول إلى البيانات الشخصية على الموظفين المصرح لهم فقط.</p>

<h2>5. مشاركة البيانات</h2>
<p>لا نقوم ببيع أو تبادل أو نقل معلوماتك الشخصية إلى أطراف خارجية. يمكن مشاركة بياناتك فقط مع:</p>
<ul>
<li>موظفي المركز المصرح لهم لأغراض مراجعة الطلبات</li>
<li>مقدمي الخدمات الخارجيين الضروريين لتشغيل المنصة (الاستضافة، تسليم البريد الإلكتروني)، الملتزمين باتفاقيات السرية</li>
</ul>

<h2>6. حقوقك</h2>
<p>لديك الحق في:</p>
<ul>
<li>طلب الوصول إلى بياناتك الشخصية</li>
<li>طلب تصحيح البيانات غير الدقيقة</li>
<li>طلب حذف بياناتك (وفقاً للالتزامات القانونية)</li>
<li>سحب الموافقة على معالجة البيانات</li>
</ul>

<h2>7. ملفات تعريف الارتباط</h2>
<p>نستخدم ملفات تعريف الارتباط الأساسية للمصادقة وإدارة الجلسات. هذه الملفات ضرورية للتشغيل السليم للمنصة ولا يمكن تعطيلها.</p>

<h2>8. التغييرات على هذه السياسة</h2>
<p>قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطار المستخدمين بالتغييرات الجوهرية من خلال المنصة. ستكون أحدث نسخة متاحة دائماً على هذه الصفحة.</p>

<h2>9. تواصل معنا</h2>
<p>إذا كانت لديك أسئلة حول سياسة الخصوصية أو بياناتك الشخصية، يرجى التواصل معنا من خلال صفحة "تواصل معنا".</p>`,
  },
];

async function seedLegalContent() {
  console.log('🔄 Seeding legal content...');

  let created = 0;
  let updated = 0;

  for (const item of legalContent) {
    // Check if the record already exists to reliably count created vs updated
    const existing = await db.legalContent.findUnique({
      where: {
        type_locale: {
          type: item.type,
          locale: item.locale,
        },
      },
    });

    await db.legalContent.upsert({
      where: {
        type_locale: {
          type: item.type,
          locale: item.locale,
        },
      },
      update: {
        title: item.title,
        content: item.content,
      },
      create: item,
    });

    if (existing) {
      updated++;
    } else {
      created++;
    }
  }

  console.log(`✅ Legal content seeded: ${created} created, ${updated} updated (${legalContent.length} total)`);
}

seedLegalContent()
  .catch((e) => {
    console.error('❌ Legal content seed failed:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
