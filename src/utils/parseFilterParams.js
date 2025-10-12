// type - відображає тип контакту, значення властивості contactType
// isFavourite - відображає чи є контакт обраним
const parseType = (type) => {
  const isString = typeof type === 'string';

  if (!isString) return;
  const isContactType = (type) => ['work', 'home', 'personal'].includes(type);

  if (isContactType(type)) return type;
};

const parseIsFavourite = (isFavourite) => {
  const isString = typeof isFavourite === 'string';

  if (!isString) return;
  const isFavouriteBool = (isFavourite) =>
    ['true', 'false'].includes(isFavourite);

  if (isFavouriteBool(isFavourite)) return isFavourite;

  return isFavourite;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
