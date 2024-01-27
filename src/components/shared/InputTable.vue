<template>
  <div>
    <el-form :model="formData" ref="formRef">
      <el-table :data="data" class="w-100" v-if="data.length">
        <el-table-column
          v-for="(column, index) in columns"
          :key="column.label"
          :label="column.label"
        >
          <template #default="scope">
            <el-form-item
              :prop="'data.' + scope.$index + '.' + column.prop"
              :rules="column.rules ?? ''"
            >
              <span
                v-if="column.type === 'text'"
                v-html="
                  !loadash.get(scope.row, column.prop)
                    ? loadash.get(scope.row, column.prop)
                    : '' + loadash.get(scope.row, column.prop)
                "
              ></span>
              <div
                v-if="column.type === 'joinArray'"
               >
                {{  renderJoinedArray(loadash.get(scope.row, column.prop),column.joinProperty) }}
              </div>

              <el-input
                size="large"
                type="text"
                class="input-text"
                :model-value="loadash.get(scope.row, column.prop)"
                @input="handleInput($event, column, scope.$index)"
                v-if="column.type === 'input'"
              />
              <el-input-number
                size="large"
                :max="999"
                class="input-text number-input"
                style="max-width: 15%;"
                :controls="false"
                :model-value="loadash.get(scope.row, column.prop)"
                @input="handleInput($event, column, scope.$index)"
                v-if="column.type === 'inputNumber'"
              />
              <el-autocomplete
                v-if="column.type === 'autoCompleteInput'"
                :value-key="column.valueKey"
                size="large"
                class="w-100"
                @select="handleSelect($event, column, scope.$index)"
                :trigger-on-focus="false"
                :fetch-suggestions="autoCompleteSearch"
                :model-value="scope.row[column.prop]"
                @input="handleInput($event, column, scope.$index, index)"
              ></el-autocomplete>

              <el-select
                remote
                filterable
                v-if="column.type === 'autoComplete'"
                size="large"
                class="w-100"
                @change="handleSelect($event, column, scope.$index)"
                :remote-method="querySearch"
                :model-value="loadash.get(scope.row, column.prop)"
                @input="handleAutoComplete(column, scope.$index)"
                :value-key="column.valueKey"
              >
                <el-option
                  v-for="item in column.suggestions[scope.$index]"
                  :key="item.id"
                  :label="item.name || item.captionFr"
                  :value="item"
                />
              </el-select>
              <el-select
                v-if="column.type === 'select'"
                :model-value="loadash.get(scope.row, column.prop)"
                @change="handleSelect($event, column, scope.$index)"
                class="w-100"
                size="large"
              >
                <el-option
                  v-for="option in column.options"
                  :key="option.id"
                  :label="option.captionFr"
                  :value="option.id"
                />
                <template
                  v-if="
                    column.optionsData &&
                    loadash.get(scope.row, column.prop) instanceof Array
                  "
                >
                  <el-option
                    v-for="option in loadash.get(scope.row, column.prop)"
                    :key="option.id"
                    :label="option.captionFr"
                    :value="option.id"
                  />
                </template>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column align="right" width="150">
          <template #default="scope">
            <div class="d-flex gap-4 justify-content-end">
              <inline-svg
                v-if="showDetails"
                src="/svg/icons/eye.svg"
                class="cursor-pointer noir"
                @click="handleShowDetails(scope.$index)"
              ></inline-svg>
              <inline-svg
                src="/svg/icons/trash.svg"
                class="cursor-pointer noir"
                @click="handleDelete(scope.$index)"
              ></inline-svg>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <div
      @click="handleAddClick"
      class="p-4 my-5 cursor-pointer d-flex align-items-center justify-content-center add-icon"
    >
      <inline-svg src="/svg/icons/plus.svg"></inline-svg>
    </div>
  </div>
</template>

import { ref } from "vue";
<script lang="ts">
import { defineComponent, ref } from "vue";
import loadash from "lodash";
import type { ElForm } from "element-plus";

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    showDetails: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, { emit }) {
    interface User {
      date: string;
      name: string;
      address: string;
    }
    interface IColumn {
      label: string;
      type: string;
    }
    const autoComplete = ref({
      column: {},
      index: 0,
    });
    const formRef = ref<InstanceType<typeof ElForm>>();
    const handleEdit = (index: number, row: User) => {
      console.log(index, row);
    };
    const handleDelete = (index: number) => {
      emit("delete", { index });
    };
    const handleShowDetails = (index: number) => {
      emit("showDetails", { index });
    };
    const handleAddClick = () => {
      emit("add");
    };
    const handleInput = (value: string, column: any, index: string) => {
      if (
        autoComplete.value !== column.prop &&
        column.type === "autoCompleteInput"
      ) {
        autoComplete.value = { column: column.name, index: index };
      }
      emit("inputChange", { value, column: column.prop, index });
    };
    const handleAutoComplete = (column: any, index: number) => {
      autoComplete.value = { column, index };
    };
    const handleSelect = (value: string, column: any, index: string) => {
      emit(column.name, { value, column: column.prop, index });
    };
    const querySearch = (queryString: string) => {
      emit(autoComplete.value.column.name + "Suggest", {
        query: queryString,
        index: autoComplete.value.index,
      });
    };
    const autoCompleteSearch = (queryString: string, cb: any) => {
      emit(autoComplete.value.column + "Suggest", {
        cb: (data) => {
          cb(data);
        },
        data: queryString,
      });
    };
    const formData = computed(() => {
      return {
        data: props.data,
      };
    });
    const validateForm = async () => {
      let validation = true;
      await formRef.value?.validate(async (valid: boolean) => {
        if (!valid) {
          validation = false;
        }
      });
      return validation;
    };
    const renderJoinedArray = (tab,property) => {

      return tab.map((e)=>loadash.get(e, property)).join(",");
    }
    return {
      handleEdit,
      handleDelete,
      handleInput,
      handleSelect,
      handleAddClick,
      querySearch,
      loadash,
      handleAutoComplete,
      autoCompleteSearch,
      handleShowDetails,
      formData,
      formRef,
      validateForm,
      renderJoinedArray
    };
  },
});
</script>

<style lang="scss" scoped>
.add-icon {
  border-radius: 6px;
  border: 1px solid $gris-clair;
  width: fit-content;
}
:deep(.el-input) {
  --el-input-border-color: none !important;    
}
.number-input{
  :deep(.el-input__inner){
    padding: 0px !important;
  }
}
</style>
