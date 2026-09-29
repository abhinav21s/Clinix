import React from 'react';
import { COLORS, SPACING, SHADOWS } from '../styles/colors';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = {
    fontWeight: '600',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    border: 'none',
    fontFamily: 'inherit',
  };

  const sizeStyles = {
    sm: {
      padding: `${SPACING.sm} ${SPACING.md}`,
      fontSize: '0.875rem',
    },
    md: {
      padding: `${SPACING.md} ${SPACING.lg}`,
      fontSize: '1rem',
    },
    lg: {
      padding: `${SPACING.lg} ${SPACING.xl}`,
      fontSize: '1.125rem',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.surface,
      '&:hover': {
        backgroundColor: COLORS.primaryHover,
        boxShadow: SHADOWS.soft,
      },
    },
    secondary: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      border: `2px solid ${COLORS.primary}`,
      '&:hover': {
        backgroundColor: COLORS.background,
      },
    },
    danger: {
      backgroundColor: COLORS.error,
      color: COLORS.surface,
      '&:hover': {
        backgroundColor: '#C53030',
        boxShadow: SHADOWS.soft,
      },
    },
  };

  const finalStyle = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  return (
    <button 
      style={finalStyle} 
      onClick={onClick} 
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
