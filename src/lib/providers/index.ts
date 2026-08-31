// Provider Registration
import { ProviderRegistry } from '../platform-provider';
import { LeetCodeProvider } from '../leetcode-provider';

// Register all available providers
ProviderRegistry.register(new LeetCodeProvider());

// Export for use
export { ProviderRegistry } from '../platform-provider';
export { LeetCodeProvider } from '../leetcode-provider';