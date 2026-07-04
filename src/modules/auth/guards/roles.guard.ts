import { Injectable, CanActivate, ExecutionContext, ForwardReference, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { Observable } from "rxjs";
@Injectable()
export class RolesGuard implements CanActivate{
    constructor (private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<string[]>(ROLES_KEY,[
            context.getHandler(),
            context.getClass()
        ]);
        if(!requiredRole) return true;
        const {user } = context.switchToHttp().getRequest();
        if(!requiredRole.includes(user.role)){
            throw new ForbiddenException("Bạn khong có quyen thuc hien thao tac nay")
        }
        return true
    }
}