import React from 'react';
import { COLORS, SHADOWS } from '../styles/colors';

const Card = ({ children, className = '', ...props }) => {
  const styles = {
    backgroundColor: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    boxShadow: SHADOWS.soft,
    padding: '24px',
  };

  return (
    <div style={styles} className={className} {...props}>
      {children}
    </div>
  );
};

export default Card;
