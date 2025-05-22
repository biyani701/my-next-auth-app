/**
 * Utility function to get the correct documentation URL based on the environment
 * 
 * @param path The path to the documentation page (e.g., '/intro', '/privacy-policy')
 * @returns The full URL to the documentation page
 */
export function getDocsUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // In development, use localhost:3030
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:3030/${cleanPath}`;
  }
  
  // In production, use the GitHub Pages URL
  return `http://www.biyani.xyz/my-next-auth-app/${cleanPath}`;
}

/**
 * Utility function to get the base URL of the application
 * 
 * @returns The base URL of the application
 */
export function getAppBaseUrl(): string {
  // In development, use localhost:3000
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // If VERCEL_URL is available (for preview deployments)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Default production URL
  return 'https://my-next-auth-app-ten.vercel.app';
}
