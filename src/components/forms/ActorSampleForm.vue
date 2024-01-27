<template>
    <div>
        <div class="d-flex justify-content-between align-items-center p-10 pt-10 noir">
          <div class="fs-1 fw-boldest noir">
            <span v-if="isEdit">Modifier</span>
            <span v-else>Ajouter</span> un échantillon
          </div>
          <div class="cursor-pointer" @click="handleCloseModal">
            <inline-svg src="/svg/icons/close.svg"></inline-svg>
          </div>
        </div>
        <el-form :model="form" ref="ruleFormRef" class="px-9 mx-9" :rules="rules">
          <div class="form fit-content d-flex flex-column">
            <el-form-item class="w-100" prop="name">
              <label>Nom de l’échantillon*</label>
              <el-input size="large" v-model="form.name"> </el-input>
            </el-form-item>
            <div class="w-100 d-flex gap-5">
              <el-form-item class="w-15" v-if="isEdit">
                <label>Code externe</label>
                <el-input size="large" disabled :model-value="form.ids?.externalId"> </el-input>
              </el-form-item>
              <el-form-item class="w-100" prop="code">
                <label>Code échantillon*</label>
                <el-input size="large" v-model="form.code"> </el-input>
              </el-form-item>
            </div>
            <el-form-item class="w-100" prop="listIdSampleCategoryObject.id">
              <label>Catégorie* </label>
              <el-select
              class="w-100"
              size="large"
              placeholder="Sélectionnez une catégorie"
              filterable
              @change="handleCategorieChange"
              v-model="form.listIdSampleCategoryObject.id"
            >
              <el-option
                v-for="category in data?.ProductCategory"
                :key="category.id"
                :label="category.captionFr"
                :value="category.id"
              />
            </el-select>
            </el-form-item>
            <div
            class="form fit-content d-flex flex-column"
            >
                <el-form-item class="w-100" prop="markets">
                <label>Marché(s)*</label>
                <el-select
                    id="market-select"
                    :disabled="!form.listIdSampleCategoryObject.id"
                    size="large"
                    class="w-100"
                    placeholder="Sélectionnez des marchés"
                    multiple
                    filterable
                    value-key="id"
                    v-model="form.markets"
                >
                    <el-option
                    v-for="item in markets"
                    :key="item.id"
                    :label="item.captionFr"
                    :value="item"
                    />
                </el-select>
                </el-form-item>
                <div>
                <el-tag
                    v-for="tag in form.markets"
                    :key="tag"
                    class="mx-1 p-5 fs-6 poppins"
                    closable
                    round
                    color="#9A5AFF"
                    @close="handleTagClose(tag)"
                >
                    {{ tag.captionFr }}
                </el-tag>
                </div>
            </div> 
          </div>
        </el-form>
        <div
          class="d-flex justify-content-end align-items-center p-9 mx-9 gap-5 pb-15 dialog-footer"
        >
          <div
            data-test="ConfirmModalCancelButton"
            @click="handleCloseModal"
            class="cancel-btn me-2"
          >
            Annuler
          </div>
          <el-button
            data-test="ConfirmModalConfirmButton"
            type="primary"
            class="primary-btn poppins"
            size="large"
            @click="onSubmit(ruleFormRef)"
          >
            <inline-svg
              v-if="!isEdit"
              class="me-2"
              src="/svg/icons/plus.svg"
            ></inline-svg>
            <span v-if="!isEdit">Ajouter</span>
            <span v-if="isEdit">Modifier</span>
          </el-button>
        </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { t } from "@/core/i18n/translate";
  import { setModal } from "@/core/helpers/config";
  import { useListStore } from "@/store/useListModule";
  import { onMounted, ref } from "vue";
  import type { ElForm } from "element-plus";
  import { Components } from "@tekab-dev-team/storybook-devfactory";
  import { storeToRefs } from "pinia";
  import _ from "lodash";
  import service from "@/service";
  import { useActorSampleStore } from "@/store/useActorSampleModule";
  const { createActorSample , editActorSample} = useActorSampleStore();
  const { error } = storeToRefs(useListStore());
  
  const props = defineProps({
    isEdit: {
      type: Boolean,
      required: false,
      default:false
    },
    sample:{
      required:false,
      type:Object
    }
   
  });
  const handleCloseModal = () => {
    setModal("");
  };
  const ruleFormRef = ref<InstanceType<typeof ElForm>>();
  const data = ref()
  const form = ref({
    name: "",
    code: "",
    listIdSampleCategoryObject: {id:""},
    markets: [],
  });
  const markets = ref()
  const rules = {
    code: [
      {
        required: true,
        message: `${t("entityForm.validation.required")}`,
        trigger: ["blur", "change"],
      },
    ],
    name: [
      {
        required: true,
        message: `${t("entityForm.validation.required")}`,
        trigger: ["blur", "change"],
      },
    ],
    "listIdSampleCategoryObject.id": [
      {
        required: true,
        message: `${t("entityForm.validation.required")}`,
        trigger: ["blur", "change"],
      },
    ],
    markets: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  };
  const handleTagClose = (tag) => {
    form.value.markets = form.value.markets.filter((market) => market.id !== tag.id);
  }
  const handleSubmitForm = async () => {
    if(props.isEdit){
      const data = {
        name: form.value.name,
        code: form.value.code,
        listIdSampleCategoryObject: form.value.listIdSampleCategoryObject,
        markets: form.value.markets,
      }
      await editActorSample({id:form.value.id,data});
    }
    else{
      await createActorSample({data:form.value})
  
    }
  };
  const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
    formEl.validate(async (valid) => {
      if (valid) {
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
      } else {
        console.log("error submit!");
        return false;
      }
    });
  };
  const handleCategorieChange = async (value:any,mounted?:boolean) => {
    if(!mounted){
      form.value.markets = []
    }
    const {data} = await service.api.categoryMarketControllerFindMany({
      "where[categoryId]" : value
    })
    markets.value=data.paginatedResult?.map((e)=> e.market)
  }
  onMounted(async() => {
    setTimeout(()=>{
      const elements = document?.querySelectorAll("#market-select")
      elements.forEach((e)=>{
        e.removeAttribute('readonly')
      })
    },1000)
    const resp = await service.api.webElementJListFilterControllerGetListByPageName(
      "ActorSampleForm"
    );
    data.value = resp.data;
    if(props.isEdit){
      form.value = _.cloneDeep(props.sample)
      await handleCategorieChange(form.value.listIdSampleCategoryObject?.id,true)
    }else {
      const result = await service.api.actorSampleControllerGenerateCode()
      const code = result?.data?.code
      form.value.code = code
    } 
  });
  </script>
  <style lang="scss" scoped>
  
  :deep(.el-tag) {
    color: white;
  }
  :deep(.el-tag__close) {
  color: white;
  }
  :deep(.el-select__tags) {
  display: none;
  }
  :deep(.el-input__prefix) {
  display: none !important;
  }
  
  
  </style>
  