import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    const tenantId = request.headers['x-tenant-id'];

    if (!tenantId) {
      throw new Error('x-tenant-id header is required');
    }

    const tenantIdNum = parseInt(tenantId, 10);

    if (isNaN(tenantIdNum)) {
      throw new Error('x-tenant-id must be a valid number');
    }

    return tenantIdNum;
  },
);