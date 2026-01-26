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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePostStrategicPlan } from '@/features/strategic-plan/api';
import { CreateStrategicPlanInput, PlanPriority, PlanStatus } from '@/features/strategic-plan/schemas/strategic-plan-schema';
import { generateSlug } from '@/features/strategic-plan/utils/slug';

interface CreateStrategicPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateStrategicPlanDialog({
  open,
  onOpenChange,
}: CreateStrategicPlanDialogProps) {
  const [formData, setFormData] = useState<CreateStrategicPlanInput>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: '',
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

  const [autoGenerateSlug, setAutoGenerateSlug] = useState(true);

  const mutation = usePostStrategicPlan();

  // Auto-generate slug from title
  const generatedSlug = useMemo(() => {
    if (!formData.title || !autoGenerateSlug) return '';
    const baseSlug = generateSlug(formData.title);
    // Add language suffix based on content (detect Arabic characters)
    const hasArabic = /[\u0600-\u06FF]/.test(formData.title);
    return hasArabic ? `${baseSlug}-ar` : `${baseSlug}-en`;
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
          setFormData({
            title: '',
            slug: '',
            content: '',
            excerpt: '',
            category: '',
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
          setAutoGenerateSlug(true);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Strategic Plan</DialogTitle>
          <DialogDescription>
            Create a new strategic plan record. Each record represents one language version.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (autoGenerateSlug) {
                    const baseSlug = generateSlug(e.target.value);
                    const hasArabic = /[\u0600-\u06FF]/.test(e.target.value);
                    setFormData(prev => ({ ...prev, slug: hasArabic ? `${baseSlug}-ar` : `${baseSlug}-en` }));
                  }
                }}
                required
                placeholder="Enter the strategic plan title"
              />
            </div>

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
                        const baseSlug = generateSlug(formData.title);
                        const hasArabic = /[\u0600-\u06FF]/.test(formData.title);
                        setFormData(prev => ({ ...prev, slug: hasArabic ? `${baseSlug}-ar` : `${baseSlug}-en` }));
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span>Auto-generate from title</span>
                </label>
              </div>
              <Input
                id="slug"
                value={autoGenerateSlug ? generatedSlug : formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                disabled={autoGenerateSlug}
                required
                placeholder="url-friendly-slug"
                pattern="^[a-z0-9-]+$"
              />
              <p className="text-xs text-gray-500">
                URL-friendly identifier (lowercase letters, numbers, and hyphens only)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value || null })}
                placeholder="Short description or caption"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
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
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value || null })}
                  placeholder="e.g., Annual, 5-Year"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
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
                <Label htmlFor="status">Status</Label>
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
              {mutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
