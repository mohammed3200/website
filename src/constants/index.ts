export * from './icons';
export * from './images';
export * from './permissions';

import { Facebook, Twitter, Linkedin, MessageCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const socials: Array<{
  id: string;
  title: string;
  icon: LucideIcon;
  url: string;
}> = [
  {
    id: '0',
    title: 'Facebook',
    icon: Facebook,
    url: '#',
  },
  {
    id: '1',
    title: 'Twitter',
    icon: Twitter,
    url: '#',
  },
  {
    id: '2',
    title: 'Linkedin',
    icon: Linkedin,
    url: '#',
  },
  {
    id: '3',
    title: 'Whatsapp',
    icon: MessageCircle, // Using MessageCircle as WhatsApp icon alternative
    url: '#',
  },
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024 * 1024; // 50MB

export const mediaTypes = [
  // Document types
  'application/pdf', // .pdf
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint', // .ppt
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/rtf', // Rich Text Format
  'text/plain', // .txt

  // Image types
  'image/jpeg', // .jpg, .jpeg
  'image/png', // .png
  'image/gif', // .gif
  'image/webp', // .webp
  'image/bmp', // .bmp
  'image/tiff', // .tiff
  'image/svg+xml', // .svg
  'image/vnd.adobe.photoshop', // .psd

  // Video types
  'video/mp4', // .mp4
  'video/x-msvideo', // .avi
  'video/x-flv', // .flv
  'video/webm', // .webm
  'video/ogg', // .ogv
  'video/quicktime', // .mov
  'video/x-matroska', // .mkv
  'video/x-ms-wmv', // .wmv
  'video/x-m4v', // .m4v

  // Audio types
  'audio/mpeg', // .mp3
  'audio/wav', // .wav
  'audio/ogg', // .ogg
  'audio/aac', // .aac
  'audio/flac', // .flac
  'audio/x-m4a', // .m4a
  'audio/x-ms-wma', // .wma
  'audio/webm', // .weba
  'audio/midi', // .midi
  'audio/x-aiff', // .aiff
  'audio/x-wav', // .wav (alternative)
];
