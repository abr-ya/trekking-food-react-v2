import { useEffect, useRef } from "react";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CreateLink,
  DiffSourceToggleWrapper,
  diffSourcePlugin,
  headingsPlugin,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  quotePlugin,
  Separator,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  type ViewMode,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import "./markdown-editor.css";

import { cn } from "@/lib/utils";

const SOURCE_MODE_OPTIONS: ViewMode[] = ["rich-text", "source"];

const markdownEditorPlugins = [
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
  listsPlugin(),
  quotePlugin(),
  thematicBreakPlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  tablePlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      bash: "Bash",
      css: "CSS",
      html: "HTML",
      js: "JavaScript",
      json: "JSON",
      markdown: "Markdown",
      ts: "TypeScript",
      tsx: "TSX",
      txt: "Plain text",
    },
  }),
  diffSourcePlugin({ viewMode: "rich-text" }),
  markdownShortcutPlugin(),
  toolbarPlugin({
    toolbarClassName: "markdown-editor-toolbar",
    toolbarContents: () => (
      <DiffSourceToggleWrapper options={SOURCE_MODE_OPTIONS}>
        <UndoRedo />
        <Separator />
        <BlockTypeSelect />
        <BoldItalicUnderlineToggles />
        <Separator />
        <ListsToggle />
        <Separator />
        <CreateLink />
        <InsertTable />
        <InsertThematicBreak />
        <InsertCodeBlock />
      </DiffSourceToggleWrapper>
    ),
  }),
];

export type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  contentEditableClassName?: string;
  "aria-invalid"?: boolean;
};

export const MarkdownEditor = ({
  value,
  onChange,
  onBlur,
  placeholder,
  readOnly = false,
  className,
  contentEditableClassName,
  "aria-invalid": ariaInvalid = false,
}: MarkdownEditorProps) => {
  const editorRef = useRef<MDXEditorMethods>(null);
  const currentValueRef = useRef(value);

  useEffect(() => {
    if (value !== currentValueRef.current) {
      editorRef.current?.setMarkdown(value);
      currentValueRef.current = value;
    }
  }, [value]);

  const handleChange = (nextValue: string) => {
    currentValueRef.current = nextValue;
    onChange(nextValue);
  };

  return (
    <MDXEditor
      ref={editorRef}
      markdown={value}
      onChange={handleChange}
      onBlur={onBlur}
      readOnly={readOnly}
      placeholder={placeholder}
      plugins={markdownEditorPlugins}
      suppressHtmlProcessing
      className={cn(
        "markdown-editor overflow-hidden rounded-md border border-input bg-background shadow-xs",
        ariaInvalid && "border-destructive",
        readOnly && "opacity-70",
        className,
      )}
      contentEditableClassName={cn(
        "prose prose-sm min-h-72 max-w-none px-3 py-3 outline-none dark:prose-invert",
        contentEditableClassName,
      )}
    />
  );
};
