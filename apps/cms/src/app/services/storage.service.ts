import { inject, Injectable, InjectionToken } from '@angular/core';
import type { LocalStorage, SchemaKeys } from '~/types';

const STORAGE_KEY_PREFIX = 'CMS_';
export const STORAGE_TOKEN = new InjectionToken<Storage>('localStorage Injection Token');

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  readonly #storage = inject(STORAGE_TOKEN);

  isAvailable(): boolean {
    try {
      return typeof window !== 'undefined' && 'localStorage' in window && this.#storage !== null;
    } catch (_) {
      return false;
    }
  }

  get<T extends SchemaKeys>(key: T): NonNullable<LocalStorage[T]> | undefined {
    if (!this.isAvailable()) {
      return undefined;
    }

    const data = this.#storage.getItem(STORAGE_KEY_PREFIX + key);
    if (data === null) {
      return undefined;
    }

    try {
      return JSON.parse(data) satisfies NonNullable<LocalStorage[T]>;
    } catch (_) {
      return JSON.parse(JSON.stringify(data)) satisfies NonNullable<LocalStorage[T]>;
    }
  }

  getAll(): LocalStorage {
    if (!this.isAvailable()) {
      return {};
    }

    const data: LocalStorage = {};

    for (const [key, value] of Object.entries(this.#storage)) {
      if (!key.startsWith(STORAGE_KEY_PREFIX)) {
        continue;
      }

      const storageKey = key.slice(STORAGE_KEY_PREFIX.length) as SchemaKeys;
      if (!storageKey) {
        // Not allowed to access value of key that has nothing after the prefix.
        continue;
      }

      try {
        data[storageKey] = JSON.parse(value);
      } catch (_) {
        data[storageKey] = JSON.parse(JSON.stringify(value));
        continue;
      }
    }

    return data;
  }

  set<T extends SchemaKeys>(key: T, value: LocalStorage[T]) {
    if (!this.isAvailable()) {
      return;
    }

    const storageKey = STORAGE_KEY_PREFIX + key;
    if (value === undefined || value === null) {
      this.#storage.removeItem(storageKey);
      return;
    }

    if (typeof value === 'object') {
      try {
        this.#storage.setItem(storageKey, JSON.stringify(value));
      } catch (error) {
        console.log(`this.set() with key: ${storageKey}`, error);
      }

      return;
    }

    this.#storage.setItem(storageKey, value.toString());
  }

  async setMany(mutateValues: LocalStorage) {
    if (!this.isAvailable()) {
      return;
    }

    for await (const [key, value] of Object.entries(mutateValues)) {
      this.set(key as SchemaKeys, value);
    }
  }

  remove(key: SchemaKeys) {
    if (!this.isAvailable()) {
      return;
    }

    this.#storage.removeItem(STORAGE_KEY_PREFIX + key);
  }

  clear() {
    if (!this.isAvailable()) {
      return;
    }

    this.#storage.clear();
  }
}
