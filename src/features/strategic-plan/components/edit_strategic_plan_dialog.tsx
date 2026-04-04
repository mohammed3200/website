'use client';

import { useState, useEffect } from 'react';
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
import { usePatchStrategicPlan } from '@/features/strategic-plan/api';
import { UpdateStrategicPlanInput } from '@/features/strategic-plan/schemas/strategic-plan-schema';
import { cn } from '@/lib/utils';

interface EditStrategicPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: any;
}

export function EditStrategicPlanDialog({
  open,
  onOpenChange,
  plan,
}: EditStrategicPlanDialogProps) {
  const [formData, setFormData] = useState<UpdateStrategicPlanInput>({
    title: '',
    titleAr: null,
    slug: '',
    content: '',
    contentAr: null,
    excerpt: null,
    excerptAr: null,
    category: null,
    categoryAr: null,
    isActive: true,
    publishedAt: null,
    startDate: null,
    endDate: null,
    imageId: null,
    metaTitle: null,
    metaDescription: null,
  });

  const [activeTab, setActiveTab] = useState<'en' | 'ar'>('en');
  const mutation = usePatchStrategicPlan();

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title || '',
        titleAr: plan.titleAr || null,
        slug: plan.slug || '',
        content: plan.content || '',
        contentAr: plan.contentAr || null,
        excerpt: plan.excerpt || null,
        excerptAr: plan.excerptAr || null,
        category: plan.category || null,
        categoryAr: plan.categoryAr || null,
        isActive: plan.isActive ?? true,
        publishedAt: plan.publishedAt
          ? new Date(plan.publishedAt).toISOString()
          : null,
        startDate: plan.startDate
          ? new Date(plan.startDate).toISOString()
          : null,
        endDate: plan.endDate ? new Date(plan.endDate).toISOString() : null,
        imageId: plan.imageId || null,
        metaTitle: plan.metaTitle || null,
        metaDescription: plan.metaDescription || null,
      });
    }
  }, [plan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      {
        param: { id: plan.id },
        json: formData,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Strategic Plan</DialogTitle>
          <DialogDescription>
            Update both English and Arabic content for this strategic plan.
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
                <Label htmlFor="edit-title">Title (EN) *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Enter the strategic plan title in English"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-excerpt">Excerpt (EN)</Label>
                <Input
                  id="edit-excerpt"
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
                <Label htmlFor="edit-content">Content (EN) *</Label>
                <Textarea
                  id="edit-content"
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
                <Label htmlFor="edit-category">Category (EN)</Label>
                <Input
                  id="edit-category"
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
                <Label htmlFor="edit-titleAr">العنوان (عربي)</Label>
                <Input
                  id="edit-titleAr"
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
                <Label htmlFor="edit-excerptAr">المقتطف (عربي)</Label>
                <Input
                  id="edit-excerptAr"
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
                <Label htmlFor="edit-contentAr">المحتوى (عربي)</Label>
                <Textarea
                  id="edit-contentAr"
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
                <Label htmlFor="edit-categoryAr">التصنيف (عربي)</Label>
                <Input
                  id="edit-categoryAr"
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
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
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
              {mutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
