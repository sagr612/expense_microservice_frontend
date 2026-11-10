export const formatDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric", // optional, add if you want "Mar 10, 2026"
    hour: "2-digit", // optional, add if you want time
    minute: "2-digit", // optional
  };
  return new Date(date).toLocaleDateString("en-US", options);
};

export const extractErrorMessage = (
  err: any,
  fallback: string = "Something went wrong",
) => {
  const data = err?.response?.data;
  if (!data) {
    return err?.message ?? fallback;
  }
  if (typeof data === "string") return data;
  if (data.validationErrors && typeof data.validationErrors === "object") {
    const errorList = Object.values(data.validationErrors) as string[];
    if (errorList.length > 0) return errorList.join(", ");
  }

  return data.message || data.error || err?.message || fallback;
};
