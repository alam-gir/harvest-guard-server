import { LocalizedString } from "../models/types/common";

export function renderLocalizedTemplate(
  template: LocalizedString | undefined,
  vars: Record<string, string | number>
): LocalizedString | undefined {
  if (!template) return undefined;

  const render = (text?: string): string | undefined => {
    if (!text) return undefined;
    let out = text;
    for (const [key, value] of Object.entries(vars)) {
      const pattern = new RegExp(`\\{${key}\\}`, "g");
      out = out.replace(pattern, String(value));
    }
    return out;
  };

  return {
    bn: render(template.bn) ?? template.bn,
    en: render(template.en) ?? template.en
  };
}
