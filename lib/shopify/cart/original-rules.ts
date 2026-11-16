type SelectionLine = { id: string; quantity: number; merchandise: { product: { handle: string } } };

export function originalCartIssue(quantity: number, handle: string, lines: SelectionLine[], updatedLineId?: string) {
  if (quantity !== 1) return "quantity";
  // Product-level uniqueness also covers different variants of the same artwork.
  if (lines.some((line) => line.id !== updatedLineId && line.quantity > 0 && line.merchandise.product.handle === handle)) return "duplicate";
  return null;
}

export function hasDuplicateOriginals(lines: SelectionLine[], originalHandles: ReadonlySet<string>) {
  const quantities = new Map<string, number>();
  for (const line of lines) {
    const handle = line.merchandise.product.handle;
    if (!originalHandles.has(handle)) continue;
    const quantity = (quantities.get(handle) ?? 0) + line.quantity;
    if (quantity > 1) return true;
    quantities.set(handle, quantity);
  }
  return false;
}
