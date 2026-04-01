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
    mutation.mutate(
      { param: { id: plan.id }, json: formData },
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

          {/* Metadata */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base text-gray-900 border-b pb-2">Metadata</h3>

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
