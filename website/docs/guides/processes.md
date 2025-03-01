---
id: processes
title: Spawning processes
---

Effection simplifies the process of managing any kind of resource, and we've
taken great care to provide a good experience when you want to spawn external
processes.

Processes are managed via the separate `@effection/process` package, which
currently only works in node.

## Exec

The main way of starting a process is using the `exec` operation. `exec` spawns
a process and returns a handle to this process:

``` typescript
import { main, spawn } from 'effection';
import { exec } from '@effection/process';

main(function*() {
  let myProcess = yield exec('npm start');

  yield spawn(myProcess.stdout.forEach((text) => console.log(text)));

  let result = yield myProcess.join();
  console.log(`terminated with exit code ${result.code}`);
});
```
> Note: every process has `stdout` and `stderr`  properties which can be consumed as [effection streams](./collections)

Processes are automatically terminated when the operation in which they were
created completed:

``` typescript
import { main } from 'effection';
import { exec } from '@effection/process';

function *runNpm() {
  yield exec('npm start');
  // npm is terminated at the end of this operation
}

main(function*() {
  yield runNpm();
  // npm has already been terminated here
});
```

`exec` returns a [resource][] which means that if you want to create an object
which uses an external process internally, you will have to create it as a
resource as well.

`exec` gives you a lot of control, including the ability to work with the
input and output streams of an external process, and to block and wait for
the process to complete using `myProcess.join()`.

Often we expect the process to complete in an orderly fashion with an exit code of `0`
and we don't want to have to add any error handling in case the process
exits with a non-zero error code. `expect()` is a convenient operation
which blocks just like `join()` but throws an error on any non-zero exit code.

``` typescript
import { main, spawn } from 'effection';
import { exec } from '@effection/process';

main(function*() {
  let myProcess = yield exec('npm start');

  yield spawn(myProcess.stdout.forEach((text) => console.log(text)));

  let result = yield myProcess.expect();
});
```

## Short lived processes

We have seen how we can use `exec` to manage processes which run for a while,
but sometimes we just want to run a process which completes quickly. For these
cases there are shortcuts for both `join` and `expect`, so you don't have to
deal with a process object:

``` typescript
import { main } from 'effection';
import { exec } from '@effection/process';

main(function*() {
  let { stdout } = yield exec('whois frontside.com').join();

  console.log(stdout);
});
```

As you can see, when using this shorthand form, both `stdout` and `stderr` are
strings containing the full output of the program.

The same shortcut is available for `expect`:

``` typescript
import { main } from 'effection';
import { exec } from '@effection/process';

main(function*() {
  let { stdout } = yield exec('whois frontside.com').expect();

  console.log(stdout);
});
```

## Daemon

A common problem with processes is what to do if they exit too early. Often we
want a process to live for the entire duration of the program, or in the case
of effection for the entire duration of an operation. When using `exec`,
effection ensures that the process cannot live *longer* than the operation, but
it does not ensure that the process cannot live *shorter* than the operation.

An example of this might be spawning a server which must keep running so that
we can send requests to it. If the server exists for any reason, even if it
exits successfully with an exit code of `0`, that is an unexpected condition,
and we need to throw an error.

This is where `daemon` comes in. When using `daemon`, if the process finishes
before the operation is complete, even if it finishes with an exit code of `0`,
an error is thrown.

Here is an example of using `daemon` to spawn a server process in the
background:

``` typescript
import { main, spawn, fetch } from 'effection';
import { daemon } from '@effection/process';

main(function*() {
  let myProcess = yield daemon('my-server --port 3000');

  yield myProcess.stdout.filter((chunk) => chunk.includes("ready")).expect();

  let result = yield fetch('http://localhost:3000').json();

  console.log('got result:', result);
});
```

Since we're sending a request to the server using `fetch`, the server must be
kept running. If it ever stops, then the operation will not be able to do its job, and so it will fail immediately.

[resource]: /docs/guides/resources
