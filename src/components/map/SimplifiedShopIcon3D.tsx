import React from 'react';

interface ShopIcon3DProps {
  className?: string;
  // No animation props needed for HQ icon
}

/**
 * A simplified 3D shop/HQ icon that uses the same styling as the van icon
 * This is used to show tradespeople's headquarters or base locations
 */
const ShopIcon3D: React.FC<ShopIcon3DProps> = ({ 
  className = "h-24 w-24"
}) => {
  // No animations for HQ icon
  
  return (
    <svg 
      viewBox="0 0 128 128" 
      className={className}
      style={{
        filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))'
      }}
    >
      {/* All shop elements */}
      <g transform="translate(24, 10)">
        {/* Main building structure */}
        <rect
          x="10"
          y="30"
          width="60"
          height="60"
          fill="white"
          stroke="#000000"
          strokeWidth="4"
          rx="2"
        />
        
        {/* Flat Roof */}
        <path
          d="M5 30 L75 30"
          fill="none"
          stroke="#000000"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        
        {/* Small roof ledge */}
        <rect
          x="5"
          y="25"
          width="70"
          height="5"
          fill="white"
          stroke="#000000"
          strokeWidth="2"
        />
        
        {/* Door */}
        <rect
          x="30"
          y="60"
          width="20"
          height="30"
          fill="white"
          stroke="#000000"
          strokeWidth="3"
          rx="2"
        />
        
        {/* Door handle */}
        <circle cx="45" cy="75" r="2" fill="#000000" />
        
        {/* Windows */}
        <rect x="15" y="40" width="15" height="15" rx="1" fill="white" stroke="#000000" strokeWidth="2" />
        <rect x="50" y="40" width="15" height="15" rx="1" fill="white" stroke="#000000" strokeWidth="2" />
        
        {/* Window crossbars */}
        <path d="M15 47.5 L30 47.5" stroke="#000000" strokeWidth="1" />
        <path d="M22.5 40 L22.5 55" stroke="#000000" strokeWidth="1" />
        <path d="M50 47.5 L65 47.5" stroke="#000000" strokeWidth="1" />
        <path d="M57.5 40 L57.5 55" stroke="#000000" strokeWidth="1" />
        
        {/* Sign */}
        <rect x="20" y="20" width="40" height="10" fill="white" stroke="#000000" strokeWidth="2" rx="1" />
        
        {/* No ground lines for HQ icon */}
      </g>
      
      {/* No animation overlay */}
    </svg>
  );
};

export default ShopIcon3D;
