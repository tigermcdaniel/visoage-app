/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // jsPDF uses Node.js Worker internals that fail during SSR bundling — keep it server-external
  serverExternalPackages: ["jspdf", "fflate", "nodemailer"],
}

export default nextConfig
