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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePatchStrategicPlan } from '@/features/strategic-plan/api';
import { UpdateStrategicPlanInput, PlanStatus } from '@/features/strategic-plan/schemas/strategic-plan-schema';
import { type StrategicPlanItem } from '@/components/strategic-plan';

interface EditStrategicPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: StrategicPlanItem;
}

const EMPTY_STATE: UpdateStrategicPlanInput = {
  title: '',
  titleAr: '',
  slug: '',
  content: '',
  contentAr: '',
  excerpt: null,
  excerptAr: null,
  category: null,
  categoryAr: null,
  status: 'DRAFT',
  isActive: true,
  publishedAt: null,
  startDate: null,
  endDate: null,
  imageId: null,
  metaTitle: null,
  metaDescription: null,
  phase: null,
  phaseAr: null,
};

export function EditStrategicPlanDialog({ open, onOpenChange, plan }: EditStrategicPlanDialogProps) {
  const [formData, setFormData] = useState<UpdateStrategicPlanInput>(EMPTY_STATE);
  const mutation = usePatchStrategicPlan();

  const updateField = <K extends keyof UpdateStrategicPlanInput>(
    key: K,
    value: UpdateStrategicPlanInput[K],
  ) => setFormData((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title || '',
        titleAr: plan.titleAr || '',
        slug: plan.slug || '',
        content: plan.content || '',
        contentAr: plan.contentAr || '',
        excerpt: plan.excerpt || null,
        excerptAr: plan.excerptAr || null,
        category: plan.category || null,
        categoryAr: plan.categoryAr || null,
        status: (plan.status as PlanStatus) || 'DRAFT',
        isActive: plan.isActive ?? true,
        publishedAt: plan.publishedAt ? new Date(plan.publishedAt).toISOString() : null,
        startDate: plan.startDate ? new Date(plan.startDate).toISOString() : null,
        endDate: plan.endDate ? new Date(plan.endDate).toISOString() : null,
        imageId: plan.imageId || null,
        metaTitle: plan.metaTitle || null,
        metaDescription: plan.metaDescription || null,
        phase: plan.phase || null,
        phaseAr: plan.phaseAr || null,
      });
    }
  }, [plan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Include all bilingual fields, phase/date fields, and metadata properties
    // that are supported by UpdateStrategicPlanInput and used by the create dialog
    const payload: Partial<UpdateStrategicPlanInput> = {
      title: formData.title,
      titleAr: formData.titleAr,
      slug: formData.slug,
      excerpt: formData.excerpt,
      excerptAr: formData.excerptAr,
      content: formData.content,
      contentAr: formData.contentAr,
      category: formData.category,
      categoryAr: formData.categoryAr,
      status: formData.status,
      isActive: formData.isActive,
      phase: formData.phase,
      phaseAr: formData.phaseAr,
      publishedAt: formData.publishedAt,
      startDate: formData.startDate,
      endDate: formData.endDate,
      imageId: formData.imageId,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
    };

    mutation.mutate(
      { param: { id: plan.id }, json: payload as UpdateStrategicPlanInput },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Strategic Plan</DialogTitle>
          <DialogDescription>Update the strategic plan information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base text-gray-900 border-b pb-2">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="edit-sp-title">Title (English) *</Label>
              <Input
                id="edit-sp-title"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                placeholder="Enter the strategic plan title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sp-slug">Slug *</Label>
              <Input
                id="edit-sp-slug"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                required
                placeholder="url-friendly-slug"
                pattern="^[a-z0-9-]+$"
              />
              <p className="text-xs text-amber-600">
                ⚠ Changing the slug will break existing links to this plan.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sp-excerpt">Excerpt</Label>
              <Input
                id="edit-sp-excerpt"
                value={formData.excerpt || ''}
                onChange={(e) => updateField('excerpt', e.target.value || null)}
                placeholder="Short description or caption"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sp-content">Content (English) *</Label>
              <Textarea
                id="edit-sp-content"
                value={formData.content}
                onChange={(e) => updateField('content', e.target.value)}
                rows={8}
                required
                placeholder="Enter the full strategic plan content"
              />
            </div>
          </div>

          {/* Arabic Information */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-base text-gray-900 pb-2">Arabic Content</h3>
            <div className="space-y-2">
              <Label htmlFor="edit-sp-title-ar">Title (Arabic)</Label>
              <Input
                id="edit-sp-title-ar"
                value={formData.titleAr || ''}
                onChange={(e) => updateField('titleAr', e.target.value)}
                placeholder="Enter title in Arabic"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sp-excerpt-ar">Excerpt (Arabic)</Label>
              <Input
                id="edit-sp-excerpt-ar"
                value={formData.excerptAr || ''}
                onChange={(e) => updateField('excerptAr', e.target.value)}
                placeholder="Short description in Arabic"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sp-content-ar">Content (Arabic)</Label>
              <Textarea
                id="edit-sp-content-ar"
                value={formData.contentAr || ''}
                onChange={(e) => updateField('contentAr', e.target.value)}
                rows={4}
                placeholder="Enter full content in Arabic"
                dir="rtl"
              />
            </div>
          </div>

          {/* Dates & Meta */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-base text-gray-900 pb-2">Dates & Extra</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sp-phase">Phase</Label>
                <Input
                  id="edit-sp-phase"
                  value={formData.phase || ''}
                  onChange={(e) => updateField('phase', e.target.value)}
                  placeholder="e.g., Execution"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sp-phase-ar">Phase (Arabic)</Label>
                <Input
                  id="edit-sp-phase-ar"
                  value={formData.phaseAr || ''}
                  onChange={(e) => updateField('phaseAr', e.target.value)}
                  placeholder="e.g., قيد التنفيذ"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sp-published-at">Published At</Label>
                <Input
                  type="datetime-local"
                  id="edit-sp-published-at"
                  value={formData.publishedAt ? new Date(formData.publishedAt).toISOString().slice(0, 16) : ''}
                  onChange={(e) => updateField('publishedAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sp-start-date">Start Date</Label>
                <Input
                  type="datetime-local"
                  id="edit-sp-start-date"
                  value={formData.startDate ? new Date(formData.startDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => updateField('startDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sp-end-date">End Date</Label>
                <Input
                  type="datetime-local"
                  id="edit-sp-end-date"
                  value={formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 16) : ''}
                  onChange={(e) => updateField('endDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sp-meta-title">Meta Title</Label>
                <Input
                  id="edit-sp-meta-title"
                  value={formData.metaTitle || ''}
                  onChange={(e) => updateField('metaTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sp-meta-desc">Meta Description</Label>
                <Input
                  id="edit-sp-meta-desc"
                  value={formData.metaDescription || ''}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-sp-image-id">Image ID / URL</Label>
              <Input
                id="edit-sp-image-id"
                value={formData.imageId || ''}
                onChange={(e) => updateField('imageId', e.target.value)}
                placeholder="Image URL or ID"
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-base text-gray-900 pb-2">Status & Category</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-sp-category">Category</Label>
                <Input
                  id="edit-sp-category"
                  value={formData.category || ''}
                  onChange={(e) => updateField('category', e.target.value || null)}
                  placeholder="e.g., Annual, 5-Year"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-sp-category-ar">Category (Arabic)</Label>
                <Input
                  id="edit-sp-category-ar"
                  value={formData.categoryAr || ''}
                  onChange={(e) => updateField('categoryAr', e.target.value || null)}
                  placeholder="e.g., سنوي"
                  dir="rtl"
                />
              </div>

              <div className="col-span-2 space-y-2 pt-2">
                <Label htmlFor="edit-sp-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: PlanStatus) => updateField('status', value)}
                >
                  <SelectTrigger id="edit-sp-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Switch
                id="edit-sp-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => updateField('isActive', checked)}
              />
              <Label htmlFor="edit-sp-active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving…' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}