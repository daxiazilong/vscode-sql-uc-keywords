const reserved = require('./reserved-words');
const reservedPattern = new RegExp(`\\b(?:${reserved.join('|')})\\b`, 'ig');

function getMatch(s, pattern) {
  let match = s.match(pattern);
  return match ? match[0] : false;
}

function getNormalMatch(s) {
  return getMatch(s, /^[^'"`]*/);
}

function getStringMatch(s) {
  let quote = getMatch(s, /^['"`]/)
  if(quote) {
    const stringPattern = new RegExp(`^${quote}(?:[^${quote}\\\\]|\\\\.)*(${quote}|$)`);
    return getMatch(s, stringPattern)
  }
}

function replace(s) {
  return s.replace(reservedPattern, (match) => {
    return match.toUpperCase();
  });
}

function upperCaseKeywords(sql) {
  let result = '', match;

  while(sql) {
    match = getNormalMatch(sql);
    if(match) {
      result += replace(match)
      sql = sql.slice(match.length);
    }

    match = getStringMatch(sql);
    if(match) {
      result += match;
      sql = sql.slice(match.length);
    }
  }

  return result;
}

module.exports = upperCaseKeywords;
