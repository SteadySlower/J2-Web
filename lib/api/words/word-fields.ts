import { z } from "zod";

export const wordFieldsSchema = z.object({
  japanese: z
    .string()
    .min(1, "일본어 단어는 필수입니다")
    .refine(
      (val) => !val.includes("{") && !val.includes("}"),
      "중괄호({, })는 사용할 수 없습니다."
    ),
  meaning: z.string().min(1, "의미는 필수입니다"),
  pronunciation: z.string().optional(),
});
