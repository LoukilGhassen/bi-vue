import { useAuthStore } from "@/store/useAuth";
import { useWebElementStore } from "@/store/useWebElementModule";

export const can = (privilege:string,webElement:string) => {
    const { currentUser } = (useAuthStore());
    const { webElementPermission } = (useWebElementStore());   
    if(privilege === 'access'){
      return webElementPermission[webElement] && webElementPermission[webElement].permissions.some((permission:any) => currentUser.user_metadata.userTypes.includes(permission.role.tag) && permission.hasAccess);
    }
    if(privilege === 'read'){
      return webElementPermission[webElement] && webElementPermission[webElement].permissions.some((permission:any) => currentUser.user_metadata.userTypes.includes(permission.role.tag) && permission.hasAccess && (permission.listIdPermissionTypeObject.tag === 'read' || permission.listIdPermissionTypeObject.tag === 'edit') );
    }
    if(privilege === 'edit'){
      return webElementPermission[webElement] && webElementPermission[webElement].permissions.some((permission:any) => currentUser.user_metadata.userTypes.includes(permission.role.tag) && permission.hasAccess && permission.listIdPermissionTypeObject.tag === 'edit');
    }
    return false
}