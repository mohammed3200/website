// prisma/seed-news-latc.ts
// Seed: LATC Announcement for EBIC Platform
// Based on News model from schema.prisma (lines 214-247)
// Pattern follows prisma/seed.ts conventions (PrismaMariaDb adapter, upsert-by-slug)

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const LATC_NEWS_DATA = {
  title:
    'جائزة ليبيا للإبداع التقني — فرصتك لتحويل فكرتك إلى مشروع تقني معتمد',
  titleEn:
    'Libya Award for Technical Creativity (LATC) — Turn Your Innovation Into a Recognized Technical Project',
  slug: 'latc-libya-award-technical-creativity-2025',
  content: `<h2>ما هي جائزة LATC؟</h2>
<p>جائزة ليبيا للإبداع التقني هي محفل وطني سنوي تنظّمه كلية التقنية الصناعية بمصراتة، يهدف إلى اكتشاف وتمكين المبتكرين والمخترعين الليبيين في المجالات التقنية والصناعية. تمر المشاركات عبر ثلاث جولات تقييم صارمة وشفافة تنتهي بعروض حضورية أمام لجان متخصصة.</p>

<h2>لماذا تهمّك هذه الجائزة؟</h2>
<ul>
  <li><strong>اعتراف رسمي:</strong> تقدير مؤسسي يحفّز على مواصلة التطوير محليًا ودوليًا</li>
  <li><strong>بيئة تنافسية عادلة:</strong> معايير تقييم واضحة ومعلنة تعتمد على المنهجية العلمية</li>
  <li><strong>ربط بسوق العمل:</strong> تحويل الأفكار التقنية إلى نماذج قابلة للتطبيق داخل بيئة وطنية إنتاجية</li>
  <li><strong>شبكة دعم:</strong> رعاة من القطاع الخاص والبرنامج الوطني للمشروعات الصغيرة والمتوسطة</li>
  <li><strong>ورش تدريبية:</strong> ضمن الجولة الثالثة من المسابقة</li>
</ul>

<h2>من يمكنه المشاركة؟</h2>
<ul>
  <li>المبتكرون والمخترعون الليبيون (مقيمون داخل ليبيا أو خارجها)</li>
  <li>الأفراد والفرق البحثية</li>
  <li>طلاب الجامعات ومراكز البحث</li>
  <li>رواد الأعمال وأصحاب المشاريع الناشئة</li>
</ul>

<h2>القيمة لمجتمع EBIC:</h2>
<p>هذه الجائزة تمثل فرصة مباشرة لمنتسبي مركز الريادة وحاضنات الأعمال لعرض مشاريعهم التقنية على منصة وطنية، والحصول على تقدير رسمي يفتح آفاقًا جديدة للتعاون والتمويل.</p>

<h2>شروط أساسية:</h2>
<ul>
  <li>أن يكون المشروع أصليًا ولا ينتهك حقوق الملكية الفكرية</li>
  <li>أن يكون موجهًا لحل مشكلة تقنية واضحة</li>
  <li>الالتزام بالنزاهة والمصداقية في عرض البيانات والنتائج</li>
</ul>

<h2>للتقديم:</h2>
<p>
  <a href="https://forms.gle/6AN6szm6pjSqmuiJ8" target="_blank" rel="noopener noreferrer">التقديم على المسابقة</a><br/>
  <a href="https://latc.cit.edu.ly/templates/AwardCatalogue.pdf" target="_blank" rel="noopener noreferrer">دليل الجائزة (PDF)</a><br/>
  <a href="https://latc.cit.edu.ly/" target="_blank" rel="noopener noreferrer">الموقع الرسمي</a>
</p>`,

  contentEn: `<h2>What is LATC?</h2>
<p>The Libya Award for Technical Creativity is an annual national competition organized by the College of Industrial Technology in Misurata. It aims to discover and empower Libyan innovators and inventors across technical and industrial fields. Submissions undergo three rigorous and transparent evaluation rounds, culminating in live presentations before expert panels.</p>

<h2>Why Does It Matter?</h2>
<ul>
  <li><strong>Official Recognition:</strong> Institutional acknowledgment that opens doors locally and internationally</li>
  <li><strong>Fair Competition:</strong> Clear, published evaluation criteria based on scientific methodology</li>
  <li><strong>Market-Ready Innovation:</strong> Transforming technical ideas into applicable prototypes within a productive national environment</li>
  <li><strong>Support Network:</strong> Backed by private sector sponsors and the National SME Program</li>
  <li><strong>Training Workshops:</strong> Included in the third evaluation round</li>
</ul>

<h2>Who Can Apply?</h2>
<ul>
  <li>Libyan innovators and inventors (residents in Libya or abroad)</li>
  <li>Individuals and research teams</li>
  <li>University students and research centers</li>
  <li>Entrepreneurs and startup founders</li>
</ul>

<h2>Value for EBIC Community:</h2>
<p>This award offers EBIC center members a direct opportunity to showcase their technical projects on a national platform, gaining formal recognition that opens pathways for collaboration and funding.</p>

<h2>Apply Now:</h2>
<p>
  <a href="https://forms.gle/6AN6szm6pjSqmuiJ8" target="_blank" rel="noopener noreferrer">Submit Application</a><br/>
  <a href="https://latc.cit.edu.ly/templates/AwardCatalogue.pdf" target="_blank" rel="noopener noreferrer">Award Catalogue (PDF)</a><br/>
  <a href="https://latc.cit.edu.ly/" target="_blank" rel="noopener noreferrer">Official Website</a>
</p>`,

  excerpt:
    'تُعلن كلية التقنية الصناعية – مصراتة عن فتح باب المشاركة في جائزة ليبيا للإبداع التقني (LATC)، وهي منصة وطنية تحتفي بالمبتكرين والمخترعين الليبيين.',
  excerptEn:
    'The College of Industrial Technology – Misurata announces the opening of applications for the Libya Award for Technical Creativity (LATC), a national platform celebrating Libyan innovators.',

  tags: 'LATC,جائزة,ابتكار,تقنية,مسابقة,ريادة أعمال,مصراتة,كلية التقنية',
  duration: null,

  isActive: true,
  isFeatured: true,

  metaTitle:
    'جائزة ليبيا للإبداع التقني LATC | مركز الريادة وحاضنات الأعمال',
  metaDescription:
    'شارك في جائزة ليبيا للإبداع التقني - منصة وطنية لتكريم المبتكرين والمخترعين الليبيين. فرصتك لتحويل فكرتك إلى مشروع تقني معتمد.',
};

async function seedLATCNews() {
  console.log('🌱 Seeding LATC news announcement...');

  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
  const prisma = new PrismaClient({
    adapter,
    log: ['error'],
  });

  try {
    const existing = await prisma.news.findFirst({
      where: { slug: LATC_NEWS_DATA.slug },
    });

    if (!existing) {
      const news = await prisma.news.create({
        data: {
          ...LATC_NEWS_DATA,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(
        `✅ Created LATC news: "${news.title}" (ID: ${news.id}, slug: ${news.slug})`,
      );
    } else {
      // Update existing record to ensure latest content
      const news = await prisma.news.update({
        where: { id: existing.id },
        data: {
          ...LATC_NEWS_DATA,
          updatedAt: new Date(),
        },
      });
      console.log(
        `⏭️  Updated existing LATC news: "${news.title}" (ID: ${news.id})`,
      );
    }
  } catch (error) {
    console.error('❌ Failed to seed LATC news:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Execute
if (process.env.NODE_ENV !== 'test') {
  seedLATCNews()
    .then(() => {
      console.log('\n✅ LATC news seeding completed successfully!');
      process.exit(0);
    })
    .catch((e) => {
      console.error('\n❌ LATC news seeding failed:', e);
      process.exit(1);
    });
}

export { seedLATCNews };
