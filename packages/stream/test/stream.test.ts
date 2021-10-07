import expect from 'expect';
import { describe, it, captureError } from '@effection/mocha';
import { EventEmitter } from 'events';

import { createStream, Stream } from '../src/index';

type Person = { name: string; type: 'person'; };
type Planet = { name: string; type: 'planet'; moon: string };

type Thing = Person | Planet;

function isPlanet(thing: Thing): thing is Planet { return thing.type === 'planet' }

const stuff: Stream<Thing, number> = createStream((publish) => function*() {
  yield publish({ name: 'bob', type: 'person' });
  yield publish({ name: 'alice', type: 'person' });
  yield publish({ name: 'world', type: 'planet', moon: 'Luna' });
  return 3;
});

const emptyStream: Stream<Thing, number> = createStream(() => function*() {
  return 12;
});


function createEmitterStream(): { stream: Stream<string>, emitter: EventEmitter } {
  let emitter = new EventEmitter();
  let stream = createStream<string>((publish) => function*(task) {
    let listener = (value: string) => task.run(publish(value));
    try {
      emitter.on('message', listener);
      yield;
    } finally {
      emitter.off('message', listener);
    }
    return undefined;
  });
  return { stream, emitter };
}

describe('Stream', () => {
  describe('join', () => {
    it('returns the result of the stream', function*() {
      let result = yield stuff.join();
      expect(result).toEqual(3);
    });
  });

  describe('forEach', () => {
    it('iterates through all members of the subscribable', function*() {
      let values: Thing[] = [];
      yield stuff.forEach((item) => function*() { values.push(item); });
      expect(values).toEqual([
        {name: 'bob', type: 'person' },
        {name: 'alice', type: 'person' },
        {name: 'world', type: 'planet', moon: 'Luna' },
      ])
    });

    it('can iterate with regular function', function*() {
      let values: Thing[] = [];
      yield stuff.forEach((item) => { values.push(item); });
      expect(values).toEqual([
        {name: 'bob', type: 'person' },
        {name: 'alice', type: 'person' },
        {name: 'world', type: 'planet', moon: 'Luna' },
      ])
    });

    it('returns the original result', function*() {
      let result = yield stuff.forEach(() => function*() { /* no op */ });
      expect(result).toEqual(3);
    });
  });

  describe('collect', () => {
    it('collects values into a synchronous iterator', function*() {
      let iterator: Iterator<Thing, number> = yield stuff.collect();
      expect(iterator.next()).toEqual({ done: false, value: { name: 'bob', type: 'person' } });
      expect(iterator.next()).toEqual({ done: false, value: { name: 'alice', type: 'person' } });
      expect(iterator.next()).toEqual({ done: false, value: { name: 'world', type: 'planet', moon: 'Luna' } });
      expect(iterator.next()).toEqual({ done: true, value: 3 });
    });
  });

  describe('toArray', () => {
    it('collects values into an array', function*() {
      let result = yield stuff.toArray();
      expect(result).toEqual([
        { name: 'bob', type: 'person' },
        { name: 'alice', type: 'person' },
        { name: 'world', type: 'planet', moon: 'Luna' },
      ]);
    });
  });

  describe('map', () => {
    it('maps over the values', function*() {
      let mapped = yield stuff.map(item => `hello ${item.name}`).collect();
      expect(mapped.next()).toEqual({ done: false, value: 'hello bob' });
      expect(mapped.next()).toEqual({ done: false, value: 'hello alice' });
      expect(mapped.next()).toEqual({ done: false, value: 'hello world' });
      expect(mapped.next()).toEqual({ done: true, value: 3 });
    });
  });

  describe('filter', () => {
    it('filters the values', function*() {
      let filtered = yield stuff.filter(item => item.type === 'person').collect();
      expect(filtered.next()).toEqual({ done: false, value: { name: 'bob', type: 'person' } });
      expect(filtered.next()).toEqual({ done: false, value: { name: 'alice', type: 'person' } });
      expect(filtered.next()).toEqual({ done: true, value: 3 });
    });

    it('can downcast filtered values', function*() {
      let filtered = yield stuff.filter(isPlanet).map((p) => p.moon).collect();
      expect(filtered.next()).toEqual({ done: false, value: 'Luna' });
    });
  });

  describe('match', () => {
    it('filters the values based on the given pattern', function*() {
      let matched = yield stuff.match({ type: 'person' }).collect();
      expect(matched.next()).toEqual({ done: false, value: { name: 'bob', type: 'person' } });
      expect(matched.next()).toEqual({ done: false, value: { name: 'alice', type: 'person' } });
      expect(matched.next()).toEqual({ done: true, value: 3 });
    });

    it('can work on nested items', function*() {
      let matched = yield stuff.map(item => ({ thing: item })).match({ thing: { type: 'person' } }).collect();
      expect(matched.next()).toEqual({ done: false, value: { thing: { name: 'bob', type: 'person' } } });
      expect(matched.next()).toEqual({ done: false, value: { thing: { name: 'alice', type: 'person' } } });
      expect(matched.next()).toEqual({ done: true, value: 3 });
    });
  });

  describe('grep', () => {
    it('filters the values based on the given regexp', function*() {
      let matched = yield stuff.map((v) => v.name).grep(/bob|alice/).collect();
      expect(matched.next()).toEqual({ done: false, value: 'bob' });
      expect(matched.next()).toEqual({ done: false, value: 'alice' });
      expect(matched.next()).toEqual({ done: true, value: 3 });
    });

    it('filters the values based on the given substring', function*() {
      let matched = yield stuff.map((v) => v.name).grep('ob').collect();
      expect(matched.next()).toEqual({ done: false, value: 'bob' });
      expect(matched.next()).toEqual({ done: true, value: 3 });
    });
  });

  describe('first', () => {
    it('returns the first item in the subscription', function*() {
      expect(yield stuff.first()).toEqual({ name: 'bob', type: 'person' });
    });

    it('returns undefined if the subscription is empty', function*() {
      expect(yield emptyStream.first()).toEqual(undefined);
    });
  });

  describe('expect', () => {
    it('returns the first item in the subscription', function*() {
      expect(yield stuff.expect()).toEqual({ name: 'bob', type: 'person' });
    });

    it('throws an error if the subscription is empty', function*() {
      expect(yield captureError(emptyStream.expect())).toHaveProperty('message', 'expected to contain a value');
    });
  });

  describe('toBuffer', () => {
    it('adds emitted values to unlimited size buffer', function*(world) {
      let { stream, emitter } = createEmitterStream();
      emitter.emit('message', 'ignored');

      let buffer = yield stream.toBuffer();

      emitter.emit('message', 'hello');
      emitter.emit('message', 'world');
      emitter.emit('message', 'monkey');

      expect(Array.from(buffer)).toEqual(['hello', 'world', 'monkey']);

      emitter.emit('message', 'blah');

      expect(Array.from(buffer)).toEqual(['hello', 'world', 'monkey', 'blah']);
    });

    it('replays previously sent messages with limited buffer', function*(world) {
      let { stream, emitter } = createEmitterStream();

      emitter.emit('message', 'ignored');

      let buffer = yield stream.toBuffer(2);

      emitter.emit('message', 'hello');
      emitter.emit('message', 'world');
      emitter.emit('message', 'monkey');

      expect(Array.from(buffer)).toEqual(['world', 'monkey']);

      emitter.emit('message', 'blah');

      expect(Array.from(buffer)).toEqual(['monkey', 'blah']);
    });
  });

  describe('buffered', () => {
    it('replays all previously sent messages with unlimited buffer', function*(world) {
      let { stream, emitter } = createEmitterStream();

      emitter.emit('message', 'ignored');

      let bufferedStream = yield stream.buffered();

      emitter.emit('message', 'hello');
      emitter.emit('message', 'world');
      emitter.emit('message', 'monkey');

      let iterator = bufferedStream.subscribe(world);

      emitter.emit('message', 'blah');

      expect(yield iterator.next()).toEqual({ done: false, value: 'hello' });
      expect(yield iterator.next()).toEqual({ done: false, value: 'world' });
      expect(yield iterator.next()).toEqual({ done: false, value: 'monkey' });
      expect(yield iterator.next()).toEqual({ done: false, value: 'blah' });
    });

    it('replays previously sent messages with limited buffer', function*(world) {
      let { stream, emitter } = createEmitterStream();

      emitter.emit('message', 'ignored');

      let bufferedStream = yield stream.buffered(2);

      emitter.emit('message', 'hello');
      emitter.emit('message', 'world');
      emitter.emit('message', 'monkey');

      let iterator = bufferedStream.subscribe(world);

      emitter.emit('message', 'blah');

      expect(yield iterator.next()).toEqual({ done: false, value: 'world' });
      expect(yield iterator.next()).toEqual({ done: false, value: 'monkey' });
      expect(yield iterator.next()).toEqual({ done: false, value: 'blah' });
    });
  });

  describe('as resource', () => {
    it('returns a subscription', function*() {
      let result = yield stuff;
      expect(yield result.next()).toEqual({ done: false, value: { name: "bob", type: "person" } });
      expect(yield result.next()).toEqual({ done: false, value: { name: "alice", type: "person" } });
    });
  });
});
