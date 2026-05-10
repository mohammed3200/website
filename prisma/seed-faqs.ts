/**
 * FAQ Seed Script — Bilingual (Arabic + English)
 *
 * Creates professional FAQ entries for the EBIC platform.
 * Safe to run multiple times (uses upsert on question field).
 *
 * Schema: question (EN, required), answer (EN, required),
 *         questionAr (AR, optional), answerAr (AR, optional),
 *         category, order, isActive, isSticky
 *
 * Usage:
 *   bun run seed:faqs
 */

import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const db = new PrismaClient({ adapter, log: ['error'] });

interface FaqSeed {
  question: string;
  answer: string;
  questionAr: string;
  answerAr: string;
  category: string;
  order: number;
  isActive: boolean;
  isSticky: boolean;
}

const faqs: FaqSeed[] = [
  // ─── Registration & Account ───────────────────────────────
  {
    question: 'How can I register as a collaborating partner?',
    answer:
      'You can register as a collaborating partner by visiting the "Collaborating Partners" page and clicking the "Register Company" button. You will need to complete a four-step registration form that includes company information, industrial sector, company capabilities, and a review step before submission.',
    questionAr: 'كيف يمكنني التسجيل كشريك متعاون؟',
    answerAr:
      'يمكنك التسجيل كشريك متعاون من خلال زيارة صفحة "الشركات المتعاونة" والنقر على زر "تسجيل شركة". ستحتاج إلى تعبئة نموذج التسجيل المكون من أربع خطوات تشمل معلومات الشركة والقطاع الصناعي وإمكانيات الشركة ومراجعة البيانات قبل الإرسال.',
    category: 'registration',
    order: 1,
    isActive: true,
    isSticky: false,
  },
  {
    question: 'How can I register as an innovator or idea owner?',
    answer:
      'You can register through the "Creators and Innovators" page by clicking "Register Innovator". The form includes your personal information, project or idea details, and current development stage. You can also upload project files such as designs and presentations.',
    questionAr: 'كيف يمكنني التسجيل كمبتكر أو صاحب فكرة؟',
    answerAr:
      'يمكنك التسجيل من خلال صفحة "المبدعون والمبتكرون" والنقر على "تسجيل مبتكر". يتضمن النموذج معلوماتك الشخصية وتفاصيل مشروعك أو فكرتك ومرحلة التطوير الحالية. يمكنك أيضاً رفع ملفات مشروعك مثل التصاميم والعروض التقديمية.',
    category: 'registration',
    order: 2,
    isActive: true,
    isSticky: false,
  },
  {
    question: 'How long does it take to review my application?',
    answer:
      'Our team reviews all applications within 3 to 5 business days. You will receive an email notification once a decision has been made regarding your application, whether it is approved or additional information is requested.',
    questionAr: 'ما هي المدة المتوقعة لمراجعة طلبي؟',
    answerAr:
      'يقوم فريقنا بمراجعة جميع الطلبات خلال 3 إلى 5 أيام عمل. ستتلقى إشعاراً عبر البريد الإلكتروني بمجرد اتخاذ القرار بشأن طلبك سواء بالقبول أو بطلب معلومات إضافية.',
    category: 'registration',
    order: 3,
    isActive: true,
    isSticky: false,
  },
  {
    question: 'Can I modify my registration data after submission?',
    answer:
      'Currently, data cannot be modified directly after submission. If you need to update any information, please contact our support team via email or the "Contact Us" page and we will assist you.',
    questionAr: 'هل يمكنني تعديل بيانات التسجيل بعد الإرسال؟',
    answerAr:
      'حالياً، لا يمكن تعديل البيانات مباشرة بعد الإرسال. إذا كنت بحاجة لتحديث أي معلومات، يرجى التواصل مع فريق الدعم عبر البريد الإلكتروني أو صفحة "تواصل معنا" وسنقوم بمساعدتك.',
    category: 'registration',
    order: 4,
    isActive: true,
    isSticky: false,
  },

  // ─── Incubators & Projects ────────────────────────────────
  {
    question: 'What incubator programs are available?',
    answer:
      'The center provides a comprehensive business incubator program that goes through four phases: ideation and concept development, incubation and prototype development, growth and expansion, and launch and market entry. The program includes expert mentorship, co-working spaces, and access to funding.',
    questionAr: 'ما هي برامج الحاضنات المتاحة؟',
    answerAr:
      'يوفر المركز برنامج حاضنات أعمال متكامل يمر بأربع مراحل: مرحلة التفكير والتصور، مرحلة الاحتضان وتطوير النموذج الأولي، مرحلة النمو والتوسع، ومرحلة الإطلاق ودخول السوق. يشمل البرنامج الإرشاد من الخبراء ومساحات العمل المشتركة والوصول للتمويل.',
    category: 'incubators',
    order: 5,
    isActive: true,
    isSticky: false,
  },
  {
    question: 'What are the requirements for project acceptance into the incubator?',
    answer:
      'The project must be innovative and feasible, preferably in a technical or industrial field. Projects are evaluated based on several criteria including: level of innovation, economic viability, scalability, and expected impact on the community and local industry.',
    questionAr: 'ما هي شروط قبول المشاريع في الحاضنة؟',
    answerAr:
      'يجب أن يكون المشروع مبتكراً وقابلاً للتطبيق، ويفضل أن يكون في مجال تقني أو صناعي. يتم تقييم المشاريع بناءً على عدة معايير منها: مستوى الابتكار، الجدوى الاقتصادية، قابلية التوسع، والأثر المتوقع على المجتمع والصناعة المحلية.',
    category: 'incubators',
    order: 6,
    isActive: true,
    isSticky: false,
  },
  {
    question: 'What project development stages are available to choose from?',
    answer:
      'You can choose one of the following stages during registration: Idea Stage, Prototype, Under Development, Testing/Evaluation, or Ready for Launch. Choose the stage that accurately reflects the current status of your project.',
    questionAr: 'ما هي مراحل تطوير المشروع المتاحة للاختيار؟',
    answerAr:
      'يمكنك اختيار إحدى المراحل التالية عند التسجيل: مرحلة الفكرة، النموذج الأولي، قيد الإنشاء، مرحلة التقييم، أو جاهز للإطلاق. اختر المرحلة التي تعكس الوضع الحالي لمشروعك بدقة.',
    category: 'incubators',
    order: 7,
    isActive: true,
    isSticky: false,
  },

  // ─── Support & Communication ──────────────────────────────
  {
    question: 'How can I contact the center?',
    answer:
      'You can contact us through several channels: email, the phone number available on the "Contact Us" page, or by visiting the center\'s headquarters at the College of Industrial Technology in Misurata. Working hours: Sunday to Thursday from 8:00 AM to 3:00 PM.',
    questionAr: 'كيف يمكنني التواصل مع المركز؟',
    answerAr:
      'يمكنك التواصل معنا من خلال عدة قنوات: البريد الإلكتروني، رقم الهاتف المتوفر في صفحة "تواصل معنا"، أو بزيارة مقر المركز في كلية التقنية الصناعية بمصراتة. أوقات العمل: الأحد إلى الخميس من 8:00 صباحاً حتى 3:00 مساءً.',
    category: 'support',
    order: 8,
    isActive: true,
    isSticky: false,
  },
  {
    question: 'Will I receive notifications about my application status?',
    answer:
      'Yes, email notifications are sent when your application status changes. You will receive a confirmation message when the application is received, and another notification when your application is approved or if additional information is needed.',
    questionAr: 'هل يتم إرسال إشعارات بشأن حالة طلبي؟',
    answerAr:
      'نعم، يتم إرسال إشعارات عبر البريد الإلكتروني عند تغيير حالة طلبك. ستتلقى رسالة تأكيد عند استلام الطلب، وإشعار آخر عند الموافقة على طلبك أو في حالة الحاجة لمعلومات إضافية.',
    category: 'support',
    order: 9,
    isActive: true,
    isSticky: false,
  },

  // ─── General ──────────────────────────────────────────────
  {
    question: 'What is the Entrepreneurship and Business Incubators Center?',
    answer:
      'The Entrepreneurship and Business Incubators Center (EBIC) is an initiative of the College of Industrial Technology in Misurata, aimed at bridging academic excellence with industrial expertise. The center offers comprehensive programs to support entrepreneurs and innovators and provides an incubating environment for startups.',
    questionAr: 'ما هو مركز ريادة الأعمال وحاضنات الأعمال؟',
    answerAr:
      'مركز ريادة الأعمال وحاضنات الأعمال (EBIC) هو مبادرة تابعة لكلية التقنية الصناعية بمصراتة، تهدف إلى ربط التميز الأكاديمي بالخبرة الصناعية. يقدم المركز برامج شاملة لدعم رواد الأعمال والمبتكرين ويوفر بيئة حاضنة للمشاريع الناشئة.',
    category: 'general',
    order: 10,
    isActive: true,
    isSticky: true,
  },
  {
    question: 'Are the services provided free of charge?',
    answer:
      'Yes, all registration services and initial consultations are free of charge. The center aims to support the industrial and academic community and promote entrepreneurship and innovation culture in the region.',
    questionAr: 'هل الخدمات المقدمة مجانية؟',
    answerAr:
      'نعم، جميع خدمات التسجيل والاستشارات الأولية مجانية. المركز يهدف إلى دعم المجتمع الصناعي والأكاديمي وتعزيز ثقافة ريادة الأعمال والابتكار في المنطقة.',
    category: 'general',
    order: 11,
    isActive: true,
    isSticky: false,
  },
  {
    question: 'What industrial sectors are supported?',
    answer:
      'The center supports a wide range of industrial sectors including: iron manufacturing and maintenance, plastic and chemical industries, electrical manufacturing and maintenance, electronics, control systems, heavy industries, mining, food industries, telecommunications, technology, and renewable energy.',
    questionAr: 'ما هي القطاعات الصناعية المدعومة؟',
    answerAr:
      'يدعم المركز مجموعة واسعة من القطاعات الصناعية تشمل: تصنيع وصيانة الحديد، الصناعات البلاستيكية والكيميائية، تصنيع وصيانة الصناعات الكهربائية، الإلكترونيات، التحكم، الصناعات الثقيلة، التعدين، الصناعات الغذائية، الاتصالات، التكنولوجيا، والطاقة المتجددة.',
    category: 'general',
    order: 12,
    isActive: true,
    isSticky: false,
  },
];

async function seedFaqs() {
  console.log('🔄 Seeding FAQs...');

  let created = 0;
  let updated = 0;

  for (const faq of faqs) {
    // Use the English question as the unique key for upsert
    const existing = await db.fAQ.findFirst({
      where: { question: faq.question },
    });

    if (existing) {
      await db.fAQ.update({
        where: { id: existing.id },
        data: faq,
      });
      updated++;
    } else {
      await db.fAQ.create({ data: faq });
      created++;
    }
  }

  console.log(`✅ FAQs seeded: ${created} created, ${updated} updated (${faqs.length} total)`);
}

seedFaqs()
  .catch((e) => {
    console.error('❌ FAQ seed failed:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
