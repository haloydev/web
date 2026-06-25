declare namespace App {
  interface Locals {
    runtime?: {
      env: Record<string, string | undefined>;
    };
  }
}

interface CacheStorage {
  readonly default: Cache;
}
