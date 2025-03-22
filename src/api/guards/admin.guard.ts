import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from '../../core/models/user.model';
import { AppLoggerService } from '../../infra/logging/logger.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly logger: AppLoggerService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // The user is attached to the request by the JWT strategy
    const user = request.user;
    
    // Log the attempt
    this.logger.log(
      `Admin guard: ${user ? 'Authenticated' : 'Unauthenticated'} user attempting to access admin route`,
      'AdminGuard'
    );
    
    // Check if user exists and has admin role
    if (!user || user.role !== UserRole.ADMIN) {
      this.logger.warn('Unauthorized access attempt to admin route', 'AdminGuard');
      throw new ForbiddenException('Only administrators can access this resource');
    }
    
    return true;
  }
} 