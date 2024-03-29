import { TextInputState } from '../../models/textInputState';
import { LoggingService } from '../../services/logging.service';

export class InvitationCodeInputFormatter {
    readonly DISPLAY_INPUT_MAX_LEN = 18;
    readonly MAX_VALUE_LEN = 12;
    readonly CHUNK_SIZE = 4;
    readonly SEPARATOR = ' - ';
    readonly VALID_VAL_REGEX: RegExp = /[A-Z0-9]/;
    private readonly LOG_SOURCE = 'InvitationCodeInputFormatter';

    constructor(private logger: LoggingService) { }

    cleanupInput = (value: string, selectionStart: number): TextInputState => {
        let currentState = this.toUppercase(value, selectionStart);
        this.logger.logDebug(`${this.LOG_SOURCE}. The state after uppercase is %o`, currentState);
        currentState = this.filter(currentState.value, currentState.selectionStart);
        this.logger.logDebug(`${this.LOG_SOURCE}. The state after filter is %o`, currentState);
        currentState = this.truncate(currentState.value, currentState.selectionStart);
        return currentState;
    };

    addSeparator = (value: string, originalSelectionStart: number, isBackSpace: boolean = false): TextInputState => {
        let pos = 0;
        let formattedString = '';
        let selectionStart = originalSelectionStart;
        while (pos < value.length) {
            const currentChunk = value.substring(pos, this.CHUNK_SIZE + pos);

            formattedString = formattedString.concat(currentChunk);
            pos += currentChunk.length;
            this.logger.logDebug(`${this.LOG_SOURCE}. Position after appending chunk %d`, pos);
            // do we add separator? if we have more characters to go in value or if there is room in field
            // for more after entering full chunk e.g,: 1234 - 5678 -
            if (pos < value.length ||
                (currentChunk.length === this.CHUNK_SIZE && formattedString.length < this.DISPLAY_INPUT_MAX_LEN)) {
                this.logger.logDebug(`${this.LOG_SOURCE}. Appending separator. Is this backspace? %s`, isBackSpace);
                formattedString = formattedString.concat(this.SEPARATOR);
                // we adding charqcters so we might have to move the insertion point forward
                // if we at borderline when adding characters, we jump the cursor no next chunk
                if ((!isBackSpace && originalSelectionStart >= pos)
                    // if we are backspacing and at border line, we leave cursor alone resulting on
                    // cursor being at end of previous chunk
                    || (isBackSpace && originalSelectionStart > pos)) { // skip forward if at end of chunk
                    selectionStart += this.SEPARATOR.length;
                }
            }
        }
        return { value: formattedString, selectionStart };
    };

    format = (inputState: TextInputState): TextInputState => {
        let currentState = this.cleanupInput(inputState.value, inputState.selectionStart);
        currentState = this.addSeparator(currentState.value, currentState.selectionStart, inputState.isBackSpace);
        this.logger.logDebug(`${this.LOG_SOURCE}. The state after addSeparator is %o`, currentState);
        return currentState;
    };

    toUppercase = (value: string, selStart: number): TextInputState => ({
        value: value.toLocaleUpperCase(),
        selectionStart: selStart
    });

    filter = (value: string, originalSelStart: number): TextInputState => {
        let currentString = '';
        let selStart = originalSelStart;
        for (let i = 0; i < value.length; i++) {
            const currentVal = value.substring(i, i + 1);
            if (this.VALID_VAL_REGEX.test(currentVal)) {
                currentString = currentString.concat(currentVal);
            } else if (i + 1 <= originalSelStart) {
                --selStart;
            }
        }
        return { value: currentString, selectionStart: Math.min(currentString.length, selStart) };
    };

    truncate = (value: string, selStart: number): TextInputState => ({
        value: value.substring(0, this.MAX_VALUE_LEN),
        selectionStart: Math.min(selStart, this.MAX_VALUE_LEN)
    });
}
