const HIRAGANA                = 0; // The matrix but a bit happier :)
const KATAKANA                = 1; // The alphabet that appears in the movie
const KANJI                   = 2; // Chinese/Japanese/Korean semi-common ideographic alphabet
const KANJI_INCL_RARE         = 3; // This also includes 0x3400 -> 0x4db5, which is an additional 6582

const KOREAN                  = 4; // Also a lot, but these are combinations of a small set, I think.
                                   //  I don't really know anything about the korean alphabet.

const LATIN                   = 5;
const GREEK                   = 6;
const GREEK_EXTENDED          = 7; // Greek plus variants, archaics and coptic
const CYRILLIC                = 8; // Russian cyrillic
const HEBREW                  = 9;
const CHEROKEE                = 10; // Why not
const ALL_EXCEPT_KANJI_KOREAN = 11;
const ALL                     = 12;

/**
 *  @desc Obtains a list of all (unicode) symbols of a specific alphabet
 *  @param const $alphabet
 *  @return Array
 */
function getSymbols(alphabet = KATAKANA) {

    if(alphabet === ALL) {
        return [
            ...getSymbols(ALL_EXCEPT_KANJI_KOREAN),
            ...getSymbols(KANJI_INCL_RARE),
            ...getSymbols(KOREAN)
        ];
    } else if(alphabet === ALL_EXCEPT_KANJI_KOREAN) {
        return [
            ...getSymbols(HIRAGANA),
            ...getSymbols(KATAKANA),
            ...getSymbols(LATIN),
            ...getSymbols(GREEK_EXTENDED),
            ...getSymbols(CYRILLIC),
            ...getSymbols(HEBREW),
            ...getSymbols(CHEROKEE)
        ];
    }

    let uRanges = [];
    switch(alphabet) {
        case HIRAGANA:
            uRanges.push([0x3041, 0x3096]);
            break;
        case KANJI:
            uRanges.push([0x4E00, 0x9FAF]);
            break;
        case KANJI_INCL_RARE:
            uRanges.push([0x4E00, 0x9FAF]);
            uRanges.push([0x3400, 0x4db5]);
            break;
        case KOREAN:
            uRanges.push([0xAC00, 0xD7A3]);
            break;
        case LATIN:
            uRanges.push([0x0041, 0x005A]);
            uRanges.push([0x0061, 0x007A]);
            break;
        case GREEK:
            uRanges.push([0x0391, 0x03A1]); // Capital sigmas are all he same?
            uRanges.push([0x03A3, 0x03A9]); // ... and small sigmas are different at end of word?
            uRanges.push([0x03B1, 0x03C9]);
            break;
        case GREEK_EXTENDED:
            uRanges.push([0x0370, 0x0373]);
            uRanges.push([0x0376, 0x0377]);
            uRanges.push([0x0391, 0x03A1]);
            uRanges.push([0x03A3, 0x03A9]);
            uRanges.push([0x03B1, 0x03C9]);
            uRanges.push([0x03CF, 0x03D2]);
            uRanges.push([0x03D5, 0x03FF]);
            break;
        case CYRILLIC:
            uRanges.push([0x0410, 0x044F]);
            break;
        case HEBREW:
            uRanges.push([0x05D0, 0x05EA]);
            break;
        case CHEROKEE:
            uRanges.push([0x13A0, 0x13F4]);
            break;
        case KATAKANA:
        default:
            uRanges.push([0x30A1, 0x30FA]);
            break;
    }

    let ans = [];
    for(let uniRange of uRanges) {
        for(let i = uniRange[0]; i <= uniRange[1]; i++) {
            ans.push(String.fromCharCode(i));
        }
    }

    return ans;
}
