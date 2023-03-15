import { EssenceType } from 'projects/okaps/src/app/models/common.model';

export const parseResponseObject = ({
  subjectDn,
  certNotAfter,
  certNotBefore,
}) => {
  if (!subjectDn) {
    return;
  }

  // TODO: parse subjectDn to interface or type
  const split = subjectDn.split(',');
  const cn = _field(split, 'CN=');

  return {
    identifier: _field(split, 'SERIALNUMBER=IIN'),
    middleName: _field(split, 'G='),
    lastName: _field(split, 'SURNAME='),
    firstName: cn ? cn.split(' ')[1] : '',
    email: _field(split, 'E=')?.toLowerCase(),
    certificateDateFrom: certNotBefore ? new Date(+certNotBefore) : null,
    certificateDateTo: certNotAfter ? new Date(+certNotAfter) : null,
    essenceType: EssenceType.Individual, // TODO: somehow figure it out in the future
  };
};

const _field = (items: string[], search: string) => {
  const item = items.find((i) => i.startsWith(search));
  if (!item) return null;

  return item.substr(search.length);
};
