import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

export type GameInputHandle = {
  focus: () => void
  el: HTMLInputElement | null
}

type GameInputProps = {
  value: string
  onValueChange: (value: string) => void
  /** Called after composition ends or on normal input when not composing. */
  onCommit: (value: string) => void
  disabled?: boolean
  readOnly?: boolean
  className?: string
  placeholder?: string
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
}

/**
 * Game input that ignores evaluation during IME / Ctrl+Shift+U composition.
 */
export const GameInput = forwardRef<GameInputHandle, GameInputProps>(
  function GameInput(
    {
      value,
      onValueChange,
      onCommit,
      disabled,
      readOnly,
      className,
      placeholder,
      onKeyDown,
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null)
    const composing = useRef(false)

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
      get el() {
        return inputRef.current
      },
    }))

    const handleInput = (e: FormEvent<HTMLInputElement>) => {
      const next = e.currentTarget.value
      onValueChange(next)
      if (!composing.current && !(e.nativeEvent as InputEvent).isComposing) {
        onCommit(next)
      }
    }

    return (
      <input
        ref={inputRef}
        type="text"
        className={className ?? 'minihry-input'}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onPaste={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onCompositionStart={() => {
          composing.current = true
        }}
        onCompositionEnd={(e) => {
          composing.current = false
          const next = e.currentTarget.value
          onValueChange(next)
          onCommit(next)
        }}
        onInput={handleInput}
        onKeyDown={onKeyDown}
      />
    )
  },
)
