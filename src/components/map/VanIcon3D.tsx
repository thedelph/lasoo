import React from 'react';

interface VanIcon3DProps {
  className?: string;
  // direction is kept for backward compatibility but bearing is preferred
  direction?: 'north' | 'northeast' | 'east' | 'southeast' | 'south' | 'southwest' | 'west' | 'northwest';
  bearing?: number; // Exact bearing in degrees (0-360)
  zoom?: number; // Current map zoom level
  minZoom?: number; // Minimum zoom level for scaling
  maxZoom?: number; // Maximum zoom level for scaling
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
  zoom = 15, // Default zoom level
  minZoom = 10, // Default minimum zoom (more zoomed out)
  maxZoom = 18 // Default maximum zoom (more zoomed in)
}) => {
  // Always use the bearing directly - simplifies the logic
  const normalizedBearing = ((bearing % 360) + 360) % 360;
  
  // Debug info
  console.log(`VanIcon3D received bearing: ${bearing}°, normalized to: ${normalizedBearing}°`);
  
  // Directly map bearing ranges to orientations
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
  
  // Get the orientation based on bearing
  const vanOrientation = getVanOrientation();
  
  // Ensure we use this orientation for rendering
  console.log(`VanIcon3D rendering orientation: ${vanOrientation} for bearing: ${normalizedBearing}°`);
  
  // Calculate the scaling factor based on zoom level
  const calculateScale = () => {
    // Scale the icon based on zoom level
    // We want the icon to be larger as we zoom in, with constraints
    const normalizedZoom = Math.max(minZoom, Math.min(zoom, maxZoom));
    const zoomRange = maxZoom - minZoom;
    const zoomFactor = (normalizedZoom - minZoom) / zoomRange;
    
    // Scale from 0.8 to 1.5 based on zoom
    const scale = 0.8 + (zoomFactor * 0.7);
    return scale;
  };
  
  const scaleFactor = calculateScale();

  // Render the SVG icon with the new simplified design
  // Use CSS transforms for rotation instead of different SVGs for each orientation
  const renderVan = (orientation: string) => {
    // Calculate rotation angle based on orientation
    let rotationAngle = 0;
    let flipX = false;
    
    switch (orientation) {
      case 'north':
        rotationAngle = -90; // Rotate the east-facing van counter-clockwise
        break;
      case 'south':
        rotationAngle = 90; // Rotate the east-facing van clockwise
        break;
      case 'east':
        rotationAngle = 0; // Default orientation, no rotation
        break;
      case 'west':
        rotationAngle = 0;
        flipX = true; // Mirror horizontally
        break;
      case 'northeast':
        rotationAngle = -45;
        break;
      case 'southeast':
        rotationAngle = 45;
        break;
      case 'southwest':
        rotationAngle = 45;
        flipX = true;
        break;
      case 'northwest':
        rotationAngle = -45;
        flipX = true;
        break;
      default:
        console.warn(`Unknown orientation: ${orientation}, defaulting to east`);
    }
    
    // Base SVG structure
    return React.createElement(
      'svg',
      {
        viewBox: "0 0 128 128",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        className: className,
        style: {
          filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))',
          transform: `scale(${scaleFactor}) ${flipX ? 'scaleX(-1)' : ''} rotate(${rotationAngle}deg)`,
          transformOrigin: 'center'
        }
      },
      renderVanSVG()
    );
  };

  // Render the base van SVG (east-facing)
  // All other orientations are derived from this using CSS transforms
  const renderVanSVG = () => {
    return React.createElement(
      'g',
      { transform: "translate(14, 24)" },
      [
        // Main body outline
        React.createElement(
          'path',
          {
            key: "body",
            d: "M0 60 C0 40 10 20 30 18 L80 18 C90 18 95 30 100 40 L100 60 C100 65 95 70 90 70 L10 70 C5 70 0 65 0 60Z",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        
        // Roof line
        React.createElement(
          'path',
          {
            key: "roof",
            d: "M10 18 C20 15 80 15 90 18",
            fill: "none",
            stroke: "#000000",
            strokeWidth: "4",
            strokeLinecap: "round"
          }
        ),
        
        // Windows
        React.createElement(
          'rect',
          {
            key: "window-1",
            x: "12",
            y: "25",
            width: "20",
            height: "15",
            rx: "3",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        React.createElement(
          'rect',
          {
            key: "window-2",
            x: "37",
            y: "25",
            width: "25",
            height: "15",
            rx: "3",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        React.createElement(
          'path',
          {
            key: "window-3",
            d: "M67 25 L85 25 C88 30 90 35 90 40 L67 40 Z",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        
        // Door handles
        React.createElement(
          'path',
          {
            key: "handle-1",
            d: "M45 48 L50 48",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        React.createElement(
          'path',
          {
            key: "handle-2",
            d: "M62 48 L67 48",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        
        // Left wheel
        React.createElement(
          'circle',
          {
            key: "wheel-left-outer",
            cx: "20",
            cy: "70",
            r: "12",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-inner",
            cx: "20",
            cy: "70",
            r: "6",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-center",
            cx: "20",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        
        // Right wheel
        React.createElement(
          'circle',
          {
            key: "wheel-right-outer",
            cx: "80",
            cy: "70",
            r: "12",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-inner",
            cx: "80",
            cy: "70",
            r: "6",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-center",
            cx: "80",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        
        // Front lights
        React.createElement(
          'rect',
          {
            key: "front-light",
            x: "95",
            y: "40",
            width: "5",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        
        // Rear lights
        React.createElement(
          'rect',
          {
            key: "rear-light",
            x: "0",
            y: "40",
            width: "5",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        
        // Bumpers
        React.createElement(
          'path',
          {
            key: "bumper-front",
            d: "M0 60 L-4 60",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        React.createElement(
          'path',
          {
            key: "bumper-rear",
            d: "M100 60 L104 60",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        
        // Improved details
        React.createElement(
          'path',
          {
            key: "roof-detail",
            d: "M50 18 L50 10 L70 10 L70 18",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        React.createElement(
          'path',
          {
            key: "door-detail",
            d: "M55 70 L55 60 L65 60 L65 70",
            fill: "none",
            stroke: "#000000",
            strokeWidth: "2"
          }
        )
      ]
    );
  };

  // We no longer need these individual orientation functions since we're using CSS transforms
        // Main body outline
        React.createElement(
          'path',
          {
            key: "body",
            d: "M0 60 C0 40 10 20 30 18 L80 18 C90 18 95 30 100 40 L100 60 C100 65 95 70 90 70 L10 70 C5 70 0 65 0 60Z",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        
        // Roof line - integrated with van body
        React.createElement(
          'path',
          {
            key: "roof",
            d: "M10 18 C20 15 80 15 90 18",
            fill: "none",
            stroke: "#000000", 
            strokeWidth: "4",
            strokeLinecap: "round"
          }
        ),
        
        // Windows
        React.createElement(
          'rect',
          {
            key: "window-1",
            x: "12",
            y: "25",
            width: "20",
            height: "15",
            rx: "3",
            fill: "white", 
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        React.createElement(
          'rect',
          {
            key: "window-2",
            x: "37",
            y: "25",
            width: "25",
            height: "15",
            rx: "3",
            fill: "white", 
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        React.createElement(
          'path',
          {
            key: "window-3",
            d: "M67 25 L85 25 C88 30 90 35 90 40 L67 40 Z",
            fill: "white", 
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        
        // Door handles
        React.createElement(
          'path',
          {
            key: "handle-1",
            d: "M45 48 L50 48",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        React.createElement(
          'path',
          {
            key: "handle-2",
            d: "M62 48 L67 48",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        
        // Left wheel
        React.createElement(
          'circle',
          {
            key: "wheel-left-outer",
            cx: "20",
            cy: "70",
            r: "12",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-inner",
            cx: "20",
            cy: "70",
            r: "6",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-center",
            cx: "20",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        
        // Right wheel
        React.createElement(
          'circle',
          {
            key: "wheel-right-outer",
            cx: "80",
            cy: "70",
            r: "12",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-inner",
            cx: "80",
            cy: "70",
            r: "6",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-center",
            cx: "80",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        
        // Front lights
        React.createElement(
          'rect',
          {
            key: "front-light",
            x: "2",
            y: "40",
            width: "5",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        
        // Rear lights
        React.createElement(
          'rect',
          {
            key: "rear-light",
            x: "95",
            y: "40",
            width: "5",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        
        // Bumpers
        React.createElement(
          'path',
          {
            key: "bumper-front",
            d: "M0 60 L-4 60",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        React.createElement(
          'path',
          {
            key: "bumper-rear",
            d: "M100 60 L104 60",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        )
      ]
    );
  };
  
  // North-facing van (front view)
  const renderNorthFacingVan = () => {
    return React.createElement(
      'g',
      { transform: "translate(14, 24)" },
      [
        // Shadow for 3D effect
        React.createElement(
          'ellipse',
          {
            key: "shadow",
            cx: "50",
            cy: "85",
            rx: "25",
            ry: "7",
            fill: "rgba(0,0,0,0.2)"
          }
        ),
        // Main body outline (front view - narrower)
        React.createElement(
          'path',
          {
            key: "body",
            d: "M25 20 L75 20 C80 20 85 25 85 35 L85 70 C85 75 80 80 75 80 L25 80 C20 80 15 75 15 70 L15 35 C15 25 20 20 25 20 Z",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        
        // Roof line
        React.createElement(
          'path',
          {
            key: "roof",
            d: "M25 20 C40 15 60 15 75 20",
            fill: "none",
            stroke: "#000000", 
            strokeWidth: "4",
            strokeLinecap: "round"
          }
        ),
        
        // Windshield
        React.createElement(
          'rect',
          {
            key: "windshield",
            x: "30",
            y: "25",
            width: "40",
            height: "15",
            rx: "3",
            fill: "white", 
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        
        // Headlights
        React.createElement(
          'rect',
          {
            key: "headlight-left",
            x: "25",
            y: "45",
            width: "10",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'rect',
          {
            key: "headlight-right",
            x: "65",
            y: "45",
            width: "10",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        
        // Wheels (front view - both visible)
        React.createElement(
          'circle',
          {
            key: "wheel-left-outer",
            cx: "30",
            cy: "70",
            r: "10",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-inner",
            cx: "30",
            cy: "70",
            r: "5",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-center",
            cx: "30",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-outer",
            cx: "70",
            cy: "70",
            r: "10",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-inner",
            cx: "70",
            cy: "70",
            r: "5",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-center",
            cx: "70",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        
        // Bumper
        React.createElement(
          'path',
          {
            key: "bumper",
            d: "M20 60 L80 60",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        )
      ]
    );
  };
  
  // South-facing van (rear view)
  const renderSouthFacingVan = () => {
    return React.createElement(
      'g',
      { transform: "translate(14, 24)" },
      [
        // Shadow for 3D effect
        React.createElement(
          'ellipse',
          {
            key: "shadow",
            cx: "50",
            cy: "85",
            rx: "25",
            ry: "7",
            fill: "rgba(0,0,0,0.2)"
          }
        ),
        // Main body outline (rear view - narrower)
        React.createElement(
          'path',
          {
            key: "body",
            d: "M25 20 L75 20 C80 20 85 25 85 35 L85 70 C85 75 80 80 75 80 L25 80 C20 80 15 75 15 70 L15 35 C15 25 20 20 25 20 Z",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        
        // Roof line
        React.createElement(
          'path',
          {
            key: "roof",
            d: "M25 20 C40 15 60 15 75 20",
            fill: "none",
            stroke: "#000000", 
            strokeWidth: "4",
            strokeLinecap: "round"
          }
        ),
        
        // Rear window
        React.createElement(
          'rect',
          {
            key: "rear-window",
            x: "30",
            y: "25",
            width: "40",
            height: "15",
            rx: "3",
            fill: "white", 
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        
        // Taillights
        React.createElement(
          'rect',
          {
            key: "taillight-left",
            x: "25",
            y: "45",
            width: "10",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'rect',
          {
            key: "taillight-right",
            x: "65",
            y: "45",
            width: "10",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        
        // Wheels (rear view - both visible)
        React.createElement(
          'circle',
          {
            key: "wheel-left-outer",
            cx: "30",
            cy: "70",
            r: "10",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-inner",
            cx: "30",
            cy: "70",
            r: "5",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-center",
            cx: "30",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-outer",
            cx: "70",
            cy: "70",
            r: "10",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-inner",
            cx: "70",
            cy: "70",
            r: "5",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-center",
            cx: "70",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        
        // Bumper
        React.createElement(
          'path',
          {
            key: "bumper",
            d: "M20 60 L80 60",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        )
      ]
    );
  };
  
  // Helper for diagonal views (rotated version of cardinal directions)
  const renderRotatedVan = (direction: string, angle: number) => {
    let baseDirection;
    
    // Determine which cardinal direction to use as base
    if (direction === 'northeast' || direction === 'northwest') {
      baseDirection = 'north';
    } else {
      baseDirection = 'south';
    }
    
    // Use the provided angle parameter directly
    const rotationAngle = angle % 90 === 45 ? 45 : -45;
    
    // Render the base direction van inside a rotated group
    return React.createElement(
      'g',
      { 
        transform: `rotate(${rotationAngle}, 50, 50)` 
      },
      baseDirection === 'north' ? renderNorthFacingVan().props.children : renderSouthFacingVan().props.children
    );
  };
  
  // East-facing van (original orientation)
  const renderEastFacingVan = () => {
    return React.createElement(
      'g',
      { transform: "translate(14, 24)" },
      [
        // Shadow for 3D effect
        React.createElement(
          'ellipse',
          {
            key: "shadow",
            cx: "50",
            cy: "85",
            rx: "48",
            ry: "7",
            fill: "rgba(0,0,0,0.2)"
          }
        ),
        // Main body outline
        React.createElement(
          'path',
          {
            key: "body",
            d: "M0 60 C0 40 10 20 30 18 L80 18 C90 18 95 30 100 40 L100 60 C100 65 95 70 90 70 L10 70 C5 70 0 65 0 60Z",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        
        // Roof line - integrated with van body
        React.createElement(
          'path',
          {
            key: "roof",
            d: "M10 18 C20 15 80 15 90 18",
            fill: "none",
            stroke: "#000000", 
            strokeWidth: "4",
            strokeLinecap: "round"
          }
        ),
        
        // Windows
        React.createElement(
          'rect',
          {
            key: "window-1",
            x: "12",
            y: "25",
            width: "20",
            height: "15",
            rx: "3",
            fill: "white", 
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        React.createElement(
          'rect',
          {
            key: "window-2",
            x: "37",
            y: "25",
            width: "25",
            height: "15",
            rx: "3",
            fill: "white", 
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        React.createElement(
          'path',
          {
            key: "window-3",
            d: "M67 25 L85 25 C88 30 90 35 90 40 L67 40 Z",
            fill: "white", 
            stroke: "#000000",
            strokeWidth: "3"
          }
        ),
        
        // Door handles
        React.createElement(
          'path',
          {
            key: "handle-1",
            d: "M45 48 L50 48",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        React.createElement(
          'path',
          {
            key: "handle-2",
            d: "M62 48 L67 48",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        
        // Left wheel
        React.createElement(
          'circle',
          {
            key: "wheel-left-outer",
            cx: "20",
            cy: "70",
            r: "12",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-inner",
            cx: "20",
            cy: "70",
            r: "6",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-left-center",
            cx: "20",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        
        // Right wheel
        React.createElement(
          'circle',
          {
            key: "wheel-right-outer",
            cx: "80",
            cy: "70",
            r: "12",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "4"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-inner",
            cx: "80",
            cy: "70",
            r: "6",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        React.createElement(
          'circle',
          {
            key: "wheel-right-center",
            cx: "80",
            cy: "70",
            r: "2",
            fill: "#000000"
          }
        ),
        
        // Front lights
        React.createElement(
          'rect',
          {
            key: "front-light",
            x: "2",
            y: "40",
            width: "5",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        
        // Rear lights
        React.createElement(
          'rect',
          {
            key: "rear-light",
            x: "95",
            y: "40",
            width: "5",
            height: "5",
            rx: "1",
            fill: "white",
            stroke: "#000000",
            strokeWidth: "2"
          }
        ),
        
        // Bumpers
        React.createElement(
          'path',
          {
            key: "bumper-front",
            d: "M0 60 L-4 60",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        ),
        React.createElement(
          'path',
          {
            key: "bumper-rear",
            d: "M100 60 L104 60",
            stroke: "#000000",
            strokeWidth: "3",
            strokeLinecap: "round"
          }
        )
      ]
    );
  };

  // Log the orientation and bearing one last time before rendering
  console.log(`Final rendering with orientation: ${vanOrientation} from bearing: ${normalizedBearing}°`);
  
  // Return the final component
  return renderVan(vanOrientation);
};

export default VanIcon3D;
