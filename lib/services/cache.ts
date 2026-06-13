import { CACHE_TTL } from "@/lib/constants/config";

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

class CacheService {
  private cache: Map<string, CacheEntry> = new Map();

  set(key: string, data: unknown, ttl: number = CACHE_TTL.analytics): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
    });
  }

  get(key: string): unknown | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const keys = Array.from(this.cache.keys()).filter((key) => key.includes(pattern));
    keys.forEach((key) => this.cache.delete(key));
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.timestamp) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const cacheService = new CacheService();
