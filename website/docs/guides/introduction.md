---
id: introduction
title: Introduction
---

Effection is a framework for Node and the browser that makes building
concurrent systems easy to get right.

## Why use Effection?

Using Effection provides many benefits over using plain Promises and
`async/await` code:

- **Cleanup:** Effection code cleans up after itself, and that means never having
  to remember to manually close a resource or detach a listener.
- **Cancellation:** Any Effection task can be cancelled, which will completely
  stop that task, as well as stopping any other tasks it has started.
- **Synchronicity:** Unlike Promises and `async/await`, Effection is fundamentally
  synchronous in nature, this means you have full control over the event loop
  and operations requiring synchronous setup remain race condition free.
- **Composition:** Since all Effection code is well behaved, it
  composes easily, and there  are no nasty surprises when trying to
  fit different pieces together.

JavaScript has gone through multiple evolutionary steps in how to deal
with concurrency: from callbacks and events, to promises, and then
finally to `async/await`. Yet it can still be difficult to write
concurrent code which is both correct and composable, and unless
you're very careful, it is still easy to leak resources. Also, most
JavaScript code and libraries do not handle cancellation very well,
and failure conditions can easily lead to dangling promises and other
unexpected behavior.

Effection leverages the idea of [structured concurrency][structured concurrency]
to ensure that you don't leak any resources, and that cancellation is
properly handled. It helps you build concurrent code that feels rock
solid and behaves well under all failure conditions. In essence,
Effection allows you to compose concurrent code so that you can reason
about its behavior.


## Replacing async/await

If you know how to use `async/await`, then you're already familiar with most of
what you need to know to use Effection. The only difference is that instead
of [async functions][], you use [generator functions][]. Generator functions are
similar to async functions but they allow Effection to take greater control over
the execution of your code.

To switch from async functions to generator functions, you can replace:

1. `await` with `yield`
1. `async function()` with `function*()`


For example, using `async/await` we could write something like this:

``` javascript
import { fetch } from 'isomorphic-fetch';

export async function fetchWeekDay(timezone) {
  let response = await fetch(`http://worldclockapi.com/api/json/${timezone}/now`);
  let time = await response.json();
  return time.dayOfTheWeek;
}
```

The same code using Effection looks like this:

``` javascript
import { fetch } from 'effection';

export function *fetchWeekDay(timezone) {
  let response = yield fetch(`http://worldclockapi.com/api/json/${timezone}/now`);
  let time = yield response.json();
  return time.dayOfTheWeek;
}
```

## Your first Effection program

To start using Effection, use the `main` function as an entry
point. In this example, we'll use the previously defined
`fetchWeekDay`.

``` javascript
import { main } from 'effection';
import { fetchWeekDay } from './fetch-week-day';

main(function*() {
  let dayOfTheWeek = yield fetchWeekDay('est');
  console.log(`It is ${dayOfTheWeek}, my friends!`);
});
```

Even with such a simple program, Effection is still providing critical
power-ups to you behind the scenes that you don't get with callbacks,
promises, or `async/await`. For example, if you run the above in
NodeJS and hit `CTRL-C` while the request to `http://worldclockapi.com` is
still in progress, it will properly cancel the in-flight request
as a well-behaved HTTP client should. All without you ever having to
think about it. This is because every Effection operation contains
the information on how to dispose of itself, and so the actual act of
cancellation can be automated.

This has powerful consequences when it comes to composing new
operations out of existing ones. For example, we can add a time out of
1000 milliseconds to our `fetchWeekDay` operation (or any operation
for that matter) by wrapping it with the `withTimeout` operation from
the standard `effection` module.

``` javascript
import { main, withTimeout } from 'effection';
import { fetchWeekDay } from './fetch-week-day';

main(function*() {
  let dayOfTheWeek = yield withTimeout(fetchWeekDay('est'), 1000);
  console.log(`It is ${dayOfTheWeek}, my friends!`);
});
```

If more than 1000 milliseconds passes before the `fetchWeekDay()`
operation completes, then an error will be raised.

What's important to note however, is that when we actually defined our
`fetchWeekDay()` operation, we never once had to worry about timeouts,
or request cancellation. And in order to achieve both we didn't have
to gum up our API by passing around cancellation tokens or [abort
controllers][abort controller]. We just got it all for free.

## Discover more

This is just the tip of the iceberg when it comes to the seemingly complex
things that Effection can make simple. To find out more, jump
into the conversation [in our discord server][discord]. We're really
excited about the things that Effection has enabled us to accomplish,
and we'd love to hear your thoughts on it, and how you might see
it working for you.

[structured concurrency]: https://vorpus.org/blog/notes-on-structured-concurrency-or-go-statement-considered-harmful/
[generator functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
[generators]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator
[async functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
[abort controller]: https://developer.mozilla.org/en-US/docs/Web/API/AbortController
[discord]: https://discord.gg/Ug5nWH8
