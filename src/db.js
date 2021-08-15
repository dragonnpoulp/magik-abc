import { openDB } from "idb";

let db = null;

function getIndexDb() {
  if (!db) {
    db = openDB("magik-abc", 2, {
      upgrade(db) {
        db.createObjectStore("audio");
      },
    });
  }

  return db;
}

export default getIndexDb;
