export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric", // ← optional, add if you want "Mar 10, 2026"
    hour: "2-digit", // ← optional, add if you want time
    minute: "2-digit", // ← optional
  };
  return new Date(date).toLocaleDateString("en-US", options);
};
