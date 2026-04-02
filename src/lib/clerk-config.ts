const invalidKeys = new Set([
  "",
  "pk_test_your-clerk-key",
  "sk_test_your-clerk-secret",
  "pk_test_...",
  "sk_test_...",
]);

const clerkPublishableKeyPattern = /^pk_(test|live)_[A-Za-z0-9]+$/;

export function hasClerkPublishableKey() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return false;
  }

  if (invalidKeys.has(publishableKey)) {
    return false;
  }

  if (publishableKey.includes("your-clerk-key")) {
    return false;
  }

  return clerkPublishableKeyPattern.test(publishableKey);
}

export const isClerkConfigured = hasClerkPublishableKey();