/**
 * @file LiveIndicator.tsx
 * @description A reusable component for displaying a pulsing green "LIVE" indicator
 * Used to show when a tradesperson is actively sharing their current location
 */

export default function LiveIndicator() {
  return (
    <div className="inline-flex items-center">
      <div className="relative">
        {/* Pulsing circle animation */}
        <div className="absolute w-2.5 h-2.5 bg-green-500 rounded-full opacity-75 animate-ping"></div>
        {/* Solid circle */}
        <div className="relative w-2.5 h-2.5 bg-green-500 rounded-full"></div>
      </div>
      <span className="ml-1.5 text-xs font-bold text-green-600">LIVE</span>
    </div>
  );
}
