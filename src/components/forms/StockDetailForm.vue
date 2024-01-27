<template>
    <div class="d-flex flex-column justify-content-between h-100">
        <div class="w-100 d-flex flex-column gap-10">
            <el-form  disabled class="sample-form p-10" >
                <div class="noir my-5 fw-bolder fs-5">Identité</div>
                <div class="fit-content d-flex gap-5">
                <el-form-item class="w-100">
                    <label>Nom de l’échantillon</label>
                    <el-input size="large" :model-value="form.name"> </el-input>
                </el-form-item>
                <el-form-item class="w-100">
                    <label>Catégorie </label>
                    <el-select
                    class="w-100"
                    size="large"
                    :model-value="form.listIdSampleCategoryObject.id"
                >
                    <el-option
                    v-for="category in data?.ProductCategory"
                    :key="category.id"
                    :label="category.captionFr"
                    :value="category.id"
                    />
                </el-select>
                </el-form-item>
                </div>
                <div class="w-100 d-flex gap-5">
                    <el-form-item class="w-50" prop="code">
                        <label>Code échantillon</label>
                        <el-input size="large" :model-value="form.code"> </el-input>
                    </el-form-item>
                    <div class=" fit-content d-flex flex-column w-50"
                    >
                        <label class="mt-2">Marché(s)</label>              
                        <div class="mt-2">
                            <el-tag
                                v-for="tag in form.markets"
                                :key="tag"
                                class="mx-1 p-5 fs-6 poppins"
                                round
                                color="#9A5AFF"
                            >
                                {{ tag?.listIdMarket?.captionFr }}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </el-form>
            <el-form  class="qte-form p-10 w-50" :model="form" ref="ruleFormRef">
                <div class="noir my-5 fw-bolder fs-5">Stock</div>
                <div class="fit-content d-flex gap-5">
                <el-form-item class="w-100">
                    <label>Qte. allouée à remettre en main propre</label>
                    <el-input-number
                    type='number'
                    :controls="false"
                    class="w-100"
                    size="large"
                    v-model="form.stockQty"
                    style="text-align: right;"
                    />
                </el-form-item>
                <el-form-item class="w-100">
                    <label>Qte. allouée à expédier </label>
                    <el-input-number
                    class="w-100"
                    size="large"
                    v-model="form.stockToShip"
                    :controls="false"
                    />
                      
                </el-form-item>
                </div>
            </el-form>
        </div>

        <el-button
        type="primary"
        class="primary-btn poppins d-flex ms-auto  my-4"
        size="large"
        @click="onSubmit"
        >
        Modifier
        </el-button>
    </div>
</template>
  <script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import { useActorSampleStore } from "@/store/useActorSampleModule";
import { storeToRefs } from "pinia";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import _ from "lodash";
import service from "@/service";
import { t } from "@/core/i18n/translate";
import type { ElForm } from "element-plus";
import { checkIsNum } from "@/core/helpers/customValidation";
  const route = useRoute();
  const id = route.params?.id;
  const { actorSample , error} = storeToRefs(useActorSampleStore());
  const { createActorSample ,getActorSampleById, editActorSample} = useActorSampleStore();
  const ruleFormRef = ref<InstanceType<typeof ElForm>>();

  const form = ref({
    name: "",
    code: "",
    listIdSampleCategoryObject: {id:""},
    markets: [],
    stockQty:null,
    stockToShip:null 

  });
  const data = ref()
  const handleSubmitForm = async () => {
      const data = {
        stockQty:form.value.stockQty,
        stockToShip:form.value.stockToShip,
      }
      await editActorSample({id:form.value.id,data});

  };
  const onSubmit = async() => {
    await handleSubmitForm();
    if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
    } else {
        Components.ElNotification.success({
        message: "Opération effectuée avec succès",
        position: "bottom-right",
        offset: 60,
        duration: 2000,
        customClass: "success-notif",
        });
        setModal("");
    }
      
  } 
  onMounted(async() => {
    const resp = await service.api.webElementJListFilterControllerGetListByPageName(
      "ActorSampleForm"
    );
    data.value = resp.data;
    await getActorSampleById(id)
    form.value = _.cloneDeep(actorSample.value)
  });

  </script>
  <style lang="scss" scoped>
  .el-button {
    margin-left: 0;
  }
  :deep(.el-button--large) {
    padding: 12px 15px;
  }
  :deep(.el-switch) {
    --el-switch-on-color: #10e5e5;
    --el-switch-off-color: #e6e9ed;
  }
  :deep(.el-switch__label.is-active) {
    color: $noir;
  }
  :deep(.el-tag) {
    color: white;
  }
  .sample-form {
    background:$gris-clair;
    :deep(.el-input__inner) {
        background-color: $gris-clair!important;
        border: 1px solid $gris-moyen;
        color: $noir!important;
        font-family: "poppins";
      }    
  }
  .qte-form {
    background:$gris-clair;
  }

  </style>
  