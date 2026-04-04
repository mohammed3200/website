'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePostStrategicPlan } from '@/features/strategic-plan/api';
import { CreateStrategicPlanInput } from '@/features/strategic-plan/schemas/strategic-plan-schema';
import { generateSlug } from '@/features/strategic-plan/utils/slug';
import { cn } from '@/lib/utils';

interface CreateStrategicPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INITIAL_FORM_DATA: CreateStrategicPlanInput = {
  title: '',
  titleAr: '',
  slug: '',
  content: '',
  contentAr: '',
  excerpt: '',
  excerptAr: '',
  category: '',
  categoryAr: '',
  isActive: true,
  publishedAt: null,
  startDate: null,
  endDate: null,
  imageId: null,
  metaTitle: null,
  metaDescription: null,
};

export function CreateStrategicPlanDialog({
  open,
  onOpenChange,
}: CreateStrategicPlanDialogProps) {
  const [formData, setFormData] =
    useState<CreateStrategicPlanInput>(INITIAL_FORM_DATA);
  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);

  const mutation = usePostStrategicPlan();

  // Auto-generate slug from English title (language-neutral)
  const generatedSlug = useMemo(() => {
    if (!formData.title || !autoGenerateSlug) return '';
    return generateSlug(formData.title);
  }, [formData.title, autoGenerateSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      slug: autoGenerateSlug ? generatedSlug : formData.slug,
    };

    mutation.mutate(
      { json: submitData },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFormData(INITIAL_FORM_DATA);
          setAutoGenerateSlug(true);
          setActiveTab('en');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Strategic Plan</DialogTitle>
          <DialogDescription>
            Create a new strategic plan with both English and Arabic content in
            a single record.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Language Tab Switcher */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === 'en'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ar')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === 'ar'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700',
              )}
            >
              العربية
            </button>
          </div>

          {/* English Content */}
          {activeTab === 'en' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">English Content</h3>

              <div className="space-y-2">
                <Label htmlFor="title">Title (EN) *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Enter the strategic plan title in English"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (EN)</Label>
                <Input
                  id="excerpt"
                  value={formData.excerpt || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      excerpt: e.target.value || null,
                    })
                  }
                  placeholder="Short description or caption in English"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content (EN) *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={10}
                  required
                  placeholder="Enter the full strategic plan content in English"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category (EN)</Label>
                <Input
                  id="category"
                  value={formData.category || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value || null,
                    })
                  }
                  placeholder="e.g., Annual, 5-Year"
                />
              </div>
            </div>
          )}

          {/* Arabic Content */}
          {activeTab === 'ar' && (
            <div className="space-y-4" dir="rtl">
              <h3 className="font-semibold text-lg">المحتوى العربي</h3>

              <div className="space-y-2">
                <Label htmlFor="titleAr">العنوان (عربي)</Label>
                <Input
                  id="titleAr"
                  value={formData.titleAr || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      titleAr: e.target.value || null,
                    })
                  }
                  placeholder="أدخل عنوان الخطة الاستراتيجية بالعربية"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerptAr">المقتطف (عربي)</Label>
                <Input
                  id="excerptAr"
                  value={formData.excerptAr || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      excerptAr: e.target.value || null,
                    })
                  }
                  placeholder="وصف مختصر أو تعليق بالعربية"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contentAr">المحتوى (عربي)</Label>
                <Textarea
                  id="contentAr"
                  value={formData.contentAr || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contentAr: e.target.value || null,
                    })
                  }
                  rows={10}
                  placeholder="أدخل محتوى الخطة الاستراتيجية الكامل بالعربية"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryAr">التصنيف (عربي)</Label>
                <Input
                  id="categoryAr"
                  value={formData.categoryAr || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryAr: e.target.value || null,
                    })
                  }
                  placeholder="مثال: سنوي، خمس سنوات"
                />
              </div>
            </div>
          )}

          {/* Shared Fields (language-neutral) */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Settings</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="slug">Slug *</Label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoGenerateSlug}
                    onChange={(e) => {
                      setAutoGenerateSlug(e.target.checked);
                      if (e.target.checked && formData.title) {
                        setFormData((prev) => ({
                          ...prev,
                          slug: generateSlug(formData.title),
                        }));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span>Auto-generate from English title</span>
                </label>
              </div>
              <Input
                id="slug"
                value={autoGenerateSlug ? generatedSlug : formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                disabled={autoGenerateSlug}
                required
                placeholder="url-friendly-slug"
                pattern="^[a-z0-9-]+$"
              />
              <p className="text-xs text-gray-500">
                URL-friendly identifier (lowercase letters, numbers, and hyphens
                only)
              </p>
            </div>

            <div className="space-y-2 flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span>Active</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
