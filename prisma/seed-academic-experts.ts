/**
 * Academic Experts Seed Script — Bilingual (Arabic + English)
 *
 * Creates sample academic expert profiles for the EBIC platform.
 * Safe to run multiple times (uses upsert on fullName field).
 *
 * Usage:
 *   bun run seed:experts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const db = new PrismaClient({ adapter, log: ['error'] });

interface ExpertSeed {
  fullName: string;
  fullNameEn: string;
  title: string;
  titleEn: string;
  specialization: string;
  specializationEn: string;
  university: string;
  universityEn: string;
  bio: string;
  bioEn: string;
  email: string;
  order: number;
  isActive: boolean;
}

const experts: ExpertSeed[] = [
  {
    fullName: 'د. أحمد محمد الطاهر',
    fullNameEn: 'Dr. Ahmed Mohamed Al-Taher',
    title: 'أستاذ مشارك',
    titleEn: 'Associate Professor',
    specialization: 'هندسة التصنيع والإنتاج',
    specializationEn: 'Manufacturing & Production Engineering',
    university: 'كلية التقنية الصناعية - مصراتة',
    universityEn: 'College of Industrial Technology - Misrata',
    bio: 'خبير في مجال هندسة التصنيع والإنتاج مع أكثر من 15 عاماً من الخبرة في تطوير العمليات الصناعية وتحسين جودة المنتجات. ساهم في العديد من المشاريع البحثية المتعلقة بالتصنيع المتقدم والأتمتة الصناعية.',
    bioEn: 'Expert in manufacturing and production engineering with over 15 years of experience in developing industrial processes and improving product quality. Has contributed to numerous research projects related to advanced manufacturing and industrial automation.',
    email: 'a.altaher@cit.edu.ly',
    order: 1,
    isActive: true,
  },
  {
    fullName: 'د. فاطمة علي بن سعيد',
    fullNameEn: 'Dr. Fatima Ali Ben Said',
    title: 'أستاذ مساعد',
    titleEn: 'Assistant Professor',
    specialization: 'الطاقة المتجددة والاستدامة',
    specializationEn: 'Renewable Energy & Sustainability',
    university: 'كلية التقنية الصناعية - مصراتة',
    universityEn: 'College of Industrial Technology - Misrata',
    bio: 'باحثة متخصصة في مجال الطاقة المتجددة والاستدامة البيئية. تركز أبحاثها على تطبيقات الطاقة الشمسية في البيئة الصناعية وتطوير حلول مستدامة للمنشآت الصناعية الصغيرة والمتوسطة.',
    bioEn: 'Researcher specializing in renewable energy and environmental sustainability. Her research focuses on solar energy applications in industrial environments and developing sustainable solutions for small and medium industrial facilities.',
    email: 'f.bensaid@cit.edu.ly',
    order: 2,
    isActive: true,
  },
  {
    fullName: 'د. محمد سالم العريبي',
    fullNameEn: 'Dr. Mohamed Salem Al-Aribi',
    title: 'أستاذ',
    titleEn: 'Professor',
    specialization: 'الهندسة الكهربائية والتحكم',
    specializationEn: 'Electrical Engineering & Control Systems',
    university: 'كلية التقنية الصناعية - مصراتة',
    universityEn: 'College of Industrial Technology - Misrata',
    bio: 'أستاذ متمرس في الهندسة الكهربائية وأنظمة التحكم الآلي مع خبرة تمتد لأكثر من 20 عاماً في التدريس والبحث العلمي. قاد مشاريع بحثية متعددة في مجال الأتمتة الصناعية وأنظمة التحكم الذكية.',
    bioEn: 'Seasoned professor of electrical engineering and automatic control systems with over 20 years of experience in teaching and scientific research. Has led multiple research projects in industrial automation and intelligent control systems.',
    email: 'm.alaribi@cit.edu.ly',
    order: 3,
    isActive: true,
  },
  {
    fullName: 'د. خالد عبدالسلام الزروق',
    fullNameEn: 'Dr. Khaled Abdulsalam Al-Zarrouk',
    title: 'أستاذ مشارك',
    titleEn: 'Associate Professor',
    specialization: 'تكنولوجيا المعلومات وريادة الأعمال',
    specializationEn: 'Information Technology & Entrepreneurship',
    university: 'كلية التقنية الصناعية - مصراتة',
    universityEn: 'College of Industrial Technology - Misrata',
    bio: 'خبير في تكنولوجيا المعلومات وريادة الأعمال التقنية. يعمل على ربط البحث الأكاديمي بالتطبيقات الصناعية وتأهيل الطلاب لسوق العمل من خلال برامج التدريب والإرشاد في مجال ريادة الأعمال.',
    bioEn: 'Expert in information technology and tech entrepreneurship. Works on connecting academic research with industrial applications and preparing students for the job market through training and mentorship programs in entrepreneurship.',
    email: 'k.alzarrouk@cit.edu.ly',
    order: 4,
    isActive: true,
  },
  {
    fullName: 'د. نورية حسن المصراتي',
    fullNameEn: 'Dr. Nouriya Hassan Al-Misrati',
    title: 'أستاذ مساعد',
    titleEn: 'Assistant Professor',
    specialization: 'الصناعات الكيميائية والبيئة',
    specializationEn: 'Chemical Industries & Environment',
    university: 'كلية التقنية الصناعية - مصراتة',
    universityEn: 'College of Industrial Technology - Misrata',
    bio: 'متخصصة في الصناعات الكيميائية وحماية البيئة الصناعية. تعمل على تطوير حلول صديقة للبيئة في القطاع الصناعي وتقديم الاستشارات للمصانع المحلية في مجال الامتثال البيئي والسلامة الصناعية.',
    bioEn: 'Specialist in chemical industries and industrial environmental protection. Works on developing environmentally friendly solutions in the industrial sector and providing consultancy to local factories on environmental compliance and industrial safety.',
    email: 'n.almisrati@cit.edu.ly',
    order: 5,
    isActive: true,
  },
];

async function seedAcademicExperts() {
  console.log('🔄 Seeding Academic Experts...');

  let created = 0;
  let updated = 0;

  for (const expert of experts) {
    // Use the Arabic fullName as the unique key for upsert
    const existing = await db.academicExpert.findFirst({
      where: { fullName: expert.fullName },
    });

    if (existing) {
      await db.academicExpert.update({
        where: { id: existing.id },
        data: expert,
      });
      updated++;
    } else {
      await db.academicExpert.create({ data: expert });
      created++;
    }
  }

  console.log(
    `✅ Academic Experts seeded: ${created} created, ${updated} updated (${experts.length} total)`,
  );
}

seedAcademicExperts()
  .catch((e) => {
    console.error('❌ Academic Experts seed failed:', e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
