<template>
  <div class="sub-menu d-flex p-8 gap-5 prevent-outside-click">
    <div class="account">
      <div class="pb-5 gris-fonce">{{t("subMenu.account")}}</div>
      <div class="pb-4 item">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/profil.svg" />
        </span>
        <router-link to="/profil"><span>{{t("subMenu.profil")}}</span></router-link>
      </div>
      <div class="pb-4 item">
        <span class="aside-icon pe-3">
          <inline-svg width="16px" height="16px" src="/svg/icons/import.svg" />
        </span>
        <span>{{t("subMenu.import")}}</span>
      </div>
      <div class="pb-4 item">
        <span class="aside-icon">
            <inline-svg width="11px" height="16px" src="/svg/icons/profile2.svg" />
            <span class="plus-icon pe-3">
              <inline-svg width="8px" height="8px" src="/svg/icons/plus.svg" /> 
            </span> 
        </span>
        <span>{{t("subMenu.teams")}}</span>
      </div>
      <div class="pb-4 item">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="15px" src="/svg/icons/chat.svg" />
        </span>
        <span>{{t("subMenu.contact")}}</span>
      </div>
      <div class="pb-4 item">
        <span class="aside-icon pe-4">
          <inline-svg width="14px" height="16px" src="/svg/icons/file.svg" />
        </span>
        <span>{{t("subMenu.marketingSupport")}}</span>
      </div>
      <div class="pb-4 cursor-pointer item" @click="signOut">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="17px" src="/svg/icons/sign-out.svg" />
        </span>
        <span>{{t("subMenu.signOut")}}</span>
      </div>
    </div>
    <div class="divider me-5"></div>
    <div class="Admin">
      <div class="pb-5 gris-fonce">{{t("subMenu.administration")}}</div>
      <div class="pb-4">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/profil.svg" />
        </span>
        <router-link :to="{ name: 'admin-list-user' }"><span>Gestion des utilisateurs</span></router-link>
      </div>
      <div class="pb-4">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/profil.svg" />
        </span>
        <router-link :to="{ name: 'admin-list-role' }"><span>Gestion des rôles</span></router-link>
      </div>
      <div class="pb-4">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/product-icon.svg" />
        </span>
        <router-link :to="{ name: 'admin-list-actorproduct' }"><span>Gestion des produits</span></router-link>
      </div>
      <div class="pb-4">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/samples-icon.svg" />
        </span>
        <router-link :to="{ name: 'admin-list-stock' }"><span>Gestion des échantillons</span></router-link>
      </div>
      <div class="pb-4">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/contact-icon.svg" />
        </span>
        <router-link :to="{ name: 'admin-list-delegate' }"><span>Configuration des contacts</span></router-link>
      </div>
      <div class="pb-4">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/clock.svg" />
        </span>
        <router-link :to="{ name: 'admin-list-offFiealdActivityList' }"><span>Configuration hors terrain</span></router-link>
      </div>
      <div class="pb-4">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/motif.svg" />
        </span>
        <router-link :to="{ name: 'admin-list-deleteReasonsList' }"><span>Configuration des motifs</span></router-link>
      </div>
      <div class="pb-4">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/visit.svg" />
        </span>
        <router-link :to="{ name: 'admin-visitesManagement-list' }"><span>Gestion des visites</span></router-link>
      </div>
      <div class="pb-4">
        <span class="aside-icon pe-4">
          <inline-svg width="16px" height="16px" src="/svg/icons/history-icon.svg" />
        </span>
        <router-link :to="{ name: 'admin-list-historiques' }"><span>Historique</span></router-link>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
const authStore = useAuthStore();
const signOut = () => {
      authStore.logout();
    };


</script>
<style lang="scss" scoped>
.sub-menu {
  width: fit-content;
  color: $noir;
}
.divider {
  border: 1px solid #e6e9ed;
}
.plus-icon {
 position:relative;
 top:7px;
 right: 4px;
}
.item{
  width: fit-content;
  cursor:pointer;
}
a{
  color:$noir
}
</style>