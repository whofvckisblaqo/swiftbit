import { verifyToken } from './jwt';

export function requireAdmin(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return null;
  try {
    const payload = verifyToken(token);
    if (payload.role !== 'admin') return null;
    return payload;
  } catch { return null; }
}
