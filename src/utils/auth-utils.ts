import { UserRole } from '@videolot/videolot-prisma';

const UNAUTH = 'unauthenticated';
const HIERARCHY = [UNAUTH, UserRole.User, UserRole.Moderator, UserRole.Admin];
export function checkRole(minimalRole?: UserRole, currentRole?: UserRole): boolean {
    const role = currentRole || UNAUTH;
    const minRole = minimalRole || UNAUTH;

    return HIERARCHY.indexOf(role) >= HIERARCHY.indexOf(minRole);
}
