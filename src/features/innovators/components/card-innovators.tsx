// src/features/innovators/components/card-innovators.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  ArrowRight,
  User,
  X,
  Mail,
  Phone,
  Quote,
  Rocket,
} from 'lucide-react';
import useLanguage from '@/hooks/use-language';
import { cn } from '@/lib/utils';
import type { Innovator } from '../types/types';

interface CardInnovatorsProps {
  innovator: Innovator;
  className?: string;
}

export const CardInnovators: React.FC<CardInnovatorsProps> = ({
  innovator,
  className,
}) => {
  const { isArabic } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const hadOpenedRef = useRef(false);

  const locationParts = [innovator.city, innovator.country].filter(Boolean);
  const locationString =
    locationParts.length > 0 ? locationParts.join(', ') : innovator.location;
  const imageSrc = innovator.imageUrl || innovator.imageId;

  // Focus Management
  useEffect(() => {
    if (isOpen) {
      hadOpenedRef.current = true;
      // Small timeout to ensure modal is rendered and motion started
      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (focusable.length > 0) {
            (focusable[0] as HTMLElement).focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    } else if (hadOpenedRef.current) {
      // Restore focus to trigger when closing
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (e.key === 'Tab' && modalRef.current) {
      const focusable = Array.from(
        modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ) as HTMLElement[];

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  };

  // Modal Component
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            ref={modalRef}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] outline-none"
            dir={isArabic ? 'rtl' : 'ltr'}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`innovator-modal-title-${innovator.id}`}
          >
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className={cn(
                'absolute top-4 p-2 bg-card/50 hover:bg-muted rounded-full transition-colors z-20',
                isArabic ? 'left-4' : 'right-4',
              )}
              aria-label={isArabic ? 'إغلاق' : 'Close'}
            >
              <X className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            </button>

            <div
              className={cn(
                'overflow-y-auto p-0',
                // Custom scrollbar styling
                '[&::-webkit-scrollbar]:w-2',
                '[&::-webkit-scrollbar-track]:bg-transparent',
                '[&::-webkit-scrollbar-thumb]:bg-border',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                '[&::-webkit-scrollbar-thumb]:hover:bg-border/80',
              )}
            >
              {/* Modal Header */}
              <div className="bg-muted/30 p-8 flex items-center gap-6 border-b border-border/50">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-card shadow-sm shrink-0 bg-card">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={innovator.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div>
                  <h2
                    id={`innovator-modal-title-${innovator.id}`}
                    className="text-2xl md:text-3xl font-din-bold text-foreground"
                  >
                    {innovator.name}
                  </h2>
                  <p className="text-primary font-din-medium">
                    {innovator.specialization}
                  </p>
                  {locationString && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="font-din-regular">{locationString}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-8">
                {/* Project */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-primary font-din-bold uppercase text-xs tracking-wider">
                    <Rocket className="w-4 h-4" />
                    {isArabic ? 'المشروع' : 'Project'}
                  </div>
                  <h3 className="text-xl font-din-bold text-foreground">
                    {innovator.projectTitle}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-din-regular">
                    {innovator.projectDescription}
                  </p>
                </div>

                {/* Objective */}
                {innovator.objective && (
                  <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
                    <div className="flex items-center gap-2 text-primary font-din-bold uppercase text-xs tracking-wider mb-3">
                      <Quote className="w-4 h-4" />
                      {isArabic ? 'الهدف' : 'Objective'}
                    </div>
                    <p className="text-foreground/80 text-sm leading-relaxed font-din-medium">
                      {innovator.objective}
                    </p>
                  </div>
                )}

                {/* Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  {innovator.email && (
                    <a
                      href={`mailto:${innovator.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs text-muted-foreground font-din-bold uppercase">
                          {isArabic ? 'البريد الإلكتروني' : 'Email'}
                        </p>
                        <p className="text-sm font-din-medium text-foreground truncate">
                          {innovator.email}
                        </p>
                      </div>
                    </a>
                  )}
                  {innovator.phone && (
                    <a
                      href={`tel:${innovator.phone}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-din-bold uppercase">
                          {isArabic ? 'الهاتف' : 'Phone'}
                        </p>
                        <p className="text-sm font-din-medium text-foreground">
                          {innovator.phone}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={
          isArabic
            ? `عرض تفاصيل ${innovator.name}`
            : `View details for ${innovator.name}`
        }
        className={cn(
          'group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full',
          className,
        )}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Top Decorative Header */}
        <div
          className={cn(
            'h-24 bg-gradient-to-r from-muted/50 to-muted relative',
            isArabic && 'bg-gradient-to-l',
          )}
        >
          <div
            className={cn('absolute top-4', isArabic ? 'left-4' : 'right-4')}
          >
            <span className="px-3 py-1 bg-card/80 backdrop-blur-sm rounded-full text-xs font-din-bold text-muted-foreground border border-border/50 shadow-sm">
              {innovator.specialization}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="px-6 pb-6 flex-1 flex flex-col relative">
          {/* Avatar (Overlapping) */}
          <div className="-mt-12 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-card bg-card shadow-sm overflow-hidden">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={innovator.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="mb-4">
            <h3 className="text-xl font-din-bold text-foreground group-hover:text-primary transition-colors">
              {innovator.name}
            </h3>
            {locationString && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-din-regular">{locationString}</span>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="mb-6 flex-1">
            <h4 className="text-base font-din-bold text-foreground mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {innovator.projectTitle}
            </h4>
            <p className="text-muted-foreground text-sm font-din-regular leading-relaxed line-clamp-3">
              {innovator.projectDescription ||
                (isArabic ? 'لا يوجد وصف متاح.' : 'No description available.')}
            </p>
          </div>

          {/* Footer Action */}
          <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
            <span className="text-xs font-din-bold text-muted-foreground uppercase tracking-wider">
              {isArabic ? 'عرض التفاصيل' : 'View Details'}
            </span>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
              <ArrowRight className={cn('w-4 h-4', isArabic && 'rotate-180')} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Rendered via Portal to document.body */}
      {typeof window !== 'undefined' &&
        createPortal(modalContent, document.body)}
    </>
  );
};
