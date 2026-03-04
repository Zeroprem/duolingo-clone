export const isClerkConfigured =
  (Boolean(process.env.CLERK_SECRET_KEY) || Boolean(process.env.CLERK_API_KEY)) &&
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
