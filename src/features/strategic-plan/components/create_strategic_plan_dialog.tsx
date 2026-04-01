'use client';

import { useState } from 'react';
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
import { usePostStrategicPlan } from '@/features/strategic-plan/api';
import {
  CreateStrategicPlanInput,
  PlanStatus,
} from '@/features/strategic-plan/schemas/strategic-plan-schema';
import { generateSlug } from '@/features/strategic-plan/utils/slug';

interface CreateStrategicPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const INITIAL_STATE: CreateStrategicPlanInput = {
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

export function CreateStrategicPlanDialog({ open, onOpenChange }: CreateStrategicPlanDialogProps) {
  const [formData, setFormData] = useState<CreateStrategicPlanInput>(INITIAL_STATE);
  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);
  const mutation = usePostStrategicPlan();

  const updateField = <K extends keyof CreateStrategicPlanInput>(
    key: K,
    value: CreateStrategicPlanInput[K],
  ) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (value: string) => {
    if (autoGenerateSlug) {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));
    } else {
      updateField('title', value);
    }
  };

  const handleAutoSlugToggle = (checked: boolean) => {
    setAutoGenerateSlug(checked);
    if (checked && formData.title) {
      updateField('slug', generateSlug(formData.title));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(
      { json: formData },
      {
        onSuccess: () => {
          onOpenChange(false);
          setFormData(INITIAL_STATE);
          setAutoGenerateSlug(true);
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
            Create a new strategic plan with bilingual content support.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base text-gray-900 border-b pb-2">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="sp-title">Title (English) *</Label>
              <Input
                id="sp-title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Enter the strategic plan title"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sp-slug">Slug *</Label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Switch
                    id="sp-slug-auto"
                    checked={autoGenerateSlug}
                    onCheckedChange={handleAutoSlugToggle}
                  />
                  <Label htmlFor="sp-slug-auto" className="cursor-pointer font-normal">
                    Auto-generate
                  </Label>
                </div>
              </div>
              <Input
                id="sp-slug"
                value={formData.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                disabled={autoGenerateSlug}
                required
                placeholder="url-friendly-slug"
                pattern="^[a-z0-9-]+$"
              />
              <p className="text-xs text-gray-500">
                Lowercase letters, numbers, and hyphens only.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sp-excerpt">Excerpt</Label>
              <Input
                id="sp-excerpt"
                value={formData.excerpt || ''}
                onChange={(e) => updateField('excerpt', e.target.value || null)}
                placeholder="Short description or caption"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sp-content">Content (English) *</Label>
              <Textarea
                id="sp-content"
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
              <Label htmlFor="sp-title-ar">Title (Arabic)</Label>
              <Input
                id="sp-title-ar"
                value={formData.titleAr || ''}
                onChange={(e) => updateField('titleAr', e.target.value)}
                placeholder="Enter title in Arabic"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sp-excerpt-ar">Excerpt (Arabic)</Label>
              <Input
                id="sp-excerpt-ar"
                value={formData.excerptAr || ''}
                onChange={(e) => updateField('excerptAr', e.target.value)}
                placeholder="Short description in Arabic"
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sp-content-ar">Content (Arabic)</Label>
              <Textarea
                id="sp-content-ar"
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
                <Label htmlFor="sp-phase">Phase</Label>
                <Input
                  id="sp-phase"
                  value={formData.phase || ''}
                  onChange={(e) => updateField('phase', e.target.value)}
                  placeholder="e.g., Execution"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-phase-ar">Phase (Arabic)</Label>
                <Input
                  id="sp-phase-ar"
                  value={formData.phaseAr || ''}
                  onChange={(e) => updateField('phaseAr', e.target.value)}
                  placeholder="e.g., قيد التنفيذ"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sp-published-at">Published At</Label>
                <Input
                  type="datetime-local"
                  id="sp-published-at"
                  value={formData.publishedAt || ''}
                  onChange={(e) => updateField('publishedAt', e.target.value || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-start-date">Start Date</Label>
                <Input
                  type="datetime-local"
                  id="sp-start-date"
                  value={formData.startDate || ''}
                  onChange={(e) => updateField('startDate', e.target.value || null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-end-date">End Date</Label>
                <Input
                  type="datetime-local"
                  id="sp-end-date"
                  value={formData.endDate || ''}
                  onChange={(e) => updateField('endDate', e.target.value || null)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sp-meta-title">Meta Title</Label>
                <Input
                  id="sp-meta-title"
                  value={formData.metaTitle || ''}
                  onChange={(e) => updateField('metaTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sp-meta-desc">Meta Description</Label>
                <Input
                  id="sp-meta-desc"
                  value={formData.metaDescription || ''}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sp-image-id">Image ID / URL</Label>
              <Input
                id="sp-image-id"
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
                <Label htmlFor="sp-category">Category</Label>
                <Input
                  id="sp-category"
                  value={formData.category || ''}
                  onChange={(e) => updateField('category', e.target.value || null)}
                  placeholder="e.g., Annual, 5-Year"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sp-category-ar">Category (Arabic)</Label>
                <Input
                  id="sp-category-ar"
                  value={formData.categoryAr || ''}
                  onChange={(e) => updateField('categoryAr', e.target.value || null)}
                  placeholder="e.g., سنوي"
                  dir="rtl"
                />
              </div>

              <div className="col-span-2 space-y-2 pt-2">
                <Label htmlFor="sp-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: PlanStatus) => updateField('status', value)}
                >
                  <SelectTrigger id="sp-status">
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
                id="sp-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => updateField('isActive', checked)}
              />
              <Label htmlFor="sp-active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating…' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
