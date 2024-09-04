// src/plugins/Toolbars.tsx
"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { Button, notification } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  SpotifyOutlined,
  MenuOutlined,
} from "@ant-design/icons";

const LowPriority = 1;

function Divider() {
  return <div className="border-t border-gray-300 my-2" />;
}

const Toolbars: FC = () => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [lineHeight, setLineHeight] = useState("normal");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  const handleSave = async () => {
    // Get editor state as JSON
    const editorState = editor.getEditorState();
    const serializedContent = editorState.toJSON();

    console.log("Sending data to API:", {
      title,
      slug,
      content: serializedContent,
    });

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, slug, content: serializedContent }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Save successful:", data);
      notification.success({
        message: "Save successful!",
      });
    } catch (error) {
      console.error("Error saving content:", error);
      notification.error({
        message: "Error saving content.",
      });
    }
  };

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  const handleHeading = (level: number) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        let headingTag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h1"; // Default to 'h1'

        switch (level) {
          case 1:
            headingTag = "h1";
            break;
          case 2:
            headingTag = "h2";
            break;
          case 3:
            headingTag = "h3";
            break;
          case 4:
            headingTag = "h4";
            break;
          case 5:
            headingTag = "h5";
            break;
          case 6:
            headingTag = "h6";
            break;
          default:
            headingTag = "h1"; // Default to 'h1' if the level is not recognized
            break;
        }

        // Set the heading type
        $setBlocksType(selection, () => $createHeadingNode(headingTag));
      }
    });
  };

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter slug"
          />
        </div>

        <div
          className="flex space-x-4 p-2 border-b border-gray-300"
          ref={toolbarRef}
        >
          <button
            disabled={!canUndo}
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
            className="p-2 rounded hover:bg-gray-200"
            aria-label="Undo"
          >
            <UndoOutlined />
          </button>
          <button
            disabled={!canRedo}
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
            className="p-2 rounded hover:bg-gray-200"
            aria-label="Redo"
          >
            <RedoOutlined />
          </button>
          <button
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
            className={`p-2 rounded ${isBold ? "bg-gray-200" : ""}`}
            aria-label="Bold"
          >
            <BoldOutlined />
          </button>
          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
            }
            className={`p-2 rounded ${isItalic ? "bg-gray-200" : ""}`}
            aria-label="Italic"
          >
            <ItalicOutlined />
          </button>
          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
            }
            className={`p-2 rounded ${isUnderline ? "bg-gray-200" : ""}`}
            aria-label="Underline"
          >
            <UnderlineOutlined />
          </button>
          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
            }
            className={`p-2 rounded ${isStrikethrough ? "bg-gray-200" : ""}`}
            aria-label="Strikethrough"
          >
            <StrikethroughOutlined />
          </button>
          <button
            onClick={() => handleHeading(1)}
            className="p-2 rounded"
            aria-label="Heading 1"
          >
            h1
          </button>
          <button
            onClick={() => handleHeading(2)}
            className="p-2 rounded"
            aria-label="Heading 2"
          >
            h2
          </button>
          <button
            onClick={() => handleHeading(3)}
            className="p-2 rounded"
            aria-label="Heading 3"
          >
            h3
          </button>
          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
            }
            className="p-2 rounded"
            aria-label="Align Left"
          >
            <AlignLeftOutlined />
          </button>
          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
            }
            className="p-2 rounded"
            aria-label="Align Center"
          >
            <AlignCenterOutlined />
          </button>
          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
            }
            className="p-2 rounded"
            aria-label="Align Right"
          >
            <AlignRightOutlined />
          </button>
          <button
            onClick={() =>
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
            }
            className="p-2 rounded"
            aria-label="Justify"
          >
            <SpotifyOutlined />
          </button>
        </div>
      </form>
      <button
        onClick={handleSave}
        className="p-2 bg-blue-500 text-white rounded mt-4"
      >
        Save
      </button>
    </div>
  );
};

export default Toolbars;
