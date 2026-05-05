import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { createPool } from 'mariadb';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the environment variables.');
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const seedData = [
  // Page: `about` — section: `hero` (1 record)
  {
    page: 'about',
    section: 'hero',
    order: 0,
    titleAr: 'مركز الريادة والحاضنات والتطوير التقني',
    titleEn: 'Entrepreneurship, Business Incubators & Technical Development Center',
    contentAr: 'مركز متخصص يهدف إلى دعم الابتكار وريادة الأعمال وتطوير الحلول التقنية، من خلال توفير بيئة احتضان متكاملة تصير الأفكار إلى مشاريع ناجحة.',
    contentEn: 'A specialized center aimed at supporting innovation, entrepreneurship, and technical solutions development through an integrated incubation environment that transforms ideas into successful projects.',
  },
  // Page: `about` — section: `platform` (1 record)
  {
    page: 'about',
    section: 'platform',
    order: 0,
    titleAr: 'تعريف المنصة',
    titleEn: 'About the Platform',
    contentAr: 'منصة تكاملية تجمع بين المؤسسات الأكاديمية والصناعية بهدف ردم الهوة بينهما، وبناء جسور التعاون لأجل غداً صناعي أفضل.',
    contentEn: 'An integrative platform that brings together academic and industrial institutions to bridge the gap between them and build cooperation bridges for a better industrial future.',
  },
  // Page: `about` — section: `goals` (5 records, order 0–4)
  {
    page: 'about',
    section: 'goals',
    order: 0,
    icon: 'Lightbulb',
    titleAr: 'تعزيز ثقافة الريادة والابتكار',
    titleEn: 'Promote Entrepreneurship & Innovation Culture',
  },
  {
    page: 'about',
    section: 'goals',
    order: 1,
    icon: 'Users',
    titleAr: 'دعم الطلبة والخريجين وأفراد المجتمع',
    titleEn: 'Support Students, Graduates & Community',
  },
  {
    page: 'about',
    section: 'goals',
    order: 2,
    icon: 'Rocket',
    titleAr: 'احتضان وتطوير المشاريع الناشئة',
    titleEn: 'Incubate & Develop Startups',
  },
  {
    page: 'about',
    section: 'goals',
    order: 3,
    icon: 'TrendingUp',
    titleAr: 'الإسهام في التنمية الاقتصادية ونقل المعرفة',
    titleEn: 'Contribute to Economic Development & Knowledge Transfer',
  },
  {
    page: 'about',
    section: 'goals',
    order: 4,
    icon: 'Link2',
    titleAr: 'بناء شراكات فاعلة',
    titleEn: 'Build Effective Partnerships',
  },
  // Page: `entrepreneurship` — section: `goals` (6 records, order 0–5)
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 0,
    icon: 'Megaphone',
    titleAr: 'نشر الوعي حول ريادة الأعمال وثقافة العمل الحر وتشجيع الابتكار والتطوير',
    titleEn: 'Spread awareness about entrepreneurship, self-employment culture and encourage innovation',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 1,
    icon: 'Brain',
    titleAr: 'تنمية التفكير الريادي لدى منتسبي الكلية والمجتمع',
    titleEn: 'Develop entrepreneurial thinking among college members and the community',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 2,
    icon: 'Lightbulb',
    titleAr: 'استقطاب ذوي الأفكار الريادية وتحويل أفكارهم إلى مشاريع',
    titleEn: 'Attract entrepreneurial thinkers and transform ideas into projects',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 3,
    icon: 'GraduationCap',
    titleAr: 'متابعة وتقييم الشركات الناشئة للخرجين وخدمات ما بعد التخرج',
    titleEn: 'Follow up on graduate startups and provide post-graduation services',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 4,
    icon: 'Star',
    titleAr: 'تشجيع ثقافة الإبداع والتميز والتمكين الاقتصادي',
    titleEn: 'Encourage creativity, excellence, and economic empowerment',
  },
  {
    page: 'entrepreneurship',
    section: 'goals',
    order: 5,
    icon: 'FlaskConical',
    titleAr: 'البحث عن البحوث العلمية وتحويلها إلى منتجات أو خدمات',
    titleEn: 'Find scientific research and transform it into products or services',
  },
  // Page: `incubators` — section: `tasks` (5 records, order 0–4)
  {
    page: 'incubators',
    section: 'tasks',
    order: 0,
    icon: 'Building2',
    titleAr: 'احتضان المشاريع حسب لائحة دليل الإجراءات المعتمدة',
    titleEn: 'Incubate projects according to the approved procedures guide',
  },
  {
    page: 'incubators',
    section: 'tasks',
    order: 1,
    icon: 'MessageSquare',
    titleAr: 'تقديم خدمات التوجيه والتدريب والاستشارات الفنية والتقنية والمالية',
    titleEn: 'Provide guidance, training, and technical, financial, and legal consulting',
  },
  {
    page: 'incubators',
    section: 'tasks',
    order: 2,
    icon: 'DollarSign',
    titleAr: 'تنفيذ الامتيازات والمنح والبرامج التمويلية',
    titleEn: 'Implement grants and funding programs from the Ministry of Industry',
  },
  {
    page: 'incubators',
    section: 'tasks',
    order: 3,
    icon: 'BarChart3',
    titleAr: 'المساعدة في إعداد دراسات الجدوى الاقتصادية',
    titleEn: 'Assist in preparing economic feasibility studies',
  },
  {
    page: 'incubators',
    section: 'tasks',
    order: 4,
    icon: 'Factory',
    titleAr: 'احتضان مشروعات تطوير المصانع القائمة ومعالجة صعوباتها',
    titleEn: 'Incubate factory development projects and resolve their difficulties',
  }
];

export async function seedPageContent() {
  console.log('🌱 Starting seed for EBIC Page Content...');

  try {
    for (const item of seedData) {
      const existing = await prisma.pageContent.findFirst({
        where: {
          page: item.page,
          section: item.section,
          order: item.order,
        },
      });

      if (existing) {
        await prisma.pageContent.update({
          where: { id: existing.id },
          data: {
            titleAr: item.titleAr,
            titleEn: item.titleEn,
            contentAr: item.contentAr || null,
            contentEn: item.contentEn || null,
            icon: item.icon || null,
          },
        });
        console.log(`⏭️ Updated [${item.page} - ${item.section}] - ${item.titleEn}`);
      } else {
        await prisma.pageContent.create({
          data: {
            id: uuidv4(),
            page: item.page,
            section: item.section,
            order: item.order,
            titleAr: item.titleAr,
            titleEn: item.titleEn,
            contentAr: item.contentAr || null,
            contentEn: item.contentEn || null,
            icon: item.icon || null,
            isActive: true,
          },
        });
        console.log(`✅ Created [${item.page} - ${item.section}] - ${item.titleEn}`);
      }
    }
    console.log('✅ Seeding completed successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (process.env.NODE_ENV !== 'test') {
  seedPageContent()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
