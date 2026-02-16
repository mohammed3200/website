import { clsx, type ClassValue } from 'clsx';
import { mediaTypes } from '@/constants';
import { fileTypeFromBuffer } from 'file-type';
import { twMerge } from 'tailwind-merge';
import { FileType } from 'next/dist/lib/file-exists';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateString = (
  input: string,
  slice: number,
  MaxLength?: number,
) =>
  typeof MaxLength === 'number'
    ? input.length > MaxLength
    : input.length > slice
      ? input.slice(0, slice) + '...'
      : input;

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const convertFileSize = (sizeInBytes: number, digits?: number) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + ' Bytes'; // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + ' KB'; // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + ' MB'; // Less than 1 GB, show in MB
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + ' GB'; // 1 GB or more, show in GB
  }
};

export const getFileIcon = (
  extension: string | undefined,

  type: FileType | string,
) => {
  switch (extension) {
    // Document
    case 'pdf':
      return '/assets/icons/file-pdf.svg';
    case 'doc':
      return '/assets/icons/file-doc.svg';
    case 'docx':
      return '/assets/icons/file-docx.svg';
    case 'csv':
      return '/assets/icons/file-csv.svg';
    case 'txt':
      return '/assets/icons/file-txt.svg';
    case 'xls':
    case 'xlsx':
      return '/assets/icons/file-document.svg';
    // Image
    case 'svg':
      return '/assets/icons/file-image.svg';
    // Video
    case 'mkv':
    case 'mov':
    case 'avi':
    case 'wmv':
    case 'mp4':
    case 'flv':
    case 'webm':
    case 'm4v':
    case '3gp':
      return '/assets/icons/file-video.svg';
    // Audio
    case 'mp3':
    case 'mpeg':
    case 'wav':
    case 'aac':
    case 'flac':
    case 'ogg':
    case 'wma':
    case 'm4a':
    case 'aiff':
    case 'alac':
      return '/assets/icons/file-audio.svg';

    default:
      switch (type) {
        case 'image':
          return '/assets/icons/file-image.svg';
        case 'document':
          return '/assets/icons/file-document.svg';
        case 'video':
          return '/assets/icons/file-video.svg';
        case 'audio':
          return '/assets/icons/file-audio.svg';
        default:
          return '/assets/icons/file-other.svg';
      }
  }
};

export const getFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  if (!extension) return { type: 'other', extension: '' };

  const documentExtensions = [
    'pdf',
    'doc',
    'docx',
    'txt',
    'xls',
    'xlsx',
    'csv',
    'rtf',
    'ods',
    'ppt',
    'odp',
    'md',
    'html',
    'htm',
    'epub',
    'pages',
    'fig',
    'psd',
    'ai',
    'indd',
    'xd',
    'sketch',
    'afdesign',
    'afphoto',
    'afphoto',
  ];
  const imageExtensions = [
    'jpg',
    'jpeg',
    'jfif',
    'png',
    'gif',
    'bmp',
    'svg',
    'webp',
  ];
  const videoExtensions = ['mp4', 'avi', 'mov', 'mkv', 'webm'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac'];

  if (documentExtensions.includes(extension))
    return { type: 'document', extension };
  if (imageExtensions.includes(extension)) return { type: 'image', extension };
  if (videoExtensions.includes(extension)) return { type: 'video', extension };
  if (audioExtensions.includes(extension)) return { type: 'audio', extension };

  return { type: 'other', extension };
};

// Helper function to convert a file to base64
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to validate file type using magic bytes
export const validateFileType = async (
  arrayBufferString: string,
): Promise<boolean> => {
  // Convert the ArrayBuffer string to ArrayBuffer
  const arrayBuffer = Uint8Array.from(atob(arrayBufferString), (c) =>
    c.charCodeAt(0),
  ).buffer;

  // Convert ArrayBuffer to Buffer
  const buffer = Buffer.from(arrayBuffer);

  // Use file-type to detect the file type
  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType || !fileType.mime) {
    return false; // Unable to determine the file type
  }

  // Check if the detected file type is in the allowed media types
  return mediaTypes.includes(fileType.mime);
};

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
