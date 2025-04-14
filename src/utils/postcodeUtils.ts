/**
 * Utility functions for handling UK postcodes
 */

/**
 * Formats a UK postcode to standard format (e.g., "SW1A1AA" to "SW1A 1AA")
 * 
 * @param postcode - The postcode to format
 * @returns The formatted postcode or the original if it doesn't match UK format
 */
export function formatUKPostcode(postcode: string): string {
  if (!postcode) return postcode;
  
  // Remove all whitespace and make uppercase
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase();
  
  // UK postcodes are 5-8 characters after removing spaces
  if (cleaned.length < 5 || cleaned.length > 8) return postcode;
  
  // Format with a space in the correct position
  // UK postcodes have the format: Area District Sector Unit
  // The space comes between the district and sector parts
  const inwardCodeStart = cleaned.length - 3;
  const outwardCode = cleaned.substring(0, inwardCodeStart);
  const inwardCode = cleaned.substring(inwardCodeStart);
  
  return `${outwardCode} ${inwardCode}`;
}

/**
 * Validates if a string is in a valid UK postcode format
 * 
 * @param postcode - The postcode to validate
 * @returns Boolean indicating if the postcode is valid
 */
export function isValidUKPostcode(postcode: string): boolean {
  if (!postcode) return false;
  
  // UK postcode regex pattern (general format)
  // This follows the general format of UK postcodes
  const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
  
  return ukPostcodeRegex.test(postcode);
}
