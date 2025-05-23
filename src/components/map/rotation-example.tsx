import { VanIconRight } from "./path-to-icon" // Assuming VanIconRight is an imported component

const RotatedVanIcons = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {/* Up - Right icon rotated 90° counter-clockwise */}
      <div className="flex flex-col items-center">
        <h3 className="mb-2 text-lg font-medium">Up (from Right)</h3>
        <div className="transform -rotate-90">
          <VanIconRight />
        </div>
      </div>

      {/* Down - Right icon rotated 90° clockwise */}
      <div className="flex flex-col items-center">
        <h3 className="mb-2 text-lg font-medium">Down (from Right)</h3>
        <div className="transform rotate-90">
          <VanIconRight />
        </div>
      </div>
    </div>
  )
}

// Note: The above is just a conceptual example.
// For proper SVG rotation, you might want to adjust the viewBox and transforms
// to ensure the icon remains centered after rotation.
