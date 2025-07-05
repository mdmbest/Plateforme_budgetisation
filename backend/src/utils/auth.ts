import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import { User, JwtPayload, AuthenticatedRequest } from '../types';

// Hashage du mot de passe
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.security.bcryptRounds);
};

// Vérification du mot de passe
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Génération du token JWT
export const generateToken = (user: User): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as any);
};

// Vérification du token JWT
export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

// Middleware d'authentification
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Token d\'accès requis',
    });
    return;
  }

  const payload = verifyToken(token);
  if (!payload) {
    res.status(403).json({
      success: false,
      error: 'Token invalide ou expiré',
    });
    return;
  }

  // Ajouter les informations utilisateur à la requête
  req.user = {
    id: payload.userId,
    email: payload.email,
    role: payload.role,
  } as User;

  next();
};

// Middleware de vérification des rôles
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentification requise',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes',
      });
      return;
    }

    next();
  };
};

// Middleware de vérification des permissions
export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentification requise',
      });
      return;
    }

    const userRole = req.user.role;
    const userPermissions = config.roles[userRole] || [];

    if (!userPermissions.includes('*') && !userPermissions.includes(permission)) {
      res.status(403).json({
        success: false,
        error: 'Permission insuffisante',
      });
      return;
    }

    next();
  };
};

// Fonction pour extraire le token depuis les headers
export const extractTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
};

// Fonction pour obtenir l'utilisateur depuis le token
export const getUserFromToken = (token: string): JwtPayload | null => {
  return verifyToken(token);
}; 