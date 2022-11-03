import {
  Static,
  Type
} from '../deps.ts';

export const LogTailEntry = Type.Object({
  id: Type.String(),
  serviceID: Type.String(),
  deployID: Type.String(),
  timestamp: Type.Number(),
  text: Type.String(),
});
export type LogTailEntry = Static<typeof LogTailEntry>;

