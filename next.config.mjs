/** @type {import('next').NextConfig} */

const securityHeaders = [
  // 2 years HSTS, allow preload list registration
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // No iframing — defends against clickjacking + impersonation as "official"
  { key: "X-Frame-Options", value: "DENY" },
  // No MIME sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send origin only on cross-origin nav, full referrer on same-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny browser feature APIs we'll never need
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
