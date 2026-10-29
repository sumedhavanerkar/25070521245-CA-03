import 'dotenv/config';

// Shared JWT configuration ensuring signToken and protect middleware always use the exact same secret
export const JWT_SECRET =
  process.env.JWT_SECRET || 'clf_fallback_jwt_secret_key_campus_portal_2026';

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
