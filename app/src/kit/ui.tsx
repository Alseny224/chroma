// Composants Chroma — nécessitent theme.css (ou l'export Tailwind) + components.css.
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type StatusTone = Exclude<Tone, 'neutral' | 'primary'>;

// --- Bouton -----------------------------------------------------------------

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', type = 'button', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx('ui-btn', `ui-btn--${variant}`, size !== 'md' && `ui-btn--${size}`, className)}
      {...props}
    />
  );
});

// --- Champs -------------------------------------------------------------------

export interface FieldProps {
  label: string;
  /** Rendu en fonction de l'identifiant et des attributs d'accessibilité du champ. */
  children: (field: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: true }) => ReactNode;
  help?: ReactNode;
  error?: ReactNode;
  className?: string;
}

/** Libellé + champ + aide/erreur, reliés pour les lecteurs d'écran. */
export function Field({ label, children, help, error, className }: FieldProps) {
  const id = useId();
  const noteId = `${id}-note`;
  const note = error ?? help;
  return (
    <div className={cx('ui-field', className)}>
      <label className="ui-label" htmlFor={id}>
        {label}
      </label>
      {children({ id, 'aria-describedby': note ? noteId : undefined, 'aria-invalid': error ? true : undefined })}
      {note && (
        <p id={noteId} className={cx('ui-help', error ? 'ui-help--error' : false)}>
          {note}
        </p>
      )}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cx('ui-input', className)} {...props} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, ...props },
  ref,
) {
  return <select ref={ref} className={cx('ui-select', className)} {...props} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cx('ui-textarea', className)} {...props} />;
  },
);

interface ChoiceProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...props }: ChoiceProps) {
  return (
    <label className={cx('ui-check', className)}>
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  );
}

export function Radio({ label, className, ...props }: ChoiceProps) {
  return (
    <label className={cx('ui-check', className)}>
      <input type="radio" {...props} />
      <span>{label}</span>
    </label>
  );
}

export function Switch({ label, className, ...props }: ChoiceProps) {
  return (
    <label className={cx('ui-switch', className)}>
      <input type="checkbox" role="switch" {...props} />
      <span>{label}</span>
    </label>
  );
}

// --- Affichage --------------------------------------------------------------

export function Badge({ tone = 'neutral', className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cx('ui-badge', `ui-badge--${tone}`, className)} {...props} />;
}

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: StatusTone;
  title?: ReactNode;
}

export function Alert({ tone = 'info', title, children, className, ...props }: AlertProps) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cx('ui-alert', `ui-alert--${tone}`, className)} {...props}>
      {title && <div className="ui-alert__title">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('ui-card', className)} {...props} />;
}

export function CardHeader({
  title,
  description,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'title'> & { title: ReactNode; description?: ReactNode }) {
  return (
    <div className={cx('ui-card__header', className)} {...props}>
      <h3 className="ui-card__title">{title}</h3>
      {description && <p className="ui-card__description">{description}</p>}
    </div>
  );
}

export function CardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('ui-card__body', className)} {...props} />;
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('ui-card__footer', className)} {...props} />;
}

export function Avatar({ name, src, className }: { name: string; src?: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <span className={cx('ui-avatar', className)} title={name}>
      {src ? <img src={src} alt={name} /> : <span aria-label={name}>{initials}</span>}
    </span>
  );
}

export function Progress({ value, max = 100, label, className }: { value: number; max?: number; label: string; className?: string }) {
  return <progress className={cx('ui-progress', className)} value={value} max={max} aria-label={label} />;
}

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return <table className={cx('ui-table', className)} {...props} />;
}

// --- Onglets ----------------------------------------------------------------

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
}

export function Tabs({ items, defaultTab, label }: { items: TabItem[]; defaultTab?: string; label: string }) {
  const [active, setActive] = useState(defaultTab ?? items[0]?.id);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Flèches gauche/droite, Début/Fin : navigation clavier des onglets (pattern ARIA).
  const onKeyDown = (e: KeyboardEvent, index: number) => {
    const last = items.length - 1;
    const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[
      e.key
    ];
    if (next === undefined) return;
    e.preventDefault();
    setActive(items[next].id);
    refs.current[next]?.focus();
  };

  return (
    <div className="ui-tabs">
      <div role="tablist" aria-label={label} className="ui-tabs__list">
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${item.id}`}
            aria-controls={`${base}-panel-${item.id}`}
            aria-selected={active === item.id}
            tabIndex={active === item.id ? 0 : -1}
            className="ui-tab"
            onClick={() => setActive(item.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-panel-${item.id}`}
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={active !== item.id}
          className="ui-tabs__panel"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

// --- Modale et toast --------------------------------------------------------

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

/** Modale native (<dialog>) : focus piégé, Échap et fond gérés par le navigateur. */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="ui-modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="ui-modal__header">
        <h2 id={titleId} className="ui-modal__title">
          {title}
        </h2>
      </div>
      {children && <div className="ui-modal__body">{children}</div>}
      {footer && <div className="ui-modal__footer">{footer}</div>}
    </dialog>
  );
}

export function Toast({
  tone = 'info',
  title,
  children,
  onClose,
}: {
  tone?: StatusTone;
  title: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div role="status" className={cx('ui-toast', `ui-toast--${tone}`)}>
      <div className="ui-toast__content">
        <span className="ui-toast__title">{title}</span>
        {children && <span>{children}</span>}
      </div>
      {onClose && (
        <button type="button" className="ui-toast__close" aria-label="Fermer" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}
