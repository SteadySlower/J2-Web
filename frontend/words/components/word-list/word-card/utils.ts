export const getTextSize = (text: string) => {
  const length = text.length;
  if (length <= 8) return "text-4xl";
  if (length <= 14) return "text-3xl";
  if (length <= 20) return "text-2xl";
  return "text-xl";
};
