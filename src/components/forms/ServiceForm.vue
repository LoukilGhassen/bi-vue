<template>
  <el-form
    :model="form"
    ref="ruleFormRef"
    :rules="rules"
    class="w-100"
  >
    <div class="address-form pb-0">
      <div class="pb-5 noir fw-boldest">
        {{ title }}
      </div>
      <el-form-item prop="name">
        <label class="w-100">
            Nom du service
        </label>
        <el-input v-model="form.name" type="text" size="large" />
      </el-form-item>
      <div class="d-flex gap-5">
        <el-form-item prop="telephone" class="w-50" >
          <label>Téléphone du service</label>
          <el-input v-model="form.telephone" type="text" size="large" />
        </el-form-item>
        <el-form-item prop="email" class="w-50">
          <label>E-mail du service</label>
          <el-input v-model="form.email" type="text" size="large" />
        </el-form-item>
      </div>
      <div class="d-flex gap-5">
        <el-form-item prop="fax" class="w-50" >
          <label>Fax du service</label>
          <el-input v-model="form.fax" type="text" size="large" />
        </el-form-item>
        <el-form-item prop="headOfDepartment" class="w-50" >
          <label>Nom du chef de service</label>
          <el-input v-model="form.headOfDepartment" type="text" size="large" />
        </el-form-item>
      </div>
        <el-form-item class="w-100">
        <label>Equipe médicale</label>
        <el-select
          id="medical-staff"
          size="large"
          class="w-100"
          placeholder="Sélectionnez un contact"
          multiple
          filterable
          remote
          :remote-method="queryAttendant"
          value-key="id"
          v-model="form.team"
      >
        <el-option
          v-for="item in attendants"
          :key="item.id"
          :label="item.actor.actorName"
          :value="item"
        />
      </el-select>
      </el-form-item>
       <div>
        <el-tag
          v-for="tag in form.team"
          :key="tag.id"
          class="mx-1 p-5 fs-6 poppins"
          closable
          round
          color="#9A5AFF"
          @close="handleTagClose(tag)"
        >
          {{ tag.actor?.actorName }}
        </el-tag>
      </div> 
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import service from "@/service";
import { onMounted, ref, watch, computed } from "vue";
import type { ElForm } from "element-plus";
import { t } from "@/core/i18n/translate";
import _ from "lodash";
import {
  checkFax,
  checkIsNum,
  checkPhone,
  checkZipCode,
} from "@/core/helpers/customValidation";

const ruleFormRef = ref<InstanceType<typeof ElForm>>();

const props = defineProps({
  submit: {
    type: Boolean,
    required: false,
    default: false,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  index: {
    type: Number,
    required: false,
  },
  validation: {
    type: Boolean,
    required: false,
    default: true,
  },
  serviceTeamIds:{
    type: Array,
    required:true
  }
});
const emit = defineEmits(["add", "update", "validate"]);
const form = ref(props.data ?? {
  name : "" ,
  telephone:"",
  email:"",
  fax:"",
  headOfDepartment:"",
  team:[]
 });
const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
};

const attendants = ref([])
const queryAttendant = async (queryString: string) => {

const { data } = await service.api.actorPersonControllerFindMany({
  take: 50,
  skip: 0,
  "where[actor][actorName][contains]": queryString ? `${queryString}` : "",
  "where[actor][actorName][mode]": "insensitive",
  "where[listIdActorPersonTypeObject][tag]": "PDS",
  "where[id][notIn]" : props.serviceTeamIds
});
attendants.value = data.paginatedResult;
};
const handleTagClose = (tag: any) => {
form.value.team =
  form.value.team.filter(
    (person) => person.id !== tag.id
  );
};
const validate = async() =>{
  let validation = true
  await ruleFormRef.value?.validate(async (valid:boolean) => {
    if (!valid) {
      validation = false;
    } 
  })
  return validation
}

defineExpose({validate})


const rules = {
  name: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  telephone: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["blur",'change'],
    },
    {
      validator: checkPhone,
      trigger: ["blur",'change'],
    }
  ],
  email: [
    {
      type: "email",
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["blur", "change"],
    }
  ],
  fax: [
    {
      validator:checkFax,
      trigger: ["blur",'change'],
    }
  ],
  headOfDepartment: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],

};

onMounted(async () => {

  setTimeout(()=>{
    const elements = document?.querySelectorAll("#medical-staff")
    elements.forEach((e)=>{
      e.removeAttribute('readonly')
    })
  },1000)
  await queryAttendant('')
});
watch(props.data,()=>{
  form.value = _.cloneDeep(props.data)
})
watch(
  form,
  () => {
    emit("update", form.value);
  },
  { deep: true }
);
</script>
<style lang="scss" scoped>
:deep(.el-select-tags-wrapper) {
  display: none !important;
}
:deep(.el-tag) {
  color: white;
}
:deep(.el-tag__close) {
  color: white;
}
</style>
