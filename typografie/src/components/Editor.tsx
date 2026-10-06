import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { FontSize } from '../extensions/FontSize'
import { SequentialOrderedList } from '../extensions/SequentialOrderedList'
import { StyledHeading } from '../extensions/StyledHeading'
import { ShowHiddenChars } from '../extensions/ShowHiddenChars'
import {
  ImeUnderlineCleanup,
  SafeUnderline,
} from '../extensions/SafeUnderline'
import {
  FONTS,
  findFont,
  normalizeFontName,
  tipTapFontValue,
} from '../fonts'

import type { EditorConfig } from '../levels/types'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Link from '@tiptap/extension-link'

type EditorProps = {
  initialHtml: string
  onHtmlChange?: (html: string) => void
  config?: EditorConfig
  resetToken?: number
}

type TextStyleId =
  | 'normal'
  | 'title'
  | 'subtitle'
  | 'heading1'
  | 'heading2'
  | 'heading3'

const TEXT_STYLES: { id: TextStyleId; label: string }[] = [
  { id: 'normal', label: 'Normální text' },
  { id: 'title', label: 'Název' },
  { id: 'subtitle', label: 'Podnázev' },
  { id: 'heading1', label: 'Nadpis 1' },
  { id: 'heading2', label: 'Nadpis 2' },
  { id: 'heading3', label: 'Nadpis 3' },
]

const SPECIAL_CHARS = ['„', '“', '‚', '‘', '–', '…', '\u00A0', '°', '×', '−', '′', '″']

export { FONTS }

const DEFAULT_FONT_SIZE = 22

type ToolbarButtonProps = {
  label: ReactNode
  title: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  className?: string
}

function ToolbarButton({
  label,
  title,
  active = false,
  disabled = false,
  onClick,
  className = '',
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className={`toolbar-btn${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

type ToolbarMenuProps = {
  label: ReactNode
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  wide?: boolean
}

function ToolbarMenu({
  label,
  title,
  open,
  onOpenChange,
  children,
  wide = false,
}: ToolbarMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChange(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onOpenChange])

  return (
    <div className={`toolbar-menu${wide ? ' is-wide' : ''}`} ref={rootRef}>
      <button
        type="button"
        className={`toolbar-menu-trigger${open ? ' is-open' : ''}`}
        title={title}
        aria-label={title}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => onOpenChange(!open)}
      >
        <span className="toolbar-menu-label">{label}</span>
        <span className="toolbar-menu-caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {open ? (
        <div className="toolbar-menu-panel" role="menu" id={menuId}>
          {children}
        </div>
      ) : null}
    </div>
  )
}

function menuItemClass(active: boolean): string {
  return `toolbar-menu-item${active ? ' is-active' : ''}`
}

function getActiveTextStyle(editor: TiptapEditor): TextStyleId {
  if (editor.isActive('heading', { level: 1 })) {
    const style = editor.getAttributes('heading').paraStyle
    return style === 'h1' ? 'heading1' : 'title'
  }
  if (editor.isActive('heading', { level: 2 })) {
    const style = editor.getAttributes('heading').paraStyle
    return style === 'h2' ? 'heading2' : 'subtitle'
  }
  if (editor.isActive('heading', { level: 3 })) return 'heading3'
  return 'normal'
}

function applyTextStyle(editor: TiptapEditor, style: TextStyleId) {
  const chain = editor.chain().focus()
  switch (style) {
    case 'normal':
      chain.setParagraph().run()
      break
    case 'title':
      chain.setHeading({ level: 1 }).updateAttributes('heading', { paraStyle: 'title' }).run()
      break
    case 'subtitle':
      chain.setHeading({ level: 2 }).updateAttributes('heading', { paraStyle: 'subtitle' }).run()
      break
    case 'heading1':
      chain.setHeading({ level: 1 }).updateAttributes('heading', { paraStyle: 'h1' }).run()
      break
    case 'heading2':
      chain.setHeading({ level: 2 }).updateAttributes('heading', { paraStyle: 'h2' }).run()
      break
    case 'heading3':
      chain.setHeading({ level: 3 }).updateAttributes('heading', { paraStyle: 'h3' }).run()
      break
  }
}

function getCurrentFontSize(editor: TiptapEditor): number {
  const attrs = editor.getAttributes('textStyle')
  const raw = attrs.fontSize as string | undefined
  if (!raw) return DEFAULT_FONT_SIZE
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : DEFAULT_FONT_SIZE
}

function getCurrentFontLabel(editor: TiptapEditor): string {
  const family = editor.getAttributes('textStyle').fontFamily as
    | string
    | undefined
  const match = findFont(family)
  if (match) return match.label
  const raw = normalizeFontName(family)
  return raw || 'Arial'
}

function AlignIcon({
  align,
}: {
  align: 'left' | 'center' | 'right' | 'justify'
}) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      {align === 'left' && (
        <path d="M2 4h14M2 7h10M2 10h14M2 13h8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {align === 'center' && (
        <path d="M2 4h14M4 7h10M2 10h14M5 13h8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {align === 'right' && (
        <path d="M2 4h14M6 7h10M2 10h14M8 13h8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
      {align === 'justify' && (
        <path d="M2 4h14M2 7h14M2 10h14M2 13h14" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}
    </svg>
  )
}

function ListIcon({ kind }: { kind: 'bullet' | 'ordered' | 'task' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      {kind === 'bullet' && (
        <>
          <circle cx="3.5" cy="5" r="1.2" fill="currentColor" />
          <circle cx="3.5" cy="9" r="1.2" fill="currentColor" />
          <circle cx="3.5" cy="13" r="1.2" fill="currentColor" />
          <path d="M7 5h9M7 9h9M7 13h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {kind === 'ordered' && (
        <>
          <text x="1" y="6.5" fontSize="5.5" fill="currentColor" fontFamily="sans-serif">
            1
          </text>
          <text x="1" y="10.5" fontSize="5.5" fill="currentColor" fontFamily="sans-serif">
            2
          </text>
          <text x="1" y="14.5" fontSize="5.5" fill="currentColor" fontFamily="sans-serif">
            3
          </text>
          <path d="M7 5h9M7 9h9M7 13h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
      {kind === 'task' && (
        <>
          <rect x="1.5" y="3.5" width="4" height="4" rx="0.6" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <path d="M2.5 5.5l1.1 1.1 2-2" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M7 5h9M7 9h9M7 13h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="1.5" y="11.5" width="4" height="4" rx="0.6" stroke="currentColor" strokeWidth="1.2" fill="none" />
        </>
      )}
    </svg>
  )
}

export function Editor({
  initialHtml,
  onHtmlChange,
  config,
  resetToken = 0,
}: EditorProps) {
  const [openMenu, setOpenMenu] = useState<
    'style' | 'font' | 'align' | 'list' | 'chars' | null
  >(null)
  const [showHidden, setShowHidden] = useState(
    () => config?.showHiddenDefault ?? false,
  )
  const [pasteMsg, setPasteMsg] = useState<string | null>(null)
  const [uiFontSize, setUiFontSize] = useState(DEFAULT_FONT_SIZE)
  const [uiFontLabel, setUiFontLabel] = useState('Arial')
  const allowPaste = config?.allowPaste !== false
  const narrow = config?.width === 'narrow'
  const showSpecial = config?.specialCharsPanel === true

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        orderedList: false,
      }),
      StyledHeading.configure({ levels: [1, 2, 3] }),
      SequentialOrderedList,
      SafeUnderline,
      ImeUnderlineCleanup,
      Superscript,
      Subscript,
      Link.configure({ openOnClick: false, autolink: false }),
      TextStyle,
      FontFamily,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      ShowHiddenChars,
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: `docs-editor${showHidden ? ' show-hidden' : ''}`,
        spellcheck: 'false',
        autocorrect: 'off',
        autocapitalize: 'off',
      },
      handlePaste: () => {
        if (!allowPaste) {
          setPasteMsg('V této úloze není vkládání povoleno.')
          window.setTimeout(() => setPasteMsg(null), 2500)
          return true
        }
        return false
      },
      handleDrop: () => {
        if (!allowPaste) {
          setPasteMsg('V této úloze není vkládání povoleno.')
          window.setTimeout(() => setPasteMsg(null), 2500)
          return true
        }
        return false
      },
    },
    onCreate: ({ editor: current }) => {
      onHtmlChange?.(current.getHTML())
    },
    onUpdate: ({ editor: current }) => {
      onHtmlChange?.(current.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.commands.setContent(initialHtml, { emitUpdate: true })
  }, [editor, resetToken, initialHtml])

  useEffect(() => {
    setShowHidden(config?.showHiddenDefault ?? false)
  }, [config?.showHiddenDefault])

  useEffect(() => {
    if (!editor) return
    editor.commands.setShowHiddenChars(showHidden)
    const el = editor.view.dom
    el.classList.toggle('show-hidden', showHidden)
  }, [editor, showHidden])

  // Keep toolbar size/font in sync with caret (storedMarks don't always re-render)
  useEffect(() => {
    if (!editor) return
    const sync = () => {
      setUiFontSize(getCurrentFontSize(editor))
      setUiFontLabel(getCurrentFontLabel(editor))
    }
    sync()
    editor.on('selectionUpdate', sync)
    editor.on('transaction', sync)
    return () => {
      editor.off('selectionUpdate', sync)
      editor.off('transaction', sync)
    }
  }, [editor])

  if (!editor) {
    return <div className="editor-shell">Načítám editor…</div>
  }

  const activeStyle = getActiveTextStyle(editor)
  const activeStyleLabel =
    TEXT_STYLES.find((style) => style.id === activeStyle)?.label ??
    'Normální text'
  const fontSize = uiFontSize
  const fontLabel = uiFontLabel
  const currentFontKey = normalizeFontName(
    editor.getAttributes('textStyle').fontFamily as string | undefined,
  ).toLowerCase()
  const closeMenus = () => setOpenMenu(null)

  const bumpFontSize = (delta: number) => {
    const next = Math.min(96, Math.max(8, fontSize + delta))
    setUiFontSize(next)
    editor.chain().focus().setFontSize(`${next}px`).run()
  }

  const applyFont = (font: (typeof FONTS)[number]) => {
    setUiFontLabel(font.label)
    editor.chain().focus().setFontFamily(tipTapFontValue(font)).run()
    closeMenus()
  }

  const currentAlign: 'left' | 'center' | 'right' | 'justify' = editor.isActive({
    textAlign: 'center',
  })
    ? 'center'
    : editor.isActive({ textAlign: 'right' })
      ? 'right'
      : editor.isActive({ textAlign: 'justify' })
        ? 'justify'
        : 'left'

  const currentList: 'bullet' | 'ordered' | 'task' | null = editor.isActive(
    'taskList',
  )
    ? 'task'
    : editor.isActive('bulletList')
      ? 'bullet'
      : editor.isActive('orderedList')
        ? 'ordered'
        : null

  return (
    <div className={`editor-shell${narrow ? ' is-narrow' : ''}`}>
      {pasteMsg ? <p className="paste-blocked">{pasteMsg}</p> : null}
      <div className="toolbar" role="toolbar" aria-label="Formátování">
        <ToolbarMenu
          title="Styly"
          label={activeStyleLabel}
          wide
          open={openMenu === 'style'}
          onOpenChange={(open) => setOpenMenu(open ? 'style' : null)}
        >
          {TEXT_STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              role="menuitem"
              className={menuItemClass(activeStyle === style.id)}
              onClick={() => {
                applyTextStyle(editor, style.id)
                closeMenus()
              }}
            >
              <span className={`style-preview style-${style.id}`}>
                {style.label}
              </span>
            </button>
          ))}
        </ToolbarMenu>

        <ToolbarMenu
          title="Písmo"
          label={fontLabel}
          wide
          open={openMenu === 'font'}
          onOpenChange={(open) => setOpenMenu(open ? 'font' : null)}
        >
          {FONTS.map((font) => (
            <button
              key={font.label}
              type="button"
              role="menuitem"
              className={menuItemClass(
                currentFontKey === font.value.toLowerCase() ||
                  (!currentFontKey && font.value === 'Arial'),
              )}
              style={{ fontFamily: font.stack }}
              onClick={() => applyFont(font)}
            >
              {font.label}
            </button>
          ))}
        </ToolbarMenu>

        <div className="font-size-group" title="Velikost písma">
          <ToolbarButton
            label="−"
            title="Zmenšit písmo"
            onClick={() => bumpFontSize(-1)}
          />
          <span className="font-size-value">{fontSize}</span>
          <ToolbarButton
            label="+"
            title="Zvětšit písmo"
            onClick={() => bumpFontSize(1)}
          />
        </div>

        <span className="toolbar-sep" aria-hidden="true" />

        <ToolbarButton
          label="B"
          title="Tučné"
          className="is-bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="I"
          title="Kurzíva"
          className="is-italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="U"
          title="Podtržení"
          className="is-underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />

        <span className="toolbar-sep" aria-hidden="true" />

        <ToolbarMenu
          title="Zarovnání"
          label={<AlignIcon align={currentAlign} />}
          open={openMenu === 'align'}
          onOpenChange={(open) => setOpenMenu(open ? 'align' : null)}
        >
          {(
            [
              { id: 'left', label: 'Vlevo' },
              { id: 'center', label: 'Na střed' },
              { id: 'right', label: 'Vpravo' },
              { id: 'justify', label: 'Do bloku' },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              role="menuitem"
              className={menuItemClass(currentAlign === option.id)}
              onClick={() => {
                editor.chain().focus().setTextAlign(option.id).run()
                closeMenus()
              }}
            >
              <AlignIcon align={option.id} />
              <span>{option.label}</span>
            </button>
          ))}
        </ToolbarMenu>

        <ToolbarMenu
          title="Seznamy"
          label={<ListIcon kind={currentList ?? 'bullet'} />}
          open={openMenu === 'list'}
          onOpenChange={(open) => setOpenMenu(open ? 'list' : null)}
        >
          <button
            type="button"
            role="menuitem"
            className={menuItemClass(currentList === 'task')}
            onClick={() => {
              editor.chain().focus().toggleTaskList().run()
              closeMenus()
            }}
          >
            <ListIcon kind="task" />
            <span>Checklist</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuItemClass(currentList === 'bullet')}
            onClick={() => {
              editor.chain().focus().toggleBulletList().run()
              closeMenus()
            }}
          >
            <ListIcon kind="bullet" />
            <span>Odrážky</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={menuItemClass(currentList === 'ordered')}
            onClick={() => {
              editor.chain().focus().toggleOrderedList().run()
              closeMenus()
            }}
          >
            <ListIcon kind="ordered" />
            <span>Číslovaný seznam</span>
          </button>
        </ToolbarMenu>

        <span className="toolbar-sep" aria-hidden="true" />

        <ToolbarButton
          label="x²"
          title="Horní index"
          active={editor.isActive('superscript')}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
        />
        <ToolbarButton
          label="x₂"
          title="Dolní index"
          active={editor.isActive('subscript')}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
        />
        <ToolbarButton
          label="🔗"
          title="Odkaz"
          active={editor.isActive('link')}
          onClick={() => {
            if (editor.isActive('link')) {
              editor.chain().focus().unsetLink().run()
              return
            }
            const href = window.prompt('Adresa odkazu (https: nebo mailto:)')
            if (href) editor.chain().focus().setLink({ href }).run()
          }}
        />
        <ToolbarButton
          label="Tx"
          title="Vymazat formátování"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        />
        <ToolbarButton
          label="¶"
          title="Zobrazit skryté znaky"
          active={showHidden}
          onClick={() => setShowHidden((v) => !v)}
        />

        {showSpecial ? (
          <ToolbarMenu
            title="Speciální znaky"
            label="Ω"
            open={openMenu === 'chars'}
            onOpenChange={(open) => setOpenMenu(open ? 'chars' : null)}
          >
            {SPECIAL_CHARS.map((ch) => (
              <button
                key={ch}
                type="button"
                role="menuitem"
                className="toolbar-menu-item"
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .insertContent(ch === '\u00A0' ? '\u00A0' : ch)
                    .run()
                  closeMenus()
                }}
              >
                {ch === '\u00A0' ? 'NBSP' : ch}
              </button>
            ))}
          </ToolbarMenu>
        ) : null}
      </div>
      <EditorContent
        editor={editor}
        className={showHidden ? 'show-hidden-chars' : undefined}
      />
    </div>
  )
}
