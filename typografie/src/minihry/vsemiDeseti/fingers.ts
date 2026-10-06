/** Finger ids and colors (§1.1). */

export type FingerId =
  | 'L5'
  | 'L4'
  | 'L3'
  | 'L2'
  | 'L1'
  | 'R1'
  | 'R2'
  | 'R3'
  | 'R4'
  | 'R5'

export const FINGER_COLOR: Record<FingerId, string> = {
  L5: '#6CCB4F',
  R5: '#6CCB4F',
  L4: '#E8197D',
  R4: '#E8197D',
  L3: '#2D3A8C',
  R3: '#2D3A8C',
  L2: '#1BA6DB',
  R2: '#1BA6DB',
  L1: '#F5D328',
  R1: '#F5D328',
}

export const FINGER_NAME: Record<FingerId, string> = {
  L5: 'levý malíček',
  L4: 'levý prsteníček',
  L3: 'levý prostředníček',
  L2: 'levý ukazováček',
  L1: 'levý palec',
  R1: 'pravý palec',
  R2: 'pravý ukazováček',
  R3: 'pravý prostředníček',
  R4: 'pravý prsteníček',
  R5: 'pravý malíček',
}

export function isLeftFinger(f: FingerId): boolean {
  return f.startsWith('L')
}

/** Shift for uppercase: letter on left hand → right Shift (R5), else left Shift (L5). */
export function shiftFingerForLetter(letterFinger: FingerId): FingerId {
  return isLeftFinger(letterFinger) ? 'R5' : 'L5'
}
