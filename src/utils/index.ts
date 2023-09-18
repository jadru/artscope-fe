export const objectToParams = (obj: { [key: string]: string | number }) => {
  return (
    '?' +
    Object.keys(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join('&')
  );
};

export const cls = (...classnames: string[]) => {
  return classnames.join(' ');
};
