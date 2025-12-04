import * as React from 'react';

export interface TipProps {
  children: React.ReactNode;
  title?: string;
  type?: 'info' | 'warning' | 'success' | 'error';
}

const typeStyles = {
  info: {
    background: '#EFF6FF',
    border: '#3B82F6',
    icon: 'i',
    titleColor: '#1E40AF',
  },
  warning: {
    background: '#FFFBEB',
    border: '#F59E0B',
    icon: '!',
    titleColor: '#B45309',
  },
  success: {
    background: '#ECFDF5',
    border: '#10B981',
    icon: '\u2713',
    titleColor: '#047857',
  },
  error: {
    background: '#FEF2F2',
    border: '#EF4444',
    icon: '\u2715',
    titleColor: '#B91C1C',
  },
};

export const Tip: React.FC<TipProps> = ({
  children,
  title = 'Tip',
  type = 'info',
}) => {
  const styles = typeStyles[type];

  return (
    <div
      style={{
        backgroundColor: styles.background,
        borderLeft: `4px solid ${styles.border}`,
        borderRadius: '8px',
        padding: '16px 20px',
        margin: '16px 0',
        fontFamily: "'Source Sans Pro', sans-serif",
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
          fontWeight: 600,
          fontSize: '14px',
          color: styles.titleColor,
        }}
      >
        <span
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: styles.border,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          {styles.icon}
        </span>
        <span>{title}</span>
      </div>
      <div
        style={{
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#374151',
        }}
      >
        {children}
      </div>
    </div>
  );
};
