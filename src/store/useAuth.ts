import { defineStore } from "pinia";
import { authService } from "@/core/services/AuthService";
import service from "@/service";
import { Provider } from "@supabase/supabase-js";
import { supabase } from "@/core/services/SupabaseClientService";
import { useWebElementStore } from "./useWebElementModule";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      currentUser: null as any,
      accessToken: "" as string | undefined,
      refreshToken: "" as string | undefined,
      isLoggedIn: null as null | boolean,
    };
  },
  actions: {
    async login(email: string, password: string, rememberMe: boolean) {
      try {
        const { session } = await authService.signInWithEmail(email, password, rememberMe);
        const { fetchWebElementsPermissions } = useWebElementStore();
        this.isLoggedIn = true;
        this.currentUser = session?.user;
        this.accessToken = session?.access_token;
        this.refreshToken = session?.refresh_token!;
        service.setBaseApiParams({
          headers: {
            Authorization: "Bearer " + session?.access_token,
          },
        });
        await fetchWebElementsPermissions({
          "where[listIdWebElementTypeObject][tag]":'WebElelementPermission'
        })

      } catch (error: any) {
        console.log(error?.message, "error login");
        throw new error("error login")
      }
    },
    async loginWithProvider(provider: Provider) {
      try {
        const { fetchWebElementsPermissions } = useWebElementStore();
        const {result} = await authService.signInWithProvider(provider);
        this.isLoggedIn = true;
        this.currentUser = result.session?.user;
        this.accessToken = result.session?.access_token;
        this.refreshToken = result.session?.refresh_token!;
        service.setBaseApiParams({
          headers: {
            Authorization: "Bearer " + result.session?.access_token,
          },
        });
        await fetchWebElementsPermissions({
          "where[listIdWebElementTypeObject][tag]":'WebElelementPermission'
        })
        return {data : result.session , error : null};
         

      } catch (error: any) {
        console.log(error?.message, "error login");
        return {data : null , error : error};
      }
    },
    async signUp(email: string, password: string, firstName: string, lastName: string, role: string,rememberMe:boolean) {
      try {
        const result = await authService.signUp(email, password, firstName, lastName, role , rememberMe);
        return result;
      } catch (error) {
        console.log(error, "error signup");
      }
    },
    async resetByEmail(email: string) {
      await authService.resetByEmail(email);
    },
    async reset(password: string) {
      await authService.reset(password);
    },
    async logout() {
      await authService.signOut();
      this.currentUser = null;
      this.accessToken = "";
      this.refreshToken = "";
      this.isLoggedIn = false;
    },
    async getCurrent() {
      const result = await authService.getCurrent();
      this.isLoggedIn = result.isLoggedIn;
      const { fetchWebElementsPermissions } = useWebElementStore();
      if (result.session) {
        this.currentUser = result.session.user;
        this.accessToken = result.session.access_token;
        this.refreshToken = result.session.refresh_token!;
        await service.setBaseApiParams({
          headers: {
            Authorization: "Bearer " + result.session.access_token,
          },
        });
        await fetchWebElementsPermissions({
          "where[listIdWebElementTypeObject][tag]":'WebElelementPermission'
        })
      } else {
        this.currentUser = null;
        this.accessToken = "";
        this.refreshToken = "";
      }
      console.log("isLoggedIn ", this.isLoggedIn);
      return result;
    },
    acceptAuthLegal() {
      this.currentUser.user_metadata.acceptLegal = true;
    }
  },
});
