import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateString = (input: string) =>
  input.length > 100 ? input.slice(0, 97) + "..." : input;

export const getImageDimensions = async (
  photoGallery: string[]
): Promise<{ src: string; width: number; height: number }[]> => {
  const imageDetails = await Promise.all(
    photoGallery.map(async (src) => {
      // Create a new Image object
      const img = new Image();
      img.src = src;

      // Return a promise that resolves when the image loads
      return new Promise<{ src: string; width: number; height: number }>(
        (resolve, reject) => {
          img.onload = () => {
            resolve({
              src: img.src,
              width: img.width,
              height: img.height,
            });
          };
          img.onerror = () => {
            reject(new Error(`Failed to load image at ${src}`));
          };
        }
      );
    })
  );

  return imageDetails;
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);