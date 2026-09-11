import React from 'react';
import { COLORS, SPACING } from '../styles/colors';

const Button = ({ variant = 'primary', size = 'md', children, ...props }) => {
  const baseStyle = {
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s',
    fontFamily: 'inherit',
  };

  const sizeStyles = {
    sm: { padding: `${SPACING.sm} ${SPACING.md}`, fontSize: '0.9rem' },
    md: { padding: `${SPACING.md} ${SPACING.lg}`, fontSize: '1rem' },
    lg: { padding: `${SPACING.lg} ${SPACING.xl}`, fontSize: '1.1rem' },
  };

  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      color: 'white',
      '&:hover': { backgroundColor: '#0052CC' },
    },
    secondary: {
      backgroundColor: COLORS.border,
      color: COLORS.textPrimary,
      '&:hover': { backgroundColor: '#D5DDE5' },
    },
    danger: {
      backgroundColor: COLORS.error,
      color: 'white',
      '&:hover': { backgroundColor: '#E61E1E' },
    },
  };

  const style = {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button style={style} {...props}>
      {children}
    </button>
  );
};

export default Button;
