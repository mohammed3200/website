import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the environment variables.');
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

type SeedRecord = {
  page: 'about' | 'entrepreneurship' | 'incubators';
  section: string;
  order: number;
  icon?: string;
  titleAr: string;
  titleEn: string;
  contentAr?: string;
  contentEn?: string;
  isActive?: boolean;
};

// Source-of-truth content from the four official .docx files in /docs/source/
// AR strings are verbatim. EN strings are faithful translations of the AR.
const seedData: SeedRecord[] = [
  // about / hero  (D.1)
  {
    page: 'about',
    section: 'hero',
    order: 0,
    icon: 'Building2',
    titleAr: 'مركز الريادة والحاضنات والتطوير التقني - مصراتة',
    titleEn: 'Entrepreneurship, Incubators & Technical Development Center - Misrata',
    contentAr:
      'مركز متخصص يهدف إلى دعم الابتكار وريادة الأعمال وتطوير الحلول التقنية، من خلال توفير بيئة احتضان متكاملة تصير الأفكار إلى مشاريع ناجحة.',
    contentEn:
      'A specialized center that supports innovation, entrepreneurship, and the development of technical solutions by providing an integrated incubation environment that turns ideas into successful projects.',
  },
  // about / platform  (D.1)
  {
    page: 'about',
    section: 'platform',
    order: 0,
    icon: 'Network',
    titleAr: 'تعريف المنصة',
    titleEn: 'About the Platform',
    contentAr:
      'هي منصة تكاملية تجمع بين المؤسسات الأكاديمية والصناعية بهدف ردم الهوة بينهما، وبناء جسور التعاون لأجل غدٍ صناعي أفضل.',
    contentEn:
      'An integrative platform that brings academic and industrial institutions together to bridge the gap between them and build pathways of cooperation for a better industrial future.',
  },
  // about / goals  (D.2 — 5 records)
  {
    page: 'about',
    section: 'goals',
    order: 0,
    icon: 'Lightbulb',
    titleAr: 'تعزيز ثقافة الريادة والابتكار',
    titleEn: 'Promoting a culture of entrepreneurship and innovation',
    contentAr: 'تعزيز ثقافة الريادة والابتكار.',
    contentEn: 'Promoting a culture of entrepreneurship and innovation.',
  },
  {
    page: 'about',
    section: 'goals',
    order: 1,
    icon: 'Users',
    titleAr: 'دعم طلبة وخريجي الكلية وأفراد المجتمع',
    titleEn: 'Supporting students, graduates, and community members',
    contentAr:
      'دعم طلبة وخريجين الكلية وأفراد المجتمع في تأسيس مشاريعهم الريادية.',
    contentEn:
      'Supporting the college\'s students and graduates and community members in establishing their own entrepreneurial projects.',
  },
  {
    page: 'about',
    section: 'goals',
    order: 2,
    icon: 'Rocket',
    titleAr: 'احتضان وتطوير المشاريع الناشئة',
    titleEn: 'Incubating and developing startups',
    contentAr: 'احتضان وتطوير المشاريع الناشئة.',
    contentEn: 'Incubating and developing emerging startup projects.',
  },
  {
    page: 'about',
    section: 'goals',
    order: 3,
    icon: 'TrendingUp',
    titleAr: 'الإسهام في التنمية الاقتصادية ونقل المعرفة التقنية',
    titleEn: 'Contributing to economic development and technical knowledge transfer',
    contentAr: 'الإسهام في التنمية الاقتصادية ونقل المعرفة التقنية.',
    contentEn:
      'Contributing to economic development and the transfer of technical knowledge.',
  },
  {
    page: 'about',
    section: 'goals',
    order: 4,
    icon: 'Handshake',
    titleAr: 'بناء شراكات فاعلة',
    titleEn: 'Building active partnerships',
    contentAr:
      'بناء شراكات فاعلة مع المؤسسات الصناعية والبحثية بالقطاعين العام والخاص.',
    contentEn:
      'Building active partnerships with industrial and research institutions in both the public and private sectors.',
  },
  // about / news  (D.5 — 1 record, isActive: false until About page wires it)
  {
    page: 'about',
    section: 'news',
    order: 0,
    icon: 'Calendar',
    titleAr: 'حوارية تعريفية بالمركز',
    titleEn: 'Inaugural introductory session',
    contentAr:
      '20 جمادى الآخرة 1446 هـ — الموافق 21/12/2024 م. أقامت إدارة الكلية حوارية تعريفية بالمركز دعت لها العديد من المسؤولين وإدارات المؤسسات الحكومية، ومن بين الجهات المشاركة: هيئة النهوض بالصناعة الوطنية، صندوق التسهيلات المالية، البرنامج الوطني للمشروعات الصغرى والمتوسطة، الشركة الليبية للحديد والصلب، المجلس الوطني للتطوير الاقتصادي، مؤسسة خبراء فرنسا، مركز الطاقة الشمسية، الأكاديمية للاتصالات، كلية الهندسة - مصراته، الأكاديمية الليبية - مصراته، مركز الريادة والابتكار - جامعة غريان، الأكاديمية الرقمية، وشركة لابتك. ألقيت كلمات ترحيبية وتعريفية بالمركز سُلِّط الضوء فيها على أهدافه الاستراتيجية وآليات عمله، كما تم على هامش الحوارية توقيع اتفاقيتي تعاون مع الهيئة الوطنية للنهوض بالصناعة الوطنية ومركز الطاقة الشمسية.',
    contentEn:
      '20 Jumada al-Akhirah 1446 AH — corresponding to 21 December 2024. The college administration held an introductory dialogue session about the center, attended by officials from numerous government institutions: the National Authority for the Promotion of National Industry, the Financial Facilities Fund, the National Program for Small and Medium Enterprises, the Libyan Iron and Steel Company, the National Council for Economic Development, France Experts Foundation, the Solar Energy Center, the Telecommunications Academy, the Faculty of Engineering — Misrata, the Libyan Academy — Misrata, the Center for Entrepreneurship and Innovation — University of Gharyan, the Digital Academy, and Labtek. Welcoming and introductory speeches highlighted the center\'s strategic goals and operating mechanisms. On the sidelines of the session, two cooperation agreements were signed with the National Authority for the Promotion of National Industry and the Solar Energy Center.',
    isActive: false,
  },
  // entrepreneurship / goals  (D.3 — 6 records)
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 0,
    icon: 'Megaphone',
    titleAr: 'نشر الوعي الريادي',
    titleEn: 'Spreading entrepreneurial awareness',
    contentAr:
      'نشر الوعي حول مفهوم ريادة الأعمال وثقافة العمل الحر وتشجيع الابتكار والتطوير.',
    contentEn:
      'Spreading awareness of the concept of entrepreneurship and the culture of self-employment, and encouraging innovation and development.',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 1,
    icon: 'Brain',
    titleAr: 'تنمية التفكير الريادي',
    titleEn: 'Developing entrepreneurial thinking',
    contentAr:
      'تنمية التفكير الريادي لدى منتسبي الكلية والمجتمع وتأهيلهم لتعزيز قدراتهم التنافسية وتأسيس المشاريع الريادية.',
    contentEn:
      'Developing entrepreneurial thinking among the college\'s members and the community, and qualifying them to enhance their competitive abilities and establish entrepreneurial projects.',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 2,
    icon: 'Lightbulb',
    titleAr: 'استقطاب أصحاب الأفكار الريادية',
    titleEn: 'Attracting entrepreneurial talent',
    contentAr:
      'استقطاب ذوي الأفكار الريادية وتشجيعهم لتقديم أفكارهم لقسم الحاضنات لدعمهم وتحويل أفكارهم إلى مشاريع ذات قيمة معتبرة.',
    contentEn:
      'Attracting people with entrepreneurial ideas and encouraging them to submit their ideas to the Incubators Department to receive support and turn their ideas into projects of meaningful value.',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 3,
    icon: 'GraduationCap',
    titleAr: 'متابعة الشركات الناشئة للخريجين',
    titleEn: 'Following up on graduate startups',
    contentAr:
      'متابعة وتقييم الشركات الناشئة للخريجين وتقديم خدمات أعمال ما بعد التخرج.',
    contentEn:
      'Following up on and evaluating startups founded by graduates, and providing post-graduation business services.',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 4,
    icon: 'Sparkles',
    titleAr: 'تشجيع ثقافة الإبداع والتميز',
    titleEn: 'Encouraging a culture of creativity and excellence',
    contentAr:
      'تشجيع ثقافة الإبداع والتميز والابتكار وثقافة الانخراط في العمل الخاص والمساهمة في التمكين الاقتصادي خاصةً المرأة والشباب.',
    contentEn:
      'Encouraging a culture of creativity, excellence, and innovation, and a culture of entering self-employment, contributing to economic empowerment — especially of women and youth.',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 5,
    icon: 'FlaskConical',
    titleAr: 'تحويل البحوث العلمية إلى منتجات',
    titleEn: 'Converting scientific research into products',
    contentAr:
      'البحث عن البحوث العلمية القيّمة وتقديمها لقسم الحاضنات كمقترحات لمشاريع قابلة للتطبيق وتحويلها إلى منتجات أو خدمات قيّمة.',
    contentEn:
      'Identifying valuable scientific research and submitting it to the Incubators Department as proposals for applicable projects, and turning it into valuable products or services.',
  },
  // incubators / tasks  (D.4 — 5 records)
  {
    page: 'incubators',
    section: 'tasks',
    order: 0,
    icon: 'Building2',
    titleAr: 'احتضان المشاريع',
    titleEn: 'Project incubation',
    contentAr:
      'احتضان المشاريع حسب لائحة دليل الإجراءات التي يقترحها المركز والمعتمدة من إدارة الكلية.',
    contentEn:
      'Incubating projects in accordance with the procedures-manual regulations proposed by the center and approved by the college administration.',
  },
  {
    page: 'incubators',
    section: 'tasks',
    order: 1,
    icon: 'MessageSquare',
    titleAr: 'خدمات التوجيه والتدريب والاستشارات',
    titleEn: 'Guidance, training, and consulting services',
    contentAr:
      'تقديم خدمات التوجيه والتدريب والاستشارات الفنية والتقنية والمالية والتسويقية والقانونية للمشروعات المحتضنة.',
    contentEn:
      'Providing guidance, training, and consulting services — technical, technological, financial, marketing, and legal — to incubated projects.',
  },
  {
    page: 'incubators',
    section: 'tasks',
    order: 2,
    icon: 'DollarSign',
    titleAr: 'تنفيذ الامتيازات والمنح والبرامج التمويلية',
    titleEn: 'Implementing privileges, grants, and funding programs',
    contentAr:
      'العمل على تنفيذ الامتيازات والمنح والبرامج الفنية والتمويلية المقررة ضمن اختصاصات مكوّنات وزارة الصناعة والمعادن والقوانين والتشريعات النافذة للمشروعات المحتضنة بالمركز.',
    contentEn:
      'Implementing the privileges, grants, and technical and funding programs established within the remit of the Ministry of Industry and Mineral Resources and applicable laws and regulations, for projects incubated at the center.',
  },
  {
    page: 'incubators',
    section: 'tasks',
    order: 3,
    icon: 'BarChart3',
    titleAr: 'إعداد دراسات الجدوى الاقتصادية',
    titleEn: 'Preparing economic feasibility studies',
    contentAr: 'المساعدة في إعداد دراسات الجدوى الاقتصادية للمتقدمين للمركز.',
    contentEn:
      'Assisting in preparing economic feasibility studies for applicants to the center.',
  },
  {
    page: 'incubators',
    section: 'tasks',
    order: 4,
    icon: 'Factory',
    titleAr: 'تطوير المصانع القائمة',
    titleEn: 'Developing existing factories',
    contentAr:
      'احتضان مشروعات تطوير المصانع القائمة من حيث تطوير معداتها أو تطوير منتجاتها وحل الصعوبات التي تعترضها وغيرها من البرامج التأهيلية والتدريبية.',
    contentEn:
      'Incubating projects that develop existing factories — upgrading their equipment or products, solving the difficulties they face, and other qualification and training programs.',
  },
];

export async function seed(): Promise<void> {
  console.log('🌱 Starting seed for EBIC page content...');

  for (const item of seedData) {
    const existing = await prisma.pageContent.findFirst({
      where: {
        page: item.page,
        section: item.section,
        order: item.order,
      },
    });

    const data = {
      page: item.page,
      section: item.section,
      order: item.order,
      titleAr: item.titleAr,
      titleEn: item.titleEn,
      contentAr: item.contentAr ?? null,
      contentEn: item.contentEn ?? null,
      icon: item.icon ?? null,
      isActive: item.isActive ?? true,
    };

    if (existing) {
      await prisma.pageContent.update({
        where: { id: existing.id },
        data,
      });
      console.log(
        `↻ updated [${item.page}/${item.section}#${item.order}] ${item.titleEn}`,
      );
    } else {
      await prisma.pageContent.create({
        data: {
          id: uuidv4(),
          ...data,
        },
      });
      console.log(
        `+ created [${item.page}/${item.section}#${item.order}] ${item.titleEn}`,
      );
    }
  }

  console.log(`✅ Seeded ${seedData.length} EBIC page-content records.`);
}

if (process.env.NODE_ENV !== 'test') {
  seed()
    .catch((err) => {
      console.error('❌ Seed failed:', err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
