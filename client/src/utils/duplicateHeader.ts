/**
 * Decision helper for a duplicate `num_presupuesto` on the header POST (create path).
 *
 * A previous save attempt can leave an orphan header (title/detail rows but no
 * footer). The auto-generated document number cannot advance on retry, so the
 * second POST collides. This function decides whether we can safely reuse that
 * partial artifact or must abort with a Spanish, user-facing message.
 */

export interface DuplicateHeaderInput {
  /** Document recovered by number, or null when recovery failed. */
  existing: DocumentLike | null;
  /** Client id of the document being saved (string or number). */
  clientId: string | number | null;
  /** Whether the recovered document already has a footer (fully saved). */
  hasFooter: boolean;
}

export interface DocumentLike {
  id?: string | number | null;
  num_presupuesto?: string | number | null;
  dataclient?: string | number | null;
}

export type DuplicateHeaderDecision =
  | { action: 'reuse' }
  | { action: 'abort'; message: string };

const label = (existing: DocumentLike): string => {
  const num = existing?.num_presupuesto;
  return num != null && String(num).trim() !== '' ? String(num) : 'PRE';
};

export function classifyDuplicateHeader({
  existing,
  clientId,
  hasFooter,
}: DuplicateHeaderInput): DuplicateHeaderDecision {
  // 1. Recovery failed or the payload has no usable id → cannot decide safely.
  if (!existing || existing.id == null || existing.id === '') {
    return {
      action: 'abort',
      message:
        'No se pudo recuperar el documento existente con ese número. ' +
        'Cierra y vuelve a abrir el formulario para intentarlo de nuevo.',
    };
  }

  // 2. The number belongs to a different client (loose comparison: values may
  //    arrive as string or number).
  // eslint-disable-next-line eqeqeq
  if (existing.dataclient != clientId) {
    return {
      action: 'abort',
      message: `El documento ${label(existing)} ya existe y pertenece a otro cliente. Elige un número diferente.`,
    };
  }

  // 3. Same client, but the document is already saved (has footer) → the user
  //    must pick another number instead of overwriting it.
  if (hasFooter) {
    return {
      action: 'abort',
      message: `El número ${label(existing)} ya pertenece a un documento guardado. Usa otro número.`,
    };
  }

  // 4. Same client, no footer → partial artifact of a failed save: reuse it.
  return { action: 'reuse' };
}
