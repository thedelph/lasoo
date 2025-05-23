import React from 'react';

interface VanIcon3DProps {
  className?: string;
  bearing?: number; // Exact bearing in degrees (0-360)
  animate?: boolean; // Whether to animate the van
}

/**
 * A simplified 3D van icon that uses SVG transforms for orientation
 * This is used to show tradespeople who are actively sharing their location
 */
const VanIcon3D: React.FC<VanIcon3DProps> = ({ 
  className = "h-24 w-24", 
  bearing = 90, // Default to east if no bearing provided
  animate = true // Animate by default
}) => {
  // Normalize the bearing to 0-360 range
  const normalizedBearing = ((bearing % 360) + 360) % 360;
  
  // Determine if we should flip the van based on direction
  // Vans traveling west (between 180° and 360°) should be flipped horizontally
  const shouldFlip = normalizedBearing > 180 && normalizedBearing < 360;
  
  // Calculate rotation angle based on bearing
  let rotationAngle;
  if (shouldFlip) {
    // For western directions, calculate deviation from west (270°)
    rotationAngle = normalizedBearing - 270;
  } else {
    // For eastern directions, calculate deviation from east (90°)
    rotationAngle = normalizedBearing - 90;
  }
  
  // Ensure the wheels always stay at the bottom by constraining rotation
  if (rotationAngle > 90) rotationAngle -= 180;
  if (rotationAngle < -90) rotationAngle += 180;
  
  // Log the transformation details
  console.log(`Van: bearing=${normalizedBearing}°, flip=${shouldFlip}, rotation=${rotationAngle}°`);
  
  // Animation keyframes
  const wiggleKeyframe = 'vanWiggle';
  const linesKeyframe = 'groundLines';
  
  // Register animations if we're in a browser and animations are enabled
  if (typeof document !== 'undefined' && animate) {
    if (!document.getElementById('van-animation-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'van-animation-styles';
      styleEl.textContent = `
        @keyframes ${wiggleKeyframe} {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-1px, -1px) rotate(-0.5deg); }
          50% { transform: translate(0, 1px) rotate(0.5deg); }
          75% { transform: translate(1px, -1px) rotate(0.5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        
        @keyframes ${linesKeyframe} {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -32; }
        }
      `;
      document.head.appendChild(styleEl);
    }
  }
  
  // Instead of scaling the van with SVG transforms, we'll let the container handle sizing
  // This prevents issues with the van disappearing when zooming in
  // We've removed scaling calculations entirely as they were causing display issues
  
  // Build transformation string for proper orientation
  let transforms = [];
  
  // Add transformations in the correct order (SVG applies them right-to-left)
  // Rotation - applied last
  transforms.push(`rotate(${rotationAngle},64,64)`);
  
  // Flip - applied second
  if (shouldFlip) {
    transforms.push('scale(-1,1)');
  }
  
  // We've removed the scaling transform as it causes the van to disappear
  // The van will now size according to its container class
  
  const transformValue = transforms.join(' ');
  
  return (
    <svg 
      viewBox="0 0 128 128" 
      className={className}
      style={{
        filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))'
      }}
    >
      {/* All van elements with transformation applied */}
      <g transform={transformValue}>
        <g transform="translate(14, 24)">
          {/* Main body */}
          <path
            d="M0 60 C0 40 10 20 30 18 L80 18 C90 18 95 30 100 40 L100 60 C100 65 95 70 90 70 L10 70 C5 70 0 65 0 60Z"
            fill="white"
            stroke="#000000"
            strokeWidth="4"
          />

          {/* Roof */}
          <path
            d="M10 18 C20 15 80 15 90 18"
            fill="none"
            stroke="#000000"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Windows */}
          <rect x="12" y="25" width="20" height="15" rx="3" fill="white" stroke="#000000" strokeWidth="3" />
          <rect x="37" y="25" width="25" height="15" rx="3" fill="white" stroke="#000000" strokeWidth="3" />
          <path
            d="M67 25 L85 25 C88 30 90 35 90 40 L67 40 Z"
            fill="white"
            stroke="#000000"
            strokeWidth="3"
          />

          {/* Door handles */}
          <path d="M45 48 L50 48" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          <path d="M62 48 L67 48" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

          {/* Wheels */}
          <circle cx="20" cy="70" r="12" fill="white" stroke="#000000" strokeWidth="4" />
          <circle cx="20" cy="70" r="6" fill="white" stroke="#000000" strokeWidth="2" />
          <circle cx="20" cy="70" r="2" fill="#000000" />

          <circle cx="80" cy="70" r="12" fill="white" stroke="#000000" strokeWidth="4" />
          <circle cx="80" cy="70" r="6" fill="white" stroke="#000000" strokeWidth="2" />
          <circle cx="80" cy="70" r="2" fill="#000000" />

          {/* Ground lines for animation */}
          {animate && (
            <g>
              <path
                d="M10 95 L45 95"
                stroke="#333333"
                strokeWidth="3"
                strokeDasharray="8 8"
                style={{
                  animation: `${linesKeyframe} 0.8s linear infinite`,
                  opacity: 0.9
                }}
              />
              <path
                d="M65 95 L100 95"
                stroke="#333333"
                strokeWidth="3"
                strokeDasharray="8 8"
                style={{
                  animation: `${linesKeyframe} 0.8s linear infinite`,
                  opacity: 0.9
                }}
              />
            </g>
          )}

          {/* Lights */}
          <rect x="95" y="40" width="5" height="5" rx="1" fill="white" stroke="#000000" strokeWidth="2" />
          <rect x="0" y="40" width="5" height="5" rx="1" fill="white" stroke="#000000" strokeWidth="2" />

          {/* Bumpers */}
          <path d="M0 60 L-4 60" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
          <path d="M100 60 L104 60" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

          {/* Details */}
          <path d="M50 18 L50 10 L70 10 L70 18" fill="white" stroke="#000000" strokeWidth="3" />
          <path d="M55 70 L55 60 L65 60 L65 70" fill="none" stroke="#000000" strokeWidth="2" />
        </g>
      </g>
      
      {/* Wiggle animation overlay */}
      {animate && (
        <g 
          style={{ 
            animation: `${wiggleKeyframe} 1s ease-in-out infinite`,
            pointerEvents: 'none' 
          }}
        >
          <rect x="0" y="0" width="128" height="128" fill="transparent" />
        </g>
      )}
    </svg>
  );
};

export default VanIcon3D;
