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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePatchStrategicPlan } from '@/features/strategic-plan/api';
import { UpdateStrategicPlanInput, PlanPriority, PlanStatus } from '@/features/strategic-plan/schemas/strategic-plan-schema';

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
    slug: '',
    content: '',
    excerpt: null,
    category: null,
    priority: 'MEDIUM',
    status: 'DRAFT',
    isActive: true,
    publishedAt: null,
    startDate: null,
    endDate: null,
    imageId: null,
    metaTitle: null,
    metaDescription: null,
  });

  const mutation = usePatchStrategicPlan();

  useEffect(() => {
    if (plan) {
      setFormData({
        title: plan.title || '',
        slug: plan.slug || '',
        content: plan.content || '',
        excerpt: plan.excerpt || null,
        category: plan.category || null,
        priority: plan.priority || 'MEDIUM',
        status: plan.status || 'DRAFT',
        isActive: plan.isActive ?? true,
        publishedAt: plan.publishedAt ? new Date(plan.publishedAt).toISOString() : null,
        startDate: plan.startDate ? new Date(plan.startDate).toISOString() : null,
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
      }
    );
  };

  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Strategic Plan</DialogTitle>
          <DialogDescription>
            Update the strategic plan information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Enter the strategic plan title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="url-friendly-slug"
                pattern="^[a-z0-9-]+$"
              />
              <p className="text-xs text-gray-500">
                URL-friendly identifier (lowercase letters, numbers, and hyphens only)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Input
                id="edit-excerpt"
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value || null })}
                placeholder="Short description or caption"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-content">Content *</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                required
                placeholder="Enter the full strategic plan content"
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold text-lg">Metadata</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value || null })}
                  placeholder="e.g., Annual, 5-Year"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: PlanPriority) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: PlanStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
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

              <div className="space-y-2 flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Active</span>
                </label>
              </div>
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
