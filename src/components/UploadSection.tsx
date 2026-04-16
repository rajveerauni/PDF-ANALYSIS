'use client';

import { useCallback, forwardRef, useImperativeHandle } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { cardVariant } from '@/lib/variants';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export interface UploadSectionHandle {
  open: () => void;
}

const UploadSection = forwardRef<UploadSectionHandle, UploadSectionProps>(
  ({ onFileSelect, disabled = false }, ref) => {
    const onDrop = useCallback(
      (accepted: File[]) => {
        if (accepted[0]) onFileSelect(accepted[0]);
      },
      [onFileSelect],
    );

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop,
      accept: { 'application/pdf': ['.pdf'] },
      maxFiles: 1,
      disabled,
    });

    useImperativeHandle(ref, () => ({ open }), [open]);

    // Separate dropzone props from motion — avoids drag-event type conflicts
    const rootProps = getRootProps();

    return (
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <motion.div variants={cardVariant} initial="initial" animate="animate">
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <div
            {...rootProps}
            className={[
              'border-2 border-dashed p-12 md:p-24 flex flex-col items-center justify-center text-center transition-all duration-200',
              isDragActive
                ? 'border-primary-container bg-surface-container cursor-copy'
                : 'border-primary/30 bg-surface-container-low hover:border-primary-container hover:bg-surface-container cursor-pointer',
              disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
            ].join(' ')}
          >
            <input {...getInputProps()} />

            <motion.div
              className="w-20 h-20 mb-6 flex items-center justify-center border-2 border-primary/40 transition-colors"
              animate={
                isDragActive
                  ? { borderColor: '#00fdc1', scale: 1.05 }
                  : { borderColor: 'rgba(170,255,220,0.4)', scale: 1 }
              }
              transition={{ duration: 0.2 }}
            >
              <span
                className={`material-symbols-outlined text-4xl transition-colors ${
                  isDragActive ? 'text-primary-container' : 'text-primary/60'
                }`}
              >
                upload_file
              </span>
            </motion.div>

            <h2 className="text-2xl font-headline uppercase tracking-widest mb-4">
              {isDragActive ? 'RELEASE TO INITIALIZE' : 'DROP PDF TO INITIALIZE ANALYSIS'}
            </h2>
            <p className="text-on-surface-variant max-w-md font-body">
              Supported formats: .PDF (Max 10MB). Neural processing takes ~4.2s per 100 pages.
            </p>

            <div className="mt-8 flex gap-2">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="w-2 h-2"
                  animate={
                    isDragActive
                      ? { backgroundColor: '#00fdc1', scale: 1.5 }
                      : { backgroundColor: 'rgba(170,255,220,0.2)', scale: 1 }
                  }
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    );
  },
);

UploadSection.displayName = 'UploadSection';
export default UploadSection;
