type ProductOption = { name: string; values: string[] };
type SelectedOption = { name: string; value: string };

/** Legacy originals store dimensions as the option name and a number as its value. */
export function artworkFormat(option: ProductOption): string | null {
  if (option.values.length !== 1 || !/^\d+(?:[.,]\d+)?$/.test(option.values[0].trim())) return null;
  const dimensions = option.name.trim().match(/^(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*(cm|mm)$/i);
  return dimensions ? `${dimensions[1]} × ${dimensions[2]} ${dimensions[3].toLowerCase()}` : null;
}

export function visibleVariantOptions(selected: SelectedOption[], options: ProductOption[]): SelectedOption[] {
  return selected.flatMap((selection) => {
    const option = options.find((item) => item.name === selection.name);
    if (!option) return [];
    const format = artworkFormat(option);
    if (format) return [{ name: "Format", value: format }];
    return option.values.length > 1 ? [selection] : [];
  });
}

export function variantOptionsLabel(options: SelectedOption[]): string {
  return options.map((option) => option.name === "Format" ? `Format: ${option.value}` : option.value).join(" / ");
}
