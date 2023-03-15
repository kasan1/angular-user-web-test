import { Gender } from 'projects/shared/models/clientProfile';
import * as moment from 'moment';

export const identifierToBirthDate = (iin: string): Date | null => {
  if (iin !== null && iin.length == 12 && /^\d+$/.test(iin)) {
    const chunks = [];
    for (let i = 0; i < 3; i++) {
      chunks.push(iin.substr(i * 2, 2));
    }
    const centuryIndex = parseInt(iin.substr(6, 1));
    const century = getCenturyByIdentifier(centuryIndex);
    if (century !== 0) {
      const date = `${century + parseInt(chunks[0])}-${chunks[1]}-${chunks[2]}`;
      return new Date(date);
    }
    return null;
  }
  return null;
};

const getGenderByIdentifierIndex = (index: number): Gender =>
  index % 2 ? Gender.Male : Gender.Female;

const getCenturyByIdentifier = (index: number): 0 | 1800 | 1900 | 2000 => {
  switch (index) {
    case 1:
    case 2:
      return 1800;
    case 3:
    case 4:
      return 1900;
    case 5:
    case 6:
      return 2000;
    default:
      return 0;
  }
};
