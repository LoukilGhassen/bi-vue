<template>
    <div>
        <div class="d-flex justify-content-between p-8 px-12  noir">
          <div class="fs-1 fw-boldest noir">
            <span v-if="isEdit">{{props?.category?.captionFr}}</span>
            <span v-else>Ajouter une catégorie</span> 
          </div>
          <div class="cursor-pointer" @click="handleCloseModal">
            <inline-svg src="/svg/icons/close.svg"></inline-svg>
          </div>
        </div>
        <el-form :model="form" ref="ruleFormRef" class="px-9 mx-9" :rules="rules">
          <div class="form fit-content d-flex flex-column">
            <el-form-item class="w-100" prop="code">
              <label>Code*</label>
              <el-input size="large" v-model="form.code"> </el-input>
            </el-form-item>
            <div class="w-100 d-flex gap-5">
              <el-form-item class="w-100" prop="captionFr">
                <label>Nom de la catégorie*</label>
                <el-input size="large" v-model="form.captionFr"> </el-input>
              </el-form-item>
            </div>
            <div
            class="form fit-content d-flex flex-column"
            >
                <el-form-item class="w-100" prop="markets">
                <label>Marché(s)*</label>
                <el-select
                    id="market-select"
                    size="large"
                    class="w-100"
                    placeholder="Sélectionnez des marchés"
                    multiple
                    filterable
                    value-key="id"
                    v-model="form.markets"
                >
                    <el-option
                    v-for="item in data?.ProductMarket"
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
          class="d-flex justify-content-end align-items-center p-9 mx-9 pb-12 gap-5 dialog-footer"
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
  const { createList , editList} = useListStore();
  const { error } = storeToRefs(useListStore());
  
  const props = defineProps({
    isEdit: {
      type: Boolean,
      required: false,
      default:false
    },
    category:{
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
    captionFr: "",
    code: "",
    markets: [],
    listTypeNameObject :{
      listTypeName: "ProductCategory"} ,
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
    captionFr: [
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
        captionFr: form.value.captionFr,
        code: form.value.code,
        markets: form.value.markets,
        listTypeNameObject :{
        listTypeName: "ProductCategory"} ,

      }
      await editList({id:form.value.id,data});
    }
    else{
      await createList({data:form.value})
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
  onMounted(async() => {
    setTimeout(()=>{
      const elements = document?.querySelectorAll("#market-select")
      elements.forEach((e)=>{
        e.removeAttribute('readonly')
      })
    },1000)
    if(props.isEdit){
      form.value = _.cloneDeep(props.category)
    }else{
       const result = await service.api.listControllerGenerateCode({
        "where[listTypeName]": "ProductCategory"
       })
       const code = result?.data?.code
       form.value.code = code
    }

    const resp = await service.api.webElementJListFilterControllerGetListByPageName(
      "CategoryForm"
    );
    data.value = resp.data;
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
  