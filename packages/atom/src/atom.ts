import * as O from 'fp-ts/Option';
import * as Op from 'monocle-ts/Optional';
import { pipe } from 'fp-ts/function';
import { Operation } from '@effection/core';
import { createStream } from '@effection/stream';
import { createChannel, ChannelOptions } from '@effection/channel';
import { MakeSlice, Slice } from './types';
import { unique } from './unique';

export function createAtom<S>(initialState: S, options: ChannelOptions = {}): Slice<S> {
  let lens = pipe(Op.id<O.Option<S>>(), Op.some);
  let state: O.Option<S> = O.fromNullable(initialState);
  let states = createChannel(options);
  let valueQueue: S[] = [];
  let didEnter = false;

  function getState(): O.Option<S> {
    return state;
  }

  function* setState(value: S) {
    let next = O.fromNullable(value);

    if (next === getState()) {
      return;
    }

    // there is a compromise here in when we set this value, either the
    // listener itself, or downstream listeners might see an incorrect value
    // after setting. If we don't set the value immediately then we risk that a
    // downstream update will set the state to an old version of itself.
    state = next;

    valueQueue.push(O.toUndefined(next) as S);

    if(!didEnter) {
      try {
        didEnter = true;

        let nextValue;
        while(nextValue = valueQueue.shift()) {
          yield states.send(nextValue);
        }
      } finally {
        didEnter = false;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let sliceMaker = <A>(parentPath: string[], parentOptional: Op.Optional<O.Option<S>, A> = lens as unknown as Op.Optional<O.Option<S>, A>): MakeSlice<any> =>
    <P extends keyof A>(...path: P[]): Slice<A[P]> => {
      // The [any, any] cast is needed as `pipe` expects more than 2 arguments
      // typescript cannot work out if the `getters` array has 0 or more elements
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let getters = (path || []).map(p => (typeof p === 'number') ? Op.index(p) : Op.prop<A, P>(p)) as [any, any];

      let fullPath = [...parentPath, ...path] as string[];

      let sliceOptional = pipe(
         parentOptional,
         Op.fromNullable,
         ...getters
      ) as Op.Optional<O.Option<S>, A[P]>;


      let streamName = fullPath.length ? `slice(${fullPath.map((s) => `'${s}'`).join(', ')})` : 'atom';

      let stream = createStream<A[P]>(function*(publish) {
        yield publish(get());
        yield states.map(
          (s) => pipe(s as S, O.fromNullable, sliceOptional.getOption, O.toUndefined) as A[P]
        ).filter(unique(get())).forEach(publish);
        return undefined;
      }, streamName);

      function getOption(): O.Option<A[P]> {
        let current = pipe(
          getState(),
          sliceOptional.getOption,
        );

        return current;
      }

      function get(): A[P] {
        return pipe(
          getOption(),
          O.toUndefined
        ) as A[P];
      }

      function* set(value: A[P]): Operation<void> {
        if(value === get()) {
          return;
        }

        let next = pipe(
          getState(),
          sliceOptional.set(value),
          O.toUndefined
        );

        yield setState(next as S);
      }

      function* update(fn: (s: A[P]) => A[P]) {
        let next = pipe(
          sliceOptional,
          Op.modify(fn),
        )(getState());

        yield setState(O.toUndefined(next) as S);
      }

      function* remove() {
        let next = pipe(
          sliceOptional,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Op.modify(() => undefined as any),
        )(getState());

        yield setState(O.toUndefined(next) as S);
      }

      return Object.assign({
        get,
        set,
        update,
        stream,
        slice: sliceMaker(fullPath, sliceOptional),
        remove,
      }, stream);
  };

  return sliceMaker([])();
}
