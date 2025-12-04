import * as React from 'react';

export interface DoDontProps {
  doText: React.ReactNode;
  dontText: React.ReactNode;
  doTitle?: string;
  dontTitle?: string;
}

export const DoDont: React.FC<DoDontProps> = ({
  doText,
  dontText,
  doTitle = 'Do',
  dontTitle = "Don't",
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        margin: '24px 0',
        fontFamily: "'Source Sans Pro', sans-serif",
      }}
    >
      {/* Do Section */}
      <div
        style={{
          backgroundColor: '#ECFDF5',
          borderRadius: '8px',
          padding: '20px',
          borderTop: '4px solid #10B981',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            fontWeight: 600,
            fontSize: '16px',
            color: '#047857',
          }}
        >
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            {'\u2713'}
          </span>
          <span>{doTitle}</span>
        </div>
        <div
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#374151',
          }}
        >
          {doText}
        </div>
      </div>

      {/* Don't Section */}
      <div
        style={{
          backgroundColor: '#FEF2F2',
          borderRadius: '8px',
          padding: '20px',
          borderTop: '4px solid #EF4444',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
            fontWeight: 600,
            fontSize: '16px',
            color: '#B91C1C',
          }}
        >
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
            }}
          >
            {'\u2715'}
          </span>
          <span>{dontTitle}</span>
        </div>
        <div
          style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#374151',
          }}
        >
          {dontText}
        </div>
      </div>
    </div>
  );
};
