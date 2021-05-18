import serialize from 'serialize-javascript';

export const getUid = () => Math.random().toString(36).slice(-8);

export const deserialize = (code: any) => {
  return eval('(' + code + ')');
};

export { serialize };
