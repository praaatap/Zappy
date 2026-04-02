const invalidKeys = new Set([
  "",
  "pk_test_your-clerk-key",
  "sk_test_your-clerk-secret",
  "pk_test_...",
  "sk_test_...",
]);

export function hasClerkPublishableKey() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return false;
  }

  if (invalidKeys.has(publishableKey)) {
    return false;
  }

  return !publishableKey.includes("your-clerk-key");
}

export const isClerkConfigured = hasClerkPublishableKey();