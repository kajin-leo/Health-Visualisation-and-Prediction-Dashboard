import { apiClient } from "./axios";

export interface BmiDto {
  value: number;
  category: "UNDERWEIGHT"|"NORMAL"|"OVERWEIGHT"|"OBESE"|string;
  heightCm: number;
  weightKg: number;
  updatedAt: string;
}

export async function fetchBmi(userId: number): Promise<BmiDto> {
  const { data } = await apiClient.get<BmiDto>("/api/static/bmi", { params: { userId } });
  return data;
}
