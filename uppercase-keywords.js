const reserved = require('./reserved-words');
const reservedPattern = new RegExp(`\\b(?:${reserved.join('|')})\\b`, 'ig');

const matcherFactory = (pattern, doTransform = false, parseMatch = m => m[0]) => {
  return (sql) => {
    let match = sql.match(pattern);
    return match ? {text: parseMatch(match), doTransform} : null;
  }
}

const matchNormal = matcherFactory(/^([\s\S]*?)(?:$|'|"|`|--|#|\/\*)/, true, m => m[1]);
const matchSingleString = matcherFactory(/^'(?:[^'\\]|\\.)*('|$)/);
const matchDoubleString = matcherFactory(/^"(?:[^"\\]|\\.)*("|$)/);
const matchBacktickString = matcherFactory(/^`(?:[^`\\]|\\.)*(`|$)/);
const matchHashComment = matcherFactory(/^#.*($|\n)/);
const matchDashComment = matcherFactory(/^--.*($|\n)/);
const matchblockComment = matcherFactory(/^\/\*[\s\S]*?($|\*\/)/);

const matchers = [
  matchSingleString, matchDoubleString, matchBacktickString,
  matchDashComment, matchHashComment, matchblockComment,
  matchNormal
];

// function getMatch(s, pattern) {
//   let match = s.match(pattern);
//   return match ? match[0] : false;
// }

// function getNormalMatch(s) {
//   return getMatch(s, /^[^'"`]*/);
// }

// function getStringMatch(s) {
//   let quote = getMatch(s, /^['"`]/)
//   if(quote) {
//     const stringPattern = new RegExp(`^${quote}(?:[^${quote}\\\\]|\\\\.)*(${quote}|$)`);
//     return getMatch(s, stringPattern)
//   }
// }

function transform(s) {
  return s.replace(reservedPattern, (match) => {
    return match.toUpperCase();
  });
}

function upperCaseKeywords(sql) {
  let blocks = [], block;

  while(sql) {
    for (let matcher of matchers) {
      if(block = matcher(sql)) {
        blocks.push(block);
        sql = sql.slice(block.text.length);
        break;
      }
    }
  }

  return blocks.reduce((sql, block) => {
    let {text, doTransform} = block
    if(doTransform) text = transform(text);
    return sql + text;
  }, '');
}

module.exports = upperCaseKeywords;
