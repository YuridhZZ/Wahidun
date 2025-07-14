export const generateAccountNumber = () => {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, ''); // contoh: 20250712
  const randomPart = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return Number(`${datePart}${randomPart}`); // hasil: 202507129384
};
