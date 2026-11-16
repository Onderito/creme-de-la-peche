import assert from "node:assert/strict";
import { test } from "node:test";

import { contextVariables, resolveIdentifier, paginationVariables } from "../../lib/shopify/catalog/catalog-inputs";
import { collectConnection } from "../../lib/shopify/catalog/catalog-pagination";
import type { CatalogIdentifier, ShopifyConnection } from "../../lib/shopify/types/storefront-types";

function page(nodes: number[], hasNextPage: boolean, endCursor: string | null): ShopifyConnection<number> {
  return { nodes, pageInfo: { hasNextPage, endCursor, hasPreviousPage: false, startCursor: null } };
}

test("collecte toutes les pages, même quand une page intermédiaire est vide", async () => {
  const cursors: string[] = [];
  const result = await collectConnection(page([1], true, "page-1"), async (after) => {
    cursors.push(after);
    return after === "page-1" ? page([], true, "page-2") : page([2, 3], false, "page-3");
  });
  assert.deepEqual(result, [1, 2, 3]);
  assert.deepEqual(cursors, ["page-1", "page-2"]);
});

test("arrête un curseur répété au lieu de boucler indéfiniment", async () => {
  let calls = 0;
  await assert.rejects(collectConnection(page([1], true, "same"), async () => {
    calls += 1;
    return page([2], true, "same");
  }), { kind: "pagination" });
  assert.equal(calls, 1);
});

test("refuse un curseur absent si Shopify annonce encore une page", async () => {
  await assert.rejects(collectConnection(page([], true, null), async () => {
    assert.fail("Aucun appel ne doit être effectué sans curseur.");
  }), { kind: "pagination" });
});

test("une panne pendant la pagination ne devient pas un succès partiel", async () => {
  const failure = new Error("service indisponible");
  await assert.rejects(collectConnection(page([1], true, "next"), async () => {
    throw failure;
  }), (error: unknown) => error === failure);
});

test("les tailles de page respectent la borne API sans plafonnement silencieux", () => {
  assert.equal(paginationVariables({ first: 250 }).first, 250);
  for (const first of [0, -1, 251, 1.5, NaN]) {
    assert.throws(() => paginationVariables({ first }), { kind: "input" });
  }
  assert.throws(() => paginationVariables({ after: " " }), { kind: "input" });
});

test("les lectures exigent exactement un handle ou un ID", () => {
  assert.deepEqual(resolveIdentifier({ handle: " un-produit " }), { argument: "handle", value: "un-produit" });
  for (const value of [{}, { handle: "" }, { id: "id", handle: "handle" }]) {
    assert.throws(() => resolveIdentifier(value as CatalogIdentifier), { kind: "input" });
  }
});

test("les contextes de marché restent explicites et distincts", () => {
  assert.deepEqual(contextVariables({}), { country: null, language: null });
  assert.deepEqual(contextVariables({ country: " fr ", language: "pt_br" }), { country: "FR", language: "PT_BR" });
  assert.throws(() => contextVariables({ country: "France" }), { kind: "input" });
  assert.throws(() => contextVariables({ language: "" }), { kind: "input" });
});
