import { PEXLanguage } from '../../antlr4-pex-grammar/pex-config';

const literalFg = '3b8737';
const symbolsFg = '000000';
const keywordFg = '7132a8';
const errorFg = 'ff0000';

export const pexTheme: monaco.editor.IStandaloneThemeData = {
    base: 'vs',
    inherit: false,
    rules: [
        { token: `int.${PEXLanguage}`,   foreground: literalFg },
        { token: `bool.${PEXLanguage}`,   foreground: literalFg },
        { token: `str.${PEXLanguage}`,   foreground: keywordFg },
        { token: `timeunit.${PEXLanguage}`,   foreground: literalFg },
        { token: `unary_operator.${PEXLanguage}`,         foreground: symbolsFg },
        { token: `relation_operator.${PEXLanguage}`,          foreground: symbolsFg },
        { token: `equality_operator.${PEXLanguage}`,          foreground: symbolsFg },
        { token: `user.${PEXLanguage}`,     foreground: keywordFg,  fontStyle: 'bold' },
        { token: `operator.${PEXLanguage}`,     foreground: keywordFg,  fontStyle: 'bold' },
        { token: `instance_type.${PEXLanguage}`,    foreground: keywordFg,  fontStyle: 'bold' },
        { token: `unrecognized.${PEXLanguage}`, foreground: errorFg }
    ],
    colors: {}
};
