import React from 'react';

/* =======================
   Types
======================= */
type Variant = 'default' | 'gradient' | 'underline' | 'badge';
type Align = 'left' | 'center' | 'right';

interface SectionTitleProps {
  title?: string;
  subtitle?: string;
  align?: Align;
  variant?: Variant;
}

/* =======================
   Component
======================= */
const SectionTitle: React.FC<SectionTitleProps> = ({
  title = '',
  subtitle = '',
  align = 'center',
  variant = 'default'
}) => {
  /* -----------------------
     Alignments
  ----------------------- */
  const alignmentClasses: Record<Align, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  /* -----------------------
     Variants styles
  ----------------------- */
  const variantStyles: Record<
    Variant,
    { title: string; subtitle: string }
  > = {
    default: {
      title: 'text-gray-900 dark:text-white',
      subtitle: 'text-gray-600 dark:text-gray-300'
    },
    gradient: {
      title:
        'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent',
      subtitle: 'text-gray-600 dark:text-gray-300'
    },
    underline: {
      title: 'text-gray-900 dark:text-white',
      subtitle: 'text-gray-600 dark:text-gray-300'
    },
    badge: {
      title: 'text-gray-900 dark:text-white',
      subtitle: 'text-gray-600 dark:text-gray-300'
    }
  };

  /* -----------------------
     Safe values (no errors)
  ----------------------- */
  const safeAlign: Align = alignmentClasses[align] ? align : 'center';
  const safeVariant: Variant = variantStyles[variant] ? variant : 'default';

  const styles = variantStyles[safeVariant];

  return (
    <div className={`mb-12 ${alignmentClasses[safeAlign]}`}>
      {/* ---------- Badge ---------- */}
      {safeVariant === 'badge' && (
        <div
          className={`inline-flex items-center px-4 py-2 rounded-full
          bg-blue-100 dark:bg-blue-900
          text-blue-600 dark:text-blue-400
          text-sm font-semibold mb-4
          ${safeAlign === 'center' ? 'mx-auto' : ''}`}
        >
          <svg
            className="w-4 h-4 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Découvrez
        </div>
      )}

      {/* ---------- Title ---------- */}
      <div className={safeVariant === 'underline' ? 'inline-block relative' : ''}>
        <h2
          className={`text-3xl md:text-4xl font-bold mb-4
          ${styles.title}
          transition-all duration-300`}
        >
          {title}
        </h2>

        {safeVariant === 'underline' && (
          <span className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full" />
        )}
      </div>

      {/* ---------- Subtitle ---------- */}
      {subtitle && (
        <p
          className={`text-lg md:text-xl
          ${styles.subtitle}
          max-w-3xl
          ${safeAlign === 'center' ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </p>
      )}

      {/* ---------- Default decoration ---------- */}
      {safeVariant === 'default' && safeAlign === 'center' && (
        <div className="flex items-center justify-center mt-4 space-x-2">
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};

export default SectionTitle;
