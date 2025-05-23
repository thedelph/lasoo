const VanIconRight = () => (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
      <g transform="translate(14, 24)">
        {/* Main body outline */}
        <path
          d="M0 60 
             C0 40 10 20 30 18
             L80 18
             C90 18 95 30 100 40
             L100 60
             C100 65 95 70 90 70
             L10 70
             C5 70 0 65 0 60Z"
          fill="white"
          stroke="#000000"
          strokeWidth="4"
        />
  
        {/* Roof line */}
        <path
          d="M10 18
             C20 15 80 15 90 18"
          fill="none"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
        />
  
        {/* Windows */}
        <rect x="12" y="25" width="20" height="15" rx="3" fill="white" stroke="#000000" strokeWidth="3" />
        <rect x="37" y="25" width="25" height="15" rx="3" fill="white" stroke="#000000" strokeWidth="3" />
        <path
          d="M67 25
             L85 25
             C88 30 90 35 90 40
             L67 40
             Z"
          fill="white"
          stroke="#000000"
          strokeWidth="3"
        />
  
        {/* Door handles */}
        <path d="M45 48 L50 48" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        <path d="M62 48 L67 48" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
  
        {/* Left wheel */}
        <circle cx="20" cy="70" r="12" fill="white" stroke="#000000" strokeWidth="4" />
        <circle cx="20" cy="70" r="6" fill="white" stroke="#000000" strokeWidth="2" />
        <circle cx="20" cy="70" r="2" fill="#000000" />
  
        {/* Right wheel */}
        <circle cx="80" cy="70" r="12" fill="white" stroke="#000000" strokeWidth="4" />
        <circle cx="80" cy="70" r="6" fill="white" stroke="#000000" strokeWidth="2" />
        <circle cx="80" cy="70" r="2" fill="#000000" />
  
        {/* Front lights */}
        <rect x="95" y="40" width="5" height="5" rx="1" fill="white" stroke="#000000" strokeWidth="2" />
  
        {/* Rear lights */}
        <rect x="0" y="40" width="5" height="5" rx="1" fill="white" stroke="#000000" strokeWidth="2" />
  
        {/* Bumpers */}
        <path d="M0 60 L-4 60" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 60 L104 60" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
  
        {/* Improved details */}
        <path d="M50 18 L50 10 L70 10 L70 18" fill="white" stroke="#000000" strokeWidth="3" />
        <path d="M55 70 L55 60 L65 60 L65 70" fill="none" stroke="#000000" strokeWidth="2" />
      </g>
    </svg>
  )
  
  const VanIconLeft = () => (
    <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" width="128" height="128">
      <g transform="translate(14, 24) scale(-1, 1) translate(-100, 0)">
        {/* Main body outline */}
        <path
          d="M0 60 
             C0 40 10 20 30 18
             L80 18
             C90 18 95 30 100 40
             L100 60
             C100 65 95 70 90 70
             L10 70
             C5 70 0 65 0 60Z"
          fill="white"
          stroke="#000000"
          strokeWidth="4"
        />
  
        {/* Roof line */}
        <path
          d="M10 18
             C20 15 80 15 90 18"
          fill="none"
          stroke="#000000"
          strokeWidth="4"
          strokeLinecap="round"
        />
  
        {/* Windows */}
        <rect x="12" y="25" width="20" height="15" rx="3" fill="white" stroke="#000000" strokeWidth="3" />
        <rect x="37" y="25" width="25" height="15" rx="3" fill="white" stroke="#000000" strokeWidth="3" />
        <path
          d="M67 25
             L85 25
             C88 30 90 35 90 40
             L67 40
             Z"
          fill="white"
          stroke="#000000"
          strokeWidth="3"
        />
  
        {/* Door handles */}
        <path d="M45 48 L50 48" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        <path d="M62 48 L67 48" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
  
        {/* Left wheel */}
        <circle cx="20" cy="70" r="12" fill="white" stroke="#000000" strokeWidth="4" />
        <circle cx="20" cy="70" r="6" fill="white" stroke="#000000" strokeWidth="2" />
        <circle cx="20" cy="70" r="2" fill="#000000" />
  
        {/* Right wheel */}
        <circle cx="80" cy="70" r="12" fill="white" stroke="#000000" strokeWidth="4" />
        <circle cx="80" cy="70" r="6" fill="white" stroke="#000000" strokeWidth="2" />
        <circle cx="80" cy="70" r="2" fill="#000000" />
  
        {/* Front lights */}
        <rect x="95" y="40" width="5" height="5" rx="1" fill="white" stroke="#000000" strokeWidth="2" />
  
        {/* Rear lights */}
        <rect x="0" y="40" width="5" height="5" rx="1" fill="white" stroke="#000000" strokeWidth="2" />
  
        {/* Bumpers */}
        <path d="M0 60 L-4 60" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        <path d="M100 60 L104 60" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
  
        {/* Improved details */}
        <path d="M50 18 L50 10 L70 10 L70 18" fill="white" stroke="#000000" strokeWidth="3" />
        <path d="M55 70 L55 60 L65 60 L65 70" fill="none" stroke="#000000" strokeWidth="2" />
      </g>
    </svg>
  )
  
  const SimplifiedVanIcons = () => {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex flex-col items-center">
          <h3 className="mb-2 text-lg font-medium">Right</h3>
          <VanIconRight />
        </div>
        <div className="flex flex-col items-center">
          <h3 className="mb-2 text-lg font-medium">Left</h3>
          <VanIconLeft />
        </div>
      </div>
    )
  }
  
  export default SimplifiedVanIcons
  