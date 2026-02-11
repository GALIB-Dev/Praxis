'use client';

import React, { CSSProperties } from 'react';

interface IconProps {
  name: string; // e.g., 'camera-svgrepo-com', 'user-svgrepo-com'
  size?: number; // width and height in pixels (default: 24)
  color?: string; // Tailwind color or CSS color (default: 'currentColor')
  className?: string; // Additional Tailwind classes
  style?: CSSProperties;
  alt?: string;
}

/**
 * Icon Component - Dynamically loads SVG icons from Content folder
 * @param name - SVG file name without .svg extension
 * @param size - Icon size in pixels (default: 24)
 * @param color - Color (uses currentColor by default for Tailwind)
 * @param className - Additional Tailwind classes
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  style,
  alt = name,
}) => {
  const [svgContent, setSvgContent] = React.useState<string>('');
  const [error, setError] = React.useState<boolean>(false);

  React.useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/Content/${name}.svg`);
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${name}`);
        }
        const content = await response.text();
        setSvgContent(content);
        setError(false);
      } catch (err) {
        console.error(`Error loading SVG icon "${name}":`, err);
        setError(true);
      }
    };

    loadSvg();
  }, [name]);

  if (error) {
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          ...style,
        }}
        className={`flex items-center justify-center bg-gray-200 rounded ${className}`}
        title={`Icon not found: ${name}`}
      >
        ?
      </div>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        color: color,
        ...style,
      }}
      className={`inline-flex items-center justify-center ${className}`}
      title={alt}
    />
  );
};

export default Icon;
