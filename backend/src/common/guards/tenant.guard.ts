import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const headerTenantId = request.headers['x-tenant-id'];

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    if (!headerTenantId) {
      throw new ForbiddenException('x-tenant-id header is required');
    }

    const headerId = parseInt(headerTenantId, 10);
    if (isNaN(headerId) || headerId !== user.tenantId) {
      throw new ForbiddenException(
        'x-tenant-id must match your tenant; access denied',
      );
    }

    return true;
  }
}
