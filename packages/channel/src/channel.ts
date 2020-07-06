import { Operation, spawn } from 'effection';
import { Subscribable, Subscription, SymbolSubscribable, createSubscription, forEach } from '@effection/subscription';
import { on, once } from '@effection/events';
import { EventEmitter } from 'events';

export class Channel<T, TClose = undefined> implements Subscribable<T, TClose> {
  private bus = new EventEmitter();

  [SymbolSubscribable](): Operation<Subscription<T, TClose>> {
    return this.subscribe();
  }

  setMaxListeners(value: number) {
    this.bus.setMaxListeners(value);
  }

  send(message: T) {
    this.bus.emit('message', message);
  }

  subscribe(): Operation<Subscription<T, TClose>> {
    let { bus } = this;
    return createSubscription(function*(publish) {
      yield spawn(forEach(on(bus, 'message'), function*([message]) {
        publish(message as T);
      }));
      let [closeValue] = yield once(bus, 'close');
      return closeValue;
    });
  }

  close(...args: TClose extends undefined ? [] : [TClose]) {
    this.bus.emit('close', args[0]);
  }
}