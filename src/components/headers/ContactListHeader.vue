<template>
  <div class="d-flex justify-content-between w-100">
    <div class="fw-boldest fs-1">Carnet d'adresse</div>
    <div class="d-flex gap-5">
      <Dropdown
        :items="dropDownItems"
        @handleCommandAction="handleCommand"
        placement="bottom-end"
      >
        <template v-slot:trigger>
          <el-button size="large" type="primary" class="fw-boldest poppins">
            <inline-svg class="me-3" src="/svg/icons/plus.svg"></inline-svg>
            Ajouter un contact
          </el-button>
        </template>
      </Dropdown>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import Dropdown from "@/components/shared/Dropdown.vue";
import service from "@/service";

const dropDownItems = ["pds", "entity", "eds", "pharmacy"];
const handleCommand = async (val: any) => {
  if (val === "pds") {
    const resp = await service.api.addressTypeControllerFindOneByType("pds");
    setModal("ActorPersonCreate", { inputs: resp.data });
  } else if(val === 'entity'){
      const resp = await service.api.addressTypeControllerFindOneByType("entity");
      setModal("ActorCompanyTypesCreate", { inputs: resp.data , type: val });
    } 
    else if(val === 'pharmacy'){
      const resp = await service.api.addressTypeControllerFindMany(
        {"where[type][in]":['depositAddress', 'pharmacy']}
         );
         setModal("ActorCompanyTypesCreate", { inputs: resp.data.paginatedResult, type: val });
    } 
    else if(val === 'eds'){
      const resp = await service.api.addressTypeControllerFindOneByType(
        "healthCenter"
         );
         setModal("ActorCompanyTypesCreate", { inputs: resp.data , type: val });
    } 
};
</script>
<style lang="scss" scoped></style>
