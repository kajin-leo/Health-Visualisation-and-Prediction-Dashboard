import type { BmiDto } from "./static";

export async function fetchBmiMock(): Promise<BmiDto> {
  return {
    value: 22.4,
    category: "NORMAL",
    heightCm: 172,
    weightKg: 66.3,
    updatedAt: new Date().toISOString(),
  };
}
