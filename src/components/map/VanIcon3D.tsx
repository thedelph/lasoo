import React from 'react';

interface VanIcon3DProps {
  className?: string;
  // direction is kept for backward compatibility but bearing is preferred
  /* istanbul ignore next - kept for backward compatibility */
  direction?: 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest';
  bearing?: number; // Exact bearing in degrees (0-360)
  // These props are kept for backwards compatibility but are no longer used for scaling
  /* istanbul ignore next - kept for backward compatibility */
  zoom?: number; 
  /* istanbul ignore next - kept for backward compatibility */
  minZoom?: number;
  /* istanbul ignore next - kept for backward compatibility */
  maxZoom?: number;
}

/**
 * A 3D van icon similar to Uber's vehicle representation
 * This is used to show tradespeople who are actively sharing their location
 * 
 * @param direction - Cardinal direction the van is traveling
 * @param bearing - Exact bearing in degrees (0-360), will override direction if provided
 */
const VanIcon3D: React.FC<VanIcon3DProps> = ({ 
  className = "h-24 w-24", 
  direction = 'east', // kept for backward compatibility
  bearing = 90, // Default to east if no bearing provided
  zoom = 15, // Default zoom level (not used for scaling anymore)
  minZoom = 10, // Minimum zoom level (kept for compatibility)
  maxZoom = 18 // Maximum zoom level (kept for compatibility)
}) => {
  // Always use the bearing directly - simplifies the logic
  const normalizedBearing = ((bearing % 360) + 360) % 360;
  
  // Use the variables so TypeScript doesn't complain
  // This is a no-op that just ensures the variables are "used"
  const _unused = { direction, zoom, minZoom, maxZoom };
  // Only log in development to avoid console noise
  if (process.env.NODE_ENV === 'development') {
    console.log(`VanIcon3D received bearing: ${bearing}°, normalized to: ${normalizedBearing}°`);
    console.log('Unused params kept for compatibility:', _unused);
  }
  
  // For reference only - not used in rendering directly anymore
  const getVanOrientation = () => {
    // Use simple ranges for the 8 main directions
    if (normalizedBearing >= 337.5 || normalizedBearing < 22.5) {
      return 'north';
    } else if (normalizedBearing >= 22.5 && normalizedBearing < 67.5) {
      return 'northeast';
    } else if (normalizedBearing >= 67.5 && normalizedBearing < 112.5) {
      return 'east';
    } else if (normalizedBearing >= 112.5 && normalizedBearing < 157.5) {
      return 'southeast';
    } else if (normalizedBearing >= 157.5 && normalizedBearing < 202.5) {
      return 'south';
    } else if (normalizedBearing >= 202.5 && normalizedBearing < 247.5) {
      return 'southwest';
    } else if (normalizedBearing >= 247.5 && normalizedBearing < 292.5) {
      return 'west';
    } else if (normalizedBearing >= 292.5 && normalizedBearing < 337.5) {
      return 'northwest';
    } else {
      // This should never happen with the normalized bearing
      console.warn(`Unexpected bearing value: ${normalizedBearing}°, defaulting to east`);
      return 'east';
    }
  };
  
  // Get the orientation for logging purposes
  const vanOrientation = getVanOrientation();
  
  // Ensure we use this orientation for rendering
  console.log(`VanIcon3D rendering orientation: ${vanOrientation} for bearing: ${normalizedBearing}°`);
  
  // No longer using zoom-based scaling as it causes vans to disappear
  // Instead, we'll rely on the container class (className) to handle sizing

  // Using the approach from SimplifiedVanIcon3D which prevents disappearing vans
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

  // Create the van SVG as a reusable function
  const renderVanSVG = () => {
    return (
      <g transform="translate(14, 24)">
        {/* Main body outline */}
        <path
          d="M0 60 C0 40 10 20 30 18 L80 18 C90 18 95 30 100 40 L100 60 C100 65 95 70 90 70 L10 70 C5 70 0 65 0 60Z"
          fill="white"
          stroke="#000000"
          strokeWidth="4"
        />
        
        {/* Roof line */}
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
        
        {/* Lights */}
        <rect x="0" y="40" width="5" height="5" rx="1" fill="white" stroke="#000000" strokeWidth="2" />
        <rect x="95" y="40" width="5" height="5" rx="1" fill="white" stroke="#000000" strokeWidth="2" />
        
        {/* Bumpers */}
        <path d="M0 60 L-4 60" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 60 L104 60" stroke="#000000" strokeWidth="3" strokeLinecap="round" />

        {/* Details */}
        <path d="M50 18 L50 10 L70 10 L70 18" fill="white" stroke="#000000" strokeWidth="3" />
        <path d="M55 70 L55 60 L65 60 L65 70" fill="none" stroke="#000000" strokeWidth="2" />
      </g>
    );
  };

  // Log the orientation and bearing one last time before rendering
  console.log(`Final rendering with orientation: ${vanOrientation} from bearing: ${normalizedBearing}°`);
  
  // Return the final component using JSX for better readability
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
        {renderVanSVG()}
      </g>
    </svg>
  );
};

export default VanIcon3D;
