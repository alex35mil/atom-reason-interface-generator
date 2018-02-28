"use babel";

import { CompositeDisposable } from "atom";

import cp from "child_process";
import fs from "fs";
import path from "path";

const RE = "re";
const ML = "ml";

export default {
  config: {
    bsc: {
      type: "string",
      title: "bsc",
      description: "The path to the `bsc` binary.",
      default: "bsc",
      order: 10,
    },
  },

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add('atom-text-editor[data-grammar="source reason"]', {
        "reason-interface-generator:generate": () =>
          this.generateInterfaceFromEditor(RE),
      }),
      atom.commands.add('atom-text-editor[data-grammar="source ocaml"]', {
        "reason-interface-generator:generate": () =>
          this.generateInterfaceFromEditor(ML),
      }),
      atom.commands.add(".tree-view .file .name[data-name$=\\.re]", {
        "reason-interface-generator:generate": event =>
          this.generateInterfaceFromTreeView(event, RE),
      }),
      atom.commands.add(".tree-view .file .name[data-name$=\\.ml]", {
        "reason-interface-generator:generate": event =>
          this.generateInterfaceFromTreeView(event, ML),
      }),
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return null;
  },

  generateInterfaceFromTreeView(event, ext) {
    this.generateInterface(event.target.dataset.path, ext);
  },

  generateInterfaceFromEditor(ext) {
    const srcAbsPath = atom.workspace.getActiveTextEditor().getPath();
    if (!srcAbsPath) {
      this.showWarning(
        "Can't generate interface file from unsaved buffer. Save source file first.",
      );
      return;
    }
    this.generateInterface(srcAbsPath, ext);
  },

  generateInterface(srcAbsPath, ext) {
    const [root, srcRelPath] = atom.project.relativizePath(srcAbsPath);
    const baseRelPath = srcRelPath.substring(0, srcRelPath.length - 2);
    const cmiAbsPath = path.join(root, "lib", "bs", baseRelPath + "cmi");
    const interfaceAbsPath = path.join(root, baseRelPath + ext + "i");
    const bscBin = atom.config.get("reason-interface-generator.bsc");
    const cmd =
      ext === RE
        ? `${bscBin} -bs-re-out ${cmiAbsPath}`
        : `${bscBin} ${cmiAbsPath}`;
    cp.exec(cmd, (error, stdout) => {
      if (error) {
        this.showError("Oops! Can't generate interface file", error);
        return;
      }
      fs.writeFile(interfaceAbsPath, stdout, error => {
        if (error) {
          this.showError("Oops! Can't write generated interface file", error);
          return;
        }
        atom.workspace.open(interfaceAbsPath);
      });
    });
  },

  showWarning(message, error) {
    atom.notifications.addWarning(message, {
      dismissable: true,
    });
  },

  showError(message, error) {
    atom.notifications.addError(message, {
      detail: error.stack.toString(),
      dismissable: true,
    });
  },
};
