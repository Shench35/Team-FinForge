// CENTRAL CONFIGURATION FOR THE HACKATHON DEMO

// 1. Backend URLs
// For the demo, we prefer localhost if available, otherwise use ngrok
export const NODE_BACKEND_URL = "https://fond-dory-suitable.ngrok-free.app";
export const PYTHON_BACKEND_URL = "https://junkman-thrash-omission.ngrok-free.dev";

// 2. Demo Flags
export const DEMO_MODE = true; // Set to true to bypass strict payment/auth checks for the judges
export const BYPASS_PAYMENT = true; // Skip Squad redirects for the demo presentation
export const USE_LOCAL_BACKEND = false; // Toggle to true if running everything on localhost:8000

export const getBaseUrl = (type: 'node' | 'python') => {
  if (USE_LOCAL_BACKEND) {
    return type === 'node' ? "http://localhost:3000" : "http://localhost:8000";
  }
  return type === 'node' ? NODE_BACKEND_URL : PYTHON_BACKEND_URL;
};
