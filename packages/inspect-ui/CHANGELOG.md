# @effection/inspect-ui

## \[2.1.4]

- Allow pass object with `Symbol.operation` as an operation
  - [3e7daa8](https://github.com/thefrontside/effection/commit/3e7daa82cce974ea6b4ff90764343594ae7cba13) add changelog on 2022-01-26
  - [c623a84](https://github.com/thefrontside/effection/commit/c623a8448dfef764a03b3af6a6b0afa9ee834ba9) remove fetch and process packages from changes list on 2022-01-26

## \[2.1.3]

- Remove redundant node-fetch from dependencies
  - Bumped due to a bump in effection.
  - [b4a87d5](https://github.com/thefrontside/effection/commit/b4a87d525d270e53b92543676c9fb10c7fd1edd7) Add change file for covector on 2022-01-24

## \[2.1.2]

- Extract `AbortSignal` from `@effection/fetch` to `@effection/core` as a resource
  - Bumped due to a bump in effection.
  - [8ac2e85](https://github.com/thefrontside/effection/commit/8ac2e8515ac2cb1ee6ed5a200f31d28024bfdae2) Add covector change file on 2021-11-18
  - [b6d0e15](https://github.com/thefrontside/effection/commit/b6d0e1502ca8345bf488aef695b16fe7a5a5945d) Patch for fetch and not minor on 2021-11-19

## \[2.1.1]

- Add missing dependency on @effection/dispatch
  - Bumped due to a bump in @effection/inspect-utils.
  - [90ca47d](https://github.com/thefrontside/effection/commit/90ca47d73e1d49826aa0248082689a3501d2aac0) Add dependency on dispatch on 2021-11-16

## \[2.1.0]

- Improve the internal communication protocol of the inspector for better efficiency
  - [eec3b77](https://github.com/thefrontside/effection/commit/eec3b77f0d252507d8e432dfab6bb6ce5f94db6b) Rewrite and improve inspector protocol on 2021-10-21
- Redesign inspector with a fresh new design and added functionality, including navigation, settings and stack traces
  - [f1ca2ed](https://github.com/thefrontside/effection/commit/f1ca2edecd3a22bbc9c40fc35d7f9908587d8ddf) Add changeset on 2021-11-08

## \[2.0.1]

- workaround borked 2.0 release https://status.npmjs.org/incidents/wy4002vc8ryc
  - Bumped due to a bump in effection.
  - [97711a7](https://github.com/thefrontside/effection/commit/97711a77419c8e539bff3060a9f3c1bae947f9b8) Work around borked NPM release on 2021-10-12

## \[2.0.0]

- Release Effection 2.0.0
  - [8bd89ad](https://github.com/thefrontside/effection/commit/8bd89ad40e42805ab6da0fd1b7a49beed9769865) Add 2.0 changeset on %as

## \[2.0.0-beta.22]

- Yielding to something which is not an operation no longer throws an internal error, but properly rejects the task.
  - Bumped due to a bump in @effection/core.
  - [a3ad19a](https://github.com/thefrontside/effection/commit/a3ad19a3177a731fee5cd2389ab898dee7b1788e) Fix yielding non operation bug on 2021-10-07

## \[2.0.0-beta.21]

- Fix a bug when using blockParent where the children are not getting halt on an explicit halt.
  - Bumped due to a bump in @effection/core.
  - [1cd9803](https://github.com/thefrontside/effection/commit/1cd98033d2641989114f9589c7d887954fa66781) Fix halting children for blockParent tasks on 2021-09-30

## \[2.0.0-beta.20]

- Add Stream `toBuffer` and Stream `buffered` so we have both options on either accessing the buffer directly or returning the stream.
  - Bumped due to a bump in @effection/events.
  - [fe60532](https://github.com/thefrontside/effection/commit/fe60532c3f8cfdd8b53c324b7ea8e38e437f080f) Add both toBuffer and buffered to Stream on 2021-09-30

## \[2.0.0-beta.19]

- Stream `buffer` returns the actual buffer and gives direct access to it
  - Bumped due to a bump in @effection/events.
  - [07c8f83](https://github.com/thefrontside/effection/commit/07c8f83b5968f347ca72795c447be411e66274ed) Stream `buffer` returns the actual buffer on 2021-09-30

## \[2.0.0-beta.18]

- - [0248d79](https://github.com/thefrontside/effection/commit/0248d79a33dcfc4200b0832aba975c9cad08981e) Add package readmes on 2021-09-28

## \[2.0.0-beta.17]

- Adjust the propagation of errors for resources to make it possible to catch errors from `init`
  - Bumped due to a bump in @effection/core.
  - [75a7248](https://github.com/thefrontside/effection/commit/75a7248ae13d1126bbcaf9b6223f348168e987d0) Catch errors thrown during resource init on 2021-09-21
- Enable support for resources in higher order operations `all`, `race` and `withTimeout`.
  - Bumped due to a bump in @effection/core.
  - [bbe6cdc](https://github.com/thefrontside/effection/commit/bbe6cdc44184a7669278d0d01ad23a2a79a69e52) Enable resource support for higher order operations on 2021-09-09

## \[2.0.0-beta.16]

- Revert `dist/**` in inspect-ui package.json
  - [b31d6b8](https://github.com/thefrontside/effection/commit/b31d6b87ac193f4489f4f006673e1f6ed58f0008) Revert  in inspect-ui package.json on 2021-09-10

## \[2.0.0-beta.15]

- fix files array in inspect package.json
  - [183958d](https://github.com/thefrontside/effection/commit/183958d92c9f056bd916b2acf172436da5f858a7) Fix inspect files export ([#528](https://github.com/thefrontside/effection/pull/528)) on 2021-09-10

## \[2.0.0-beta.14]

- Add @effection/fetch as a dependency and reexport it
  - Bumped due to a bump in @effection/core.
  - [5ab5d06](https://github.com/thefrontside/effection/commit/5ab5d0691af75f3583de97402b5aac12325e2918) Reexport @effection/fetch from effection package on 2021-08-26
- Share internal run loop among task, task future and task controller. Prevents race conditions which cause internal errors.
  - Bumped due to a bump in @effection/core.
  - [222d511](https://github.com/thefrontside/effection/commit/222d5116c388c5b597cc3ec5e0fb64b4d22b273a) Share event loop among controller, task and future on 2021-09-01
- Introduce task scope as an alternative to resources for being able to access the outer scope of an operation
  - Bumped due to a bump in @effection/core.
  - [3ed11bd](https://github.com/thefrontside/effection/commit/3ed11bd4f5d980cd130ea894a63acb57450c5aac) Make resource task accessible through init task on 2021-08-27
- Add `toString()` method to task for nicely formatted rendering of task structure
  - Bumped due to a bump in @effection/core.
  - [9a63928](https://github.com/thefrontside/effection/commit/9a6392836704ad527d6da5195f5736462d69bef8) Add toString output for tasks on 2021-08-31

## \[2.0.0-beta.13]

- Add support for special `expand` label which controls whether a given task is shown as expanded or collapsed in the inspector.
  - [db79c9b](https://github.com/thefrontside/effection/commit/db79c9b0fb571fc4cb45b71fb0cbdc5b5950ec3d) Add support for `expand` label on 2021-08-27
- Fix tree shaking being to aggressive by using sideEffects:true
  - [aa78ef8](https://github.com/thefrontside/effection/commit/aa78ef8eadba2bf4ea50a280c945d54c51e8723b) Enable side effects in inspect-ui package on 2021-08-27

## \[2.0.0-beta.12]

- Update core dependency
  - Bumped due to a bump in @effection/mocha.
  - [d92eee5](https://github.com/thefrontside/effection/commit/d92eee594fdb8dc6d8ab6a37b6aa362122e63f6e) Update core dependency on 2021-08-16

## \[2.0.0-beta.11]

- Use Object.create to wrap error objects rather than copying properties
  - Bumped due to a bump in @effection/core.
  - [a56ae2a](https://github.com/thefrontside/effection/commit/a56ae2af8a6247697b8b6253bd35b6d9e569613d) Use Object.create to create error object with trace on 2021-08-16

## \[2.0.0-beta.10]

- Expand and collapse tasks in inspector
  - [c7c1c55](https://github.com/thefrontside/effection/commit/c7c1c553fe2760ad5fdfe11aac04fa664977675e) Hide Expand/Collapse button when task has no children on 2021-08-10

## \[2.0.0-beta.9]

- Add sideEffects field to package.json
  - [383141d](https://github.com/thefrontside/effection/commit/383141dc556c6a781d98087f3b68085d5eb31173) Add sideEffects field to package.json ([#470](https://github.com/thefrontside/effection/pull/470)) on 2021-08-05

## \[2.0.0-beta.8]

- The `dist` directory didn't contain the `esm` and `cjs` directory. We copy the `package.json` for reference into the dist, and this broke the `files` resolution. Switch to using `dist-cjs` and `dist-esm` which allows us to avoid copying `package.json`.
  - [63fbcfb](https://github.com/thefrontside/effection/commit/63fbcfb8151bb7434f1cb8c58bfed25012ad2727) fix: @effection/core to ship dist/esm and dist/cjs on 2021-08-03
  - [7788e24](https://github.com/thefrontside/effection/commit/7788e2408bcff8180b24ce497043283c97b6dbaa) fix: @effection/core to ship dist-esm and dist-cjs on 2021-08-03
  - [6923a0f](https://github.com/thefrontside/effection/commit/6923a0fa1a84cd0788f8c9c1600ccf7539b08bbf) update change file with everything patched on 2021-08-03

## \[2.0.0-beta.7]

- Add esm builds
  - Bumped due to a bump in @effection/core.
  - [6660a46](https://github.com/thefrontside/effection/commit/6660a466a50c9b9c36829c2d52448ebbc0e7e6fb) Add esm build ([#462](https://github.com/thefrontside/effection/pull/462)) on 2021-08-03

## \[2.0.0-beta.6]

- remove accidentally compiled .js files from distributed sources
  - Bumped due to a bump in @effection/mocha.
  - [f0f0023](https://github.com/thefrontside/effection/commit/f0f002354743ae6d6f69bfe6df28ddc11d0f8be0) add changefile on 2021-07-26

## \[2.0.0-beta.5]

- Deprecate Future#resolve in favour of Future#produce.
  - Bumped due to a bump in @effection/core.
  - [7b8ce8e](https://github.com/thefrontside/effection/commit/7b8ce8ef1d46ddf10806d51b3f0ed1ef14e8f9cd) Depreacte Future#resolve in favour of Future#produce ([#437](https://github.com/thefrontside/effection/pull/437)) on 2021-07-22
  - [63f6424](https://github.com/thefrontside/effection/commit/63f64243373ae6c320b9a7564db666ca7efbb597) Replace covector files and delete changesets to trigger publish on 2021-07-23
  - [1bb643c](https://github.com/thefrontside/effection/commit/1bb643c0f1cfac5b849e3622c274ef0c04a93717) Re-add covector change file on 2021-07-23
- Upgrade typescript to 4.3.5 and replace tsdx with tsc
  - Bumped due to a bump in @effection/core.
  - [121bd40](https://github.com/thefrontside/effection/commit/121bd40e17609a82bce649c5fed34ee0754681b7) Add change file for typescript bump on 2021-07-23

## 2.0.0-beta.4

### Patch Changes

- Updated dependencies \[e297c86]
  - @effection/core@2.0.0-beta.4
  - @effection/events@2.0.0-beta.4
  - @effection/inspect-utils@2.0.0-beta.4
  - @effection/main@2.0.0-beta.4
  - @effection/subscription@2.0.0-beta.4

## 2.0.0-beta.3

### Patch Changes

- Updated dependencies \[248b0a6]
- Updated dependencies \[3e77f29]
- Updated dependencies \[5d95e6d]
- Updated dependencies \[9700b45]
- Updated dependencies \[9700b45]
  - @effection/main@2.0.0-beta.3
  - @effection/subscription@2.0.0-beta.3
  - @effection/events@2.0.0-beta.3
  - @effection/core@2.0.0-beta.3
  - @effection/inspect-utils@2.0.0-beta.3

## 2.0.0-beta.2

### Patch Changes

- Updated dependencies \[19414f0]
- Updated dependencies \[26a86cb]
- Updated dependencies \[9c76cc5]
- Updated dependencies \[f7e3344]
- Updated dependencies \[ac7c1ce]
  - @effection/core@2.0.0-beta.2
  - @effection/events@2.0.0-beta.2
  - @effection/inspect-utils@2.0.0-beta.2
  - @effection/main@2.0.0-beta.2
  - @effection/subscription@2.0.0-beta.2
