/**
 * @file LiveIndicator.tsx
 * @description A reusable component for displaying a pulsing green "LIVE" indicator
 * Used to show when a tradesperson is actively sharing their current location
 */

interface LiveIndicatorProps {
  status: 'live' | 'last_live';
  lastLiveTimestamp?: string; // Formatted timestamp string
}

export default function LiveIndicator({ status, lastLiveTimestamp }: LiveIndicatorProps) {
  const isTrulyLive = status === 'live';

  const dotColor = isTrulyLive ? 'bg-green-500' : 'bg-amber-500';
  const textColor = isTrulyLive ? 'text-green-600' : 'text-amber-600';
  
  let displayText = isTrulyLive ? 'LIVE' : 'LAST LIVE';
  if (!isTrulyLive && lastLiveTimestamp) {
    displayText += ` ${lastLiveTimestamp}`;
  }

  return (
    <div className="inline-flex items-center">
      <div className="relative">
        {/* Pulsing circle animation - only for truly live */}
        {isTrulyLive && (
          <div className={`absolute w-2.5 h-2.5 ${dotColor} rounded-full opacity-75 animate-ping`}></div>
        )}
        {/* Solid circle */}
        <div className={`relative w-2.5 h-2.5 ${dotColor} rounded-full`}></div>
      </div>
      <span className={`ml-1.5 text-xs font-bold ${textColor}`}>{displayText}</span>
    </div>
  );
}
