import { Token } from 'antlr4ts/Token';
import { CommonToken } from 'antlr4ts';
import { PexLexer } from '../../antlr4-pex-grammar/PexLexer';

export class PexEditorLexer extends PexLexer {
    private recognizedTokenQueue: Token[] = [];

    nextToken(): Token {
        if (this.recognizedTokenQueue.length) {
            return <Token>this.recognizedTokenQueue.pop();
        }
        let next = super.nextToken();
        const firstToken = next;
        let lastToken = next;
        if(next.type !== PexLexer.UNRECOGNIZED) {
            return next;
        }

        let tokensString = '';
        while(next.type === PexLexer.UNRECOGNIZED) {
            tokensString += next.text;
            lastToken = next;
            next = super.nextToken();
        }
        this.recognizedTokenQueue.push(next);

        return new CommonToken(PexLexer.UNRECOGNIZED, tokensString, {source: lastToken.tokenSource, stream: lastToken.inputStream}, lastToken.channel, firstToken.startIndex, lastToken.stopIndex);
    }
}
