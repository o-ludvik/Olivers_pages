import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { Editor as TiptapEditor } from '@tiptap/react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { FontFamily } from '@tiptap/extension-font-family'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { FontSize } from '../extensions/FontSize'
import { SequentialOrderedList } from '../extensions/SequentialOrderedList'

type EditorProps = {
  initialHtml: string
  onHtmlChange?: (html: string) => void
}

type TextStyleId = 'normal' | 'title' | 'subtitle' | 'heading1' | 'heading2'

const TEXT_STYLES: { id: TextStyleId; label: string }[] = [
  { id: 'normal', label: 'Normální text' },
  { id: 'title', label: 'Nadpis' },
  { id: 'subtitle', label: 'Podnadpis' },
  { id: 'heading1', label: 'Nadpis 1' },
  { id: 'heading2', label: 'Nadpis 2' },
]

const FONTS = [
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: '"Comic Sans MS", "Comic Sans", cursive', label: 'Comic Sans' },
  { value: 'Georgia, serif', label: 'Georgia' },
]

const DEFAULT_FONT_SIZE = 15

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
  if (editor.isActive('heading', { level: 1 })) return 'title'
  if (editor.isActive('heading', { level: 2 })) return 'subtitle'
  if (editor.isActive('heading', { level: 3 })) return 'heading1'
  if (editor.isActive('heading', { level: 4 })) return 'heading2'
  return 'normal'
}

function applyTextStyle(editor: TiptapEditor, style: TextStyleId) {
  const chain = editor.chain().focus()
  switch (style) {
    case 'normal':
      chain.setParagraph().run()
      break
    case 'title':
      chain.setHeading({ level: 1 }).run()
      break
    case 'subtitle':
      chain.setHeading({ level: 2 }).run()
      break
    case 'heading1':
      chain.setHeading({ level: 3 }).run()
      break
    case 'heading2':
      chain.setHeading({ level: 4 }).run()
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
  if (!family) return 'Arial'
  const match = FONTS.find((font) => font.value === family)
  return match?.label ?? 'Arial'
}

function AlignIcon({ align }: { align: 'left' | 'center' | 'right' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      {align === 'left' && (
        <>
          <path d="M2 4h14M2 7h10M2 10h14M2 13h8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {align === 'center' && (
        <>
          <path d="M2 4h14M4 7h10M2 10h14M5 13h8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      )}
      {align === 'right' && (
        <>
          <path d="M2 4h14M6 7h10M2 10h14M8 13h8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
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

export function Editor({ initialHtml, onHtmlChange }: EditorProps) {
  const [openMenu, setOpenMenu] = useState<
    'style' | 'font' | 'align' | 'list' | null
  >(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        orderedList: false,
      }),
      SequentialOrderedList,
      Underline,
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
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: 'docs-editor',
        spellcheck: 'false',
      },
    },
    onCreate: ({ editor: current }) => {
      onHtmlChange?.(current.getHTML())
    },
    onUpdate: ({ editor: current }) => {
      onHtmlChange?.(current.getHTML())
    },
  })

  if (!editor) {
    return <div className="editor-shell">Načítám editor…</div>
  }

  const activeStyle = getActiveTextStyle(editor)
  const activeStyleLabel =
    TEXT_STYLES.find((style) => style.id === activeStyle)?.label ??
    'Normální text'
  const fontSize = getCurrentFontSize(editor)
  const fontLabel = getCurrentFontLabel(editor)

  const currentAlign: 'left' | 'center' | 'right' = editor.isActive({
    textAlign: 'center',
  })
    ? 'center'
    : editor.isActive({ textAlign: 'right' })
      ? 'right'
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

  const closeMenus = () => setOpenMenu(null)

  return (
    <div className="editor-shell">
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
                editor.isActive('textStyle', { fontFamily: font.value }) ||
                  (!editor.getAttributes('textStyle').fontFamily &&
                    font.label === 'Arial'),
              )}
              style={{ fontFamily: font.value }}
              onClick={() => {
                editor.chain().focus().setFontFamily(font.value).run()
                closeMenus()
              }}
            >
              {font.label}
            </button>
          ))}
        </ToolbarMenu>

        <div className="font-size-group" title="Velikost písma">
          <ToolbarButton
            label="−"
            title="Zmenšit písmo"
            onClick={() => {
              const next = Math.max(8, fontSize - 1)
              editor.chain().focus().setFontSize(`${next}px`).run()
            }}
          />
          <span className="font-size-value">{fontSize}</span>
          <ToolbarButton
            label="+"
            title="Zvětšit písmo"
            onClick={() => {
              const next = Math.min(96, fontSize + 1)
              editor.chain().focus().setFontSize(`${next}px`).run()
            }}
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
              <span>
                {option.label} ({option.id === 'left' ? 'L' : option.id === 'center' ? 'C' : 'R'})
              </span>
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
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
