<template>
  <el-form
    :model="form"
    ref="ruleFormRef"
    :rules="validationRules"
    class="w-100"
  >
    <div class="address-form pb-0">
      <div class="pb-2 noir fw-boldest">
        {{ title }}
      </div>
      <div class="d-flex gap-5">
        <el-form-item
          :class="inputs.row2CaptionFr ? 'w-50' : 'w-100'"
          prop="row1Value"
          v-if="inputs.row1CaptionFr"
        >
          <label class="w-100">{{ inputs.row1CaptionFr }}</label>
          <el-autocomplete
            v-if="inputs.row1CaptionFr.includes('établissement')"
            v-model="form.row1Value"
            :fetch-suggestions="querySearch"
            value-key="row1Value"
            clearable
            size="large"
            class="w-100"
            placeholder="Sélectionnez un établissement"
            @select="handleSelect"
          />
          <el-input v-else v-model="form.row1Value" size="large"></el-input>
        </el-form-item>       
        <el-form-item class="w-50" v-if="inputs.row2CaptionFr" prop="row2Value">
          <label>{{ inputs.row2CaptionFr }}</label>
          <el-input v-model="form.row2Value" size="large"></el-input>
        </el-form-item>
      </div>
      <div class="d-flex gap-5">
        <el-form-item
          :class="inputs.row4CaptionFr ? 'w-50' : 'w-100'"
          v-if="inputs.row3CaptionFr"
        >
          <label>{{ inputs.row3CaptionFr }}</label>
          <el-input v-model="form.row3Value" size="large"></el-input>
        </el-form-item>
        <el-form-item class="w-50" v-if="inputs.row4CaptionFr">
          <label>{{ inputs.row4CaptionFr }}</label>
          <el-input v-model="form.row4Value" size="large"></el-input>
        </el-form-item>
      </div>
      <div class="d-flex gap-5">
        <el-form-item class="w-150px" prop="streetNb">
          <label class="w-100">N°<span v-if="validation">*</span></label>
          <el-input-number
            :controls="false"
            class="w-100"
            v-model.number="form.streetNb"
            size="large"
          />
        </el-form-item>
        <el-form-item class="w-100" prop="street">
          <label>Rue<span v-if="validation">*</span></label>
          <el-input v-model="form.street" type="text" size="large" />
        </el-form-item>
      </div>
      <el-form-item class="w-100">
        <label>Complément d'adresse</label>
        <el-input class="w-100" v-model="form.notes" type="text" size="large" />
      </el-form-item>
      <div class="d-flex gap-5" v-if="showUga">
        <el-form-item class="w-50" prop="listIdUga">
          <label class="w-100">UGA<span v-if="validation">*</span></label>
          <el-select
            class="w-100"
            size="large"
            placeholder="Sélectionnez un UGA"
            filterable
            v-model="form.listIdUga"
            @change="handleSelectUga"
          >
            <el-option
              v-for="uga in ugaList"
              :key="uga.id"
              :label="uga.code"
              :value="uga.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="w-50" prop="departement">
          <label class="w-100">Département*</label>

          <el-input class="w-100" v-model="form.departement" size="large" />
        </el-form-item>
      </div>
      <div class="d-flex gap-5 w-100">
        <el-form-item class="" prop="zipCode">
          <label>Code postal<span v-if="validation">*</span></label>
          <el-input v-model="form.zipCode" type="text" size="large" />
        </el-form-item>
        <el-form-item class="" prop="town">
          <label>Ville<span v-if="validation">*</span></label>
          <el-input v-model="form.town" type="text" size="large" />
        </el-form-item>
        <el-form-item class="w-50" prop="listIdCountry">
          <label class="w-100">Pays<span v-if="validation">*</span></label>
          <el-select
            remote
            v-model="form.listIdCountry"
            filterable
            clearable
            size="large"
            :remote-method="remoteMethod"
            placeholder="  "
            class="w-100"
          >
            <el-option
              v-for="country in countries"
              :key="country.id"
              :label="country.captionFr"
              :value="country.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="d-flex justify-content-between gap-5">
        <el-form-item class="w-50" prop="telephone">
          <label>Téléphone</label>
          <el-input v-model="form.telephone" type="text" size="large" />
        </el-form-item>
        <el-form-item class="w-50" prop="fax">
          <label>Fax</label>
          <el-input v-model="form.fax" type="text" size="large" />
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import service from "@/service";
import { List, Address } from "./../../../index";
import { onMounted, ref, watch, computed } from "vue";
import { supabase } from "@/core/services/SupabaseClientService";
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
  inputs: {
    required: true,
  },
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
  listUga: {
    type: Array,
    required: false,
  },
  showUga: {
    type: Boolean,
    required: false,
    default: true,
  },
  validation: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const emit = defineEmits(["add", "update", "validate"]);
const form = ref({ ...props.data, addressTypeId: props.inputs.id });
const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  if (!props.validation) {
    emit("validate", true);
  } else {
    formEl.validate(async (valid) => {
      if (valid) {
        emit("validate", true);
      } else {
        emit("validate", false);
      }
    });
  }
};
watch(
  () => props.submit,
  (value) => {
    if (value) {
      onSubmit(ruleFormRef.value);
    }
  }
);

const querySearch = async (queryString: string, cb: any) => {
  const { data } = await service.api.addressControllerFindMany({
    take: 50,
    skip: 0,
    "where[row1Value][contains]": queryString ? `${queryString}` : "",
    "where[row1Value][mode]": "insensitive",
    "where[addressTypeId]": props.inputs.id,
    distinct: "row1Value",
  });
  // call callback function to return suggestions
  cb(data.paginatedResult);
};

const handleSelect = (item: any) => {
  form.value = { ...item, addressTypeId: props.inputs.id };
};

const standardRules = {
  telephone: [
    {
      validator: checkPhone,
      trigger: ["blur","change"],
    },
  ],
  fax: [
    {
      validator: checkFax,
      trigger: ["blur","change"],
    },
  ],
  row1Value: props.inputs?.row1CaptionFr === "Code CIP" ? [{ validator: checkIsNum, trigger: ["blur","change"] }] : [],
  row2Value: props.inputs?.row2CaptionFr === "Code CIP" ? [{ validator: checkIsNum, trigger: ["blur","change"] }] : [],
};

const rules = {
  listIdCountry: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  listIdUga: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  departement: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: ["blur", "change"],
    },
  ],
  streetNb: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  street: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  town: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  zipCode: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
    {
      validator: checkZipCode,
      trigger: "blur",
    },
  ],
};
const validationRules = computed(() => {
  return props.validation ? { ...rules, ...standardRules } : standardRules;
});

const countries = ref<Array<List>>([]);


const refValidation = async() => {
  let validation = true
  await ruleFormRef.value?.validate(async (valid:boolean) => {
    if (!valid) {
      validation = false;
    } 
  })
  return validation
}
defineExpose({refValidation})
 const ugaList =ref<Array<List>>([])
onMounted(async () => {
  if(props.showUga && !props.listUga){
    const res: any = await service.api.webElementJListFilterControllerGetListByPageName(
      "addressForm"
      );
      ugaList.value = res.data?.UGA
  }else if(props.listUga){
    ugaList.value = props.listUga
  }
  await remoteMethod("");
  
});
watch(
  form,
  () => {
    emit("update", form.value);
  },
  { deep: true }
);
const handleSelectUga = (payload: string) => {
  const selectedObject = ugaList.value.find(
    (item: List) => item.id === payload
  );
  form.value.departement = selectedObject.code.substring(0, 2);
};
const remoteMethod = async (query: string) => {
  const { data } = query
    ? await supabase
        .from("List")
        .select("captionFr,tag,id")
        .eq("listTypeName", "Countries")
        .ilike("captionFr", `%${query}%`)
    : await supabase
        .from("List")
        .select("captionFr,tag,id")
        .eq("listTypeName", "Countries");
  countries.value = data;
};
</script>
<style lang="scss" scoped>
.address-form {
  background: #f4f4f6;
}
label {
  font-size: 12px;
  font-weight: 700;
}
</style>
