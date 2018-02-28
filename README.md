# reason-interface-generator

Generate ReasonML/OCaml interface files from Atom editor.

![Demo](./assets/demo.gif?raw=true)

## Installation

```
apm install reason-interface-generator
```

You also need:

* [BuckleScript](https://bucklescript.github.io/docs/en/installation.html)<br>
  _If you use global installation, everything should work out of the box. Otherwise, configure path to your `bsc` binary via package settings._
* Language syntax package
  * [language-ocaml](https://atom.io/packages/language-ocaml) for OCaml
  * [language-reason](https://atom.io/packages/language-reason) for ReasonML

## Usage

### Via context menu

* right click in buffer with `.re`/`.ml` file -> `Generate Reason/OCaml interface file`
* right click on `.re`/`.ml` file in tree view -> `Generate Reason/OCaml interface file`<br>
  _You must click exactly on filename, not on the file's row._

### Via command
Package provides only one command.

```
reason-interface-generator:generate
```

No default keybinding is set, but it can be configured in your keymap.

```cson
'atom-workspace atom-text-editor:not([mini])':
  'ctrl-alt-g': 'reason-interface-generator:generate'
```

## TODO

* [ ] Support namespaces.
* [ ] Provide setting to ask before overwriting existing interface file.

## Licence

MIT.
