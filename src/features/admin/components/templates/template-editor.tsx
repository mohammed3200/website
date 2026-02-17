'use client';

import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import { createTemplateSchema } from '@/features/admin/schemas/templates-schema';
import { usePostTemplate } from '@/features/admin/api/templates/use-post-template';
import { usePatchTemplate } from '@/features/admin/api/templates/use-patch-template';

type TemplateFormValues = z.infer<typeof createTemplateSchema>;

interface TemplateEditorProps {
  initialData?: any;
  isEditing?: boolean;
}

export const TemplateEditor = ({
  initialData,
  isEditing = false,
}: TemplateEditorProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('edit'); // Used for tabs value? No, Tabs defaultValue="en". This state seems unused or mismatching.
  // The tabs in generic UI are usually controlled if we want to switch programmatically, but here they are just 'en'/'ar'.
  // Let's keep it if needed, but remove unused variables if possible.
  // Actually, the original code had activeTab 'edit', but the Tabs used 'en'/'ar'.
  // I will just ignore activeTab state if it's not used in the JSX.

  const [previewLocale, setPreviewLocale] = useState<'ar' | 'en'>('ar');

  const createMutation = usePostTemplate();
  const updateMutation = usePatchTemplate(initialData?.id || '');

  const form = useForm<TemplateFormValues>({
    resolver: zodResolver(createTemplateSchema) as any,
    defaultValues: initialData || {
      slug: '',
      channel: 'BOTH',
      nameAr: '',
      nameEn: '',
      subjectAr: '',
      subjectEn: '',
      bodyAr: '',
      bodyEn: '',
      variables: '[]',
      isActive: true,
    },
  });

  const channel = form.watch('channel');
  const bodyAr = form.watch('bodyAr');
  const bodyEn = form.watch('bodyEn');
  const subjectAr = form.watch('subjectAr');
  const subjectEn = form.watch('subjectEn');
  const variablesStr = form.watch('variables');

  const onSubmit = async (data: TemplateFormValues) => {
    if (isEditing && initialData?.id) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  // Preview helper
  const renderPreview = (text: string) => {
    if (!text) return '';
    // Simple highlighting for variables
    const highlighted = text.replace(
      /{{([^}]+)}}/g,
      (match) =>
        `<span class="bg-yellow-100 text-yellow-800 font-mono px-1 rounded">${match}</span>`,
    );
    // Sanitize the HTML to prevent XSS
    return DOMPurify.sanitize(highlighted);
  };

  const parsedVariables = (() => {
    try {
      return JSON.parse(variablesStr);
    } catch {
      return [];
    }
  })();

  const insertVariable = (variable: string, field: 'bodyAr' | 'bodyEn') => {
    const current = form.getValues(field);
    form.setValue(field, current + ` {{${variable}}} `);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Local Editing Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Edit Template' : 'New Template'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="submission_confirmation"
                          {...field}
                          disabled={isEditing}
                        />
                      </FormControl>
                      <FormDescription>
                        Unique identifier (snake_case)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="EMAIL">Email Only</SelectItem>
                          <SelectItem value="WHATSAPP">
                            WhatsApp Only
                          </SelectItem>
                          <SelectItem value="BOTH">Both</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-arabic">
                        الاسم (العربية)
                      </FormLabel>
                      <FormControl>
                        <Input className="text-right" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subjects (Hidden for WhatsApp-only if desired, but schema allows valid strings) */}
              {channel !== 'WHATSAPP' && (
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/20 rounded-lg">
                  <FormField
                    control={form.control as any}
                    name="subjectEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject (English)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control as any}
                    name="subjectAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-arabic">
                          الموضوع (العربية)
                        </FormLabel>
                        <FormControl>
                          <Input className="text-right" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">English Content</TabsTrigger>
                  <TabsTrigger value="ar">Arabic Content</TabsTrigger>
                </TabsList>

                <TabsContent value="en" className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="bodyEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body (English)</FormLabel>
                        <div className="mb-2 flex flex-wrap gap-2">
                          {parsedVariables &&
                            parsedVariables.map((v: string) => (
                              <Badge
                                key={v}
                                variant="outline"
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => insertVariable(v, 'bodyEn')}
                              >
                                {`{{${v}}}`}
                              </Badge>
                            ))}
                        </div>
                        <FormControl>
                          <Textarea
                            className="min-h-[200px] font-mono text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="ar" className="space-y-4">
                  <FormField
                    control={form.control as any}
                    name="bodyAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-arabic">
                          المحتوى (العربية)
                        </FormLabel>
                        <div className="mb-2 flex flex-wrap gap-2">
                          {parsedVariables &&
                            parsedVariables.map((v: string) => (
                              <Badge
                                key={v}
                                variant="outline"
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => insertVariable(v, 'bodyAr')}
                              >
                                {`{{${v}}}`}
                              </Badge>
                            ))}
                        </div>
                        <FormControl>
                          <Textarea
                            className="min-h-[200px] font-mono text-sm text-right"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <FormField
                control={form.control}
                name="variables"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variables (JSON Array)</FormLabel>
                    <FormControl>
                      <Input
                        className="font-mono text-xs"
                        {...field}
                        placeholder='["name", "link"]'
                      />
                    </FormControl>
                    <FormDescription>
                      Define available variables for interpolation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Active Template</FormLabel>
                      <FormDescription>
                        Disable to prevent this template from being sent.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-2"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? 'Update Template' : 'Create Template'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card className="h-fit sticky top-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Live Preview</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={previewLocale === 'en' ? 'default' : 'outline'}
                onClick={() => setPreviewLocale('en')}
              >
                EN
              </Button>
              <Button
                size="sm"
                variant={previewLocale === 'ar' ? 'default' : 'outline'}
                onClick={() => setPreviewLocale('ar')}
              >
                AR
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WhatsApp Style Preview */}
          {(channel === 'WHATSAPP' || channel === 'BOTH') && (
            <div className="bg-[#E5DDD5] p-4 rounded-lg relative min-h-[150px]">
              <div className="absolute top-2 left-2 text-xs text-gray-500 font-bold uppercase">
                WhatsApp
              </div>
              <div
                className="bg-white p-3 rounded-lg shadow-sm max-w-[90%] mt-4 text-sm whitespace-pre-wrap leading-relaxed"
                dir={previewLocale === 'ar' ? 'rtl' : 'ltr'}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderPreview(
                      previewLocale === 'ar' ? bodyAr : bodyEn,
                    ),
                  }}
                />
              </div>
            </div>
          )}

          {/* Email Style Preview (Simplified) */}
          {(channel === 'EMAIL' || channel === 'BOTH') && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-100 p-2 border-b flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="text-xs text-gray-500 ml-2">Email Preview</div>
              </div>
              <div className="p-4 bg-white min-h-[200px]">
                <div className="border-b pb-2 mb-4">
                  <span className="text-gray-500 text-sm">Subject: </span>
                  <span
                    className="font-medium"
                    dir={previewLocale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {previewLocale === 'ar' ? subjectAr : subjectEn}
                  </span>
                </div>
                <div
                  className="text-sm whitespace-pre-wrap leading-relaxed space-y-2"
                  dir={previewLocale === 'ar' ? 'rtl' : 'ltr'}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: renderPreview(
                        previewLocale === 'ar' ? bodyAr : bodyEn,
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
