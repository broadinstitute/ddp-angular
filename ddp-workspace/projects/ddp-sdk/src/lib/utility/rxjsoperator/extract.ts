import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map, pluck, shareReplay, tap } from 'rxjs/operators';
import * as util from 'underscore';

interface ExtractOptions {
    onlyDistinct: boolean;
}
type Projection<T, R> =  (value: T, index: number) => R;
interface Extract {
    <T, K1 extends keyof T>(properties: K1, opts?: ExtractOptions): OperatorFunction<T, T[K1]>;
    <T, R>(projection: Projection<T, R>, opts?: ExtractOptions): OperatorFunction<T, R>;
}

export const extract: Extract = (mapper, opts: ExtractOptions = {onlyDistinct: true})  => {
    return pipe(
        util.isFunction(mapper) ? map(mapper) : pluck(mapper),
        opts.onlyDistinct ? distinctUntilChanged((x, y) => util.isEqual(x, y)) : tap(),
        shareReplay());
};
