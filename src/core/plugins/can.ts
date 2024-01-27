import { App, Plugin } from 'vue';
import { useAuthStore } from "@/store/useAuth";
import { useWebElementStore } from '@/store/useWebElementModule';
import { can } from '../helpers/permission';
 
const permissionPlugin: Plugin = {
  install: (app: App) => {

    app.config.globalProperties.$can = (privilege:string,webElement:string) => {
      return(can(privilege,webElement))
    };
  },
};

export default permissionPlugin;
