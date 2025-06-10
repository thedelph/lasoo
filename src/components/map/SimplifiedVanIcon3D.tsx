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
  // Each van needs to have a truly unique bearing to avoid React optimization issues
  // We'll ensure the bearing is a number and convert it to a string to compare in equality checks
  const bearingValue = typeof bearing === 'number' ? bearing : 90;
  
  // Normalize the bearing to 0-360 range
  const normalizedBearing = ((bearingValue % 360) + 360) % 360;
  
  // Create angle of rotation - we want vans to point in their direction of travel
  // For a van, we want 0° to be facing right (east), 90° to be facing down (south), etc.
  
  // First, determine if we're in the western hemisphere (left half of the circle)
  const isWesternDirection = normalizedBearing > 180 && normalizedBearing < 360;
  
  // Calculate the rotation needed to orient the van correctly
  // For eastern directions, we calculate how much we need to rotate from east (90°)
  // For western directions, we calculate how much we need to rotate from west (270°) and flip the van
  let rotationDegrees;
  if (isWesternDirection) {
    // For western directions, measure angle from 270° (west)
    rotationDegrees = normalizedBearing - 270;
  } else {
    // For eastern directions, measure angle from 90° (east)
    rotationDegrees = normalizedBearing - 90;
  }
  
  // Ensure the wheels always stay at the bottom by limiting rotation to ±90°
  if (rotationDegrees > 90) rotationDegrees -= 180;
  if (rotationDegrees < -90) rotationDegrees += 180;
  
  // Log the transformation details
  // console.log(`Van: bearing=${normalizedBearing}°, flip=${isWesternDirection}, rotation=${rotationDegrees}°`);
  
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
  
  // For SVG transforms, the order is important and they are applied from right to left
  // So we need to create our transform string in reverse order of how we want them applied
  
  // First create an array to hold our transformations
  let transforms = [];
  
  // 1. Flip horizontally if needed (this should be applied first, before rotation)
  if (isWesternDirection) {
    transforms.unshift('scale(-1,1) translate(-128,0)'); // Scale and translate to keep centered
  }
  
  // 2. Then apply rotation (applied after flipping)
  transforms.unshift(`rotate(${rotationDegrees},64,64)`);
  
  // Join all transforms with spaces
  const transformValue = transforms.join(' ');
  

  
  return (
    <svg 
      viewBox="0 0 128 128" 
      className={className}
      style={{
        filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))'
      }}
    >
      {/* Outer group for main orientation (rotation/flip) */}
      <g transform={transformValue}>
        {/* Inner group for positioning and wiggle animation */}
        <g 
          transform="translate(14, 24)"
          style={animate ? { 
            animation: `${wiggleKeyframe} 1s ease-in-out infinite`,
            // CSS transforms on SVG elements can be tricky with transform-origin.
            // Default is 0,0 of the element's coordinate system.
            // The van paths are drawn relative to this inner group's origin after its own translate(14,24).
            // The small wiggle translations/rotations should visually work as expected.
          } : undefined}
        >
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
      {/* Animation is now applied directly to the van, no need for transparent overlay */}
    </svg>
  );
};

export default VanIcon3D;
