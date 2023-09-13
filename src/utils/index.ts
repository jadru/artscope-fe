export const objectToParams = (obj: { [key: string]: string | number }) => {
  return (
    '?' +
    Object.keys(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join('&')
  );
};
