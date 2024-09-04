// src/components/editor/Editor.tsx
"use client";

import { $getRoot, $getSelection } from "lexical";
import { useEffect } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import Toolbars from "@/plugins/Toolbars";
import { HeadingNode } from "@lexical/rich-text";
import LoadState from "./loadState";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

export default function Editor() {
  const initialConfig = {
    namespace: "MyEditor",
    theme: exampleTheme,
    onError,
    nodes: [HeadingNode],
    editable: true,
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg h-[50vh] p-5">
      <LexicalComposer initialConfig={initialConfig}>
        <LoadState />
        <Toolbars />
        <RichTextPlugin
          contentEditable={<ContentEditable className=" focus:outline-none" />}
          placeholder={<div>Enter some text...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
}

const exampleTheme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "mb-4",
  quote: "border-l-4 border-gray-300 pl-4 italic",
  heading: {
    h1: "text-3xl font-bold mb-2",
    h2: "text-2xl font-bold mb-2",
    h3: "text-xl font-bold mb-2",
    h4: "text-lg font-bold mb-2",
    h5: "text-base font-bold mb-2",
    h6: "text-sm font-bold mb-2",
  },
  list: {
    nested: {
      listitem: "pl-4",
    },
    ol: "list-decimal pl-6",
    ul: "text-underline list-disc pl-6",
    listitem: "mb-1",
    listitemChecked: "line-through",
    listitemUnchecked: "",
  },
  hashtag: "text-blue-500",
  image: "max-w-full h-auto",
  link: "text-blue-600 underline",
  text: {
    bold: "font-bold",
    code: "bg-gray-100 p-1 rounded",
    italic: "italic",
    strikethrough: "line-through",
    subscript: "text-sm align-baseline",
    superscript: "text-sm align-super",
    underline: "underline",
    underlineStrikethrough: "line-through underline",
  },
  code: "bg-gray-900 text-white p-2 rounded",
  codeHighlight: {
    atrule: "text-green-500",
    attr: "text-blue-500",
    boolean: "text-red-500",
    builtin: "text-yellow-500",
    cdata: "text-gray-400",
    char: "text-red-600",
    class: "text-teal-500",
    "class-name": "text-teal-400",
    comment: "text-gray-500",
    constant: "text-pink-500",
    deleted: "text-red-700",
    doctype: "text-gray-500",
    entity: "text-orange-500",
    function: "text-cyan-500",
    important: "text-yellow-600",
    inserted: "text-green-500",
    keyword: "text-purple-500",
    namespace: "text-gray-600",
    number: "text-blue-300",
    operator: "text-gray-700",
    prolog: "text-gray-400",
    property: "text-pink-400",
    punctuation: "text-gray-600",
    regex: "text-orange-600",
    selector: "text-cyan-400",
    string: "text-green-300",
    symbol: "text-yellow-600",
    tag: "text-red-600",
    url: "text-blue-400",
    variable: "text-gray-700",
  },
};
