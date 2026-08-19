const UPPERCASE = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // no I/O — avoid look-alikes
const LOWERCASE = 'abcdefghijkmnpqrstuvwxyz';
const DIGITS = '23456789';
// Must match the backend's strength regex exactly (`PasswordHasher`,
// BE-kt-xnk): `#?!@$%^&*-`.
const SYMBOLS = '#?!@$%^&*-';
const ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SYMBOLS;
const PASSWORD_LENGTH = 12;

/** @param {string} chars */
function randomChar(chars) {
  return chars[Math.floor(Math.random() * chars.length)];
}

/** @param {string[]} chars */
function shuffle(chars) {
  const shuffled = [...chars];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generates a random password guaranteed to pass the backend's strength
 * check (min 8 chars, at least one uppercase/lowercase/digit/symbol from
 * `#?!@$%^&*-`) by seeding one character from each required class before
 * filling the rest and shuffling.
 * @returns {string}
 */
export function generateRandomPassword() {
  const required = [
    randomChar(UPPERCASE),
    randomChar(LOWERCASE),
    randomChar(DIGITS),
    randomChar(SYMBOLS),
  ];
  const rest = Array.from({ length: PASSWORD_LENGTH - required.length }, () =>
    randomChar(ALL_CHARS),
  );

  return shuffle([...required, ...rest]).join('');
}
