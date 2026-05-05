import { getTranslations } from 'next-intl/server';
import { getPageContent } from '@/features/page-content/server/route';
import { AboutHero } from '@/features/page-content/components/about-hero';
import { Lightbulb, Users, Rocket, TrendingUp, Link2 } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  Lightbulb: <Lightbulb className="h-8 w-8 text-primary" />,
  Users: <Users className="h-8 w-8 text-primary" />,
  Rocket: <Rocket className="h-8 w-8 text-primary" />,
  TrendingUp: <TrendingUp className="h-8 w-8 text-primary" />,
  Link2: <Link2 className="h-8 w-8 text-primary" />,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Navigation' });

  return {
    title: `${t('about')} | ${t('centerName')}`,
    description: t('aboutDesc'),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // @ts-ignore - The 'about' literal type will be added in a separate PR
  const content = await getPageContent('about');

  const heroContent = content.find((c) => c.section === 'hero');
  const platformContent = content.find((c) => c.section === 'platform');
  const goals = content.filter((c) => c.section === 'goals').sort((a, b) => a.order - b.order);

  const heroTitle = locale === 'ar' ? heroContent?.titleAr : heroContent?.titleEn;
  const heroText = locale === 'ar' ? heroContent?.contentAr : heroContent?.contentEn;
  
  const platformTitle = locale === 'ar' ? platformContent?.titleAr : platformContent?.titleEn;
  const platformText = locale === 'ar' ? platformContent?.contentAr : platformContent?.contentEn;

  return (
    <div className="flex flex-col min-h-screen">
      <AboutHero 
        title={heroTitle || 'About Us'} 
        content={heroText || 'Learn about our center and mission.'} 
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-16">
            <h2 className="text-3xl font-bold text-primary md:text-4xl">
              {platformTitle || 'About the Platform'}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {platformText || 'An integrative platform that brings together academic and industrial institutions.'}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const goalTitle = locale === 'ar' ? goal.titleAr : goal.titleEn;
              const IconComponent = goal.icon && iconMap[goal.icon] ? iconMap[goal.icon] : <Lightbulb className="h-8 w-8 text-primary" />;

              return (
                <div 
                  key={goal.id}
                  className="flex flex-col items-center text-center p-8 bg-card rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all"
                >
                  <div className="mb-6 p-4 bg-primary/10 rounded-full">
                    {IconComponent}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {goalTitle}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
