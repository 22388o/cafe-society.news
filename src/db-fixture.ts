import Dexie, { Table } from "dexie";

export interface NostrKey {
  publicKey: string;
  secretKey?: string;
  label?: string;
  lightningAddress?: string;
}

export interface Feed {
    "id": string,
    "checked": boolean,
    "categories": string[]
}

export interface CorsProxy {
  "id": string,
  "checked": boolean
}
export interface Category {
  "id": string,
  "checked": boolean
}

export class DbFixture extends Dexie {
  nostrkeys!: Table<NostrKey>;
  feeds!: Table<Feed>;
  corsProxies!: Table<CorsProxy>;
  categories!: Table<Category>;


  constructor() {
    super("db-fixture");
    this.version(1).stores({
      nostrkeys: "&publicKey",
      feeds: "&id, checked, *categories",
      corsProxies: "&id",
      categories: "&id"
    });
  }
}
