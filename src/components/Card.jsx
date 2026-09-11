import React from 'react';
import { COLORS, SHADOWS } from '../styles/colors';

const Card = ({ children, className = '', style = {}, ...props }) => {
  const styles = {
    backgroundColor: COLORS.surface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    boxShadow: SHADOWS.soft,
    padding: '24px',
    transition: 'all 0.3s ease',
    ...style,
  };

  const hoverStyle = {
    ...styles,
    boxShadow: SHADOWS.medium,
    transform: 'translateY(-4px)',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div 
      style={isHovered ? hoverStyle : styles} 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
