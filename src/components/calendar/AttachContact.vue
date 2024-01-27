<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      custom-class="visit-dialog__custom-class"
      :close-on-click-modal="false"
      @close="$emit('close-modal')"
      width="600px"
      top="25vh"
    >
      <div class="w-100">
        <div class="d-flex justify-content-between p-5 m-5 mb-0 noir">
          <div class="fs-3 fw-boldest noir">
            Ajouter des contacts rencontrés lors de l’évènement
          </div>
          <div class="cursor-pointer" @click="handleCloseModal">
            <inline-svg src="/svg/icons/close.svg"></inline-svg>
          </div>
        </div>

        <el-form :model="form" ref="ruleFormRef" class="px-9 mx-9">
          <div class="form fit-content d-flex flex-column">
            <el-form-item class="w-100">
              <label>Attacher un contact rencontré</label>
              <el-select
               remote-show-suffix
                size="large"
                class="w-100 custom_remote_select"
                placeholder="Sélectionnez un contact"
                multiple
                remote
                filterable
                :remote-method="queryAttendant"
                value-key="anyIdId"
                v-model="
                  form.storyEvents.OffFieldActivityContact.storyEventInvolves
                "
              >
                <el-option
                  v-for="item in attendants"
                  :key="item.anyId.actor.id"
                  :label="item.anyId.actor.actorName"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <div>
              <el-tag
                v-for="tag in form.storyEvents?.OffFieldActivityContact
                  ?.storyEventInvolves"
                :key="tag.anyId.actor.id"
                class="mx-1 p-5 fs-6 poppins"
                closable
                round
                color="#9A5AFF"
                @close="handleTagClose(tag)"
              >
                {{ tag.anyId?.actor?.actorName }}
              </el-tag>
            </div>
          </div>
        </el-form>
        <div
          class="d-flex justify-content-end align-items-center p-9 gap-5 dialog-footer"
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
            <span>Ajouter</span>
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import service from "@/service";
import { useStoryStore } from "@/store/useStoryModule";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import _ from "lodash";
const attendants = ref([]);
import type { ElForm } from "element-plus";
const { story, error } = storeToRefs(useStoryStore());
const form = ref(
  _.cloneDeep({
    ...story.value,
    storyEvents: {
      ...story.value.storyEvents,
      OffFieldActivityContact: {
        ...story.value.storyEvents.OffFieldActivityContact,
        storyEventInvolves:
          story.value.storyEvents.OffFieldActivityContact.storyEventInvolves.map(
            (item) => ({
              ...item,
              anyIdId: item.anyId.actor.id,
            })
          ),
      },
    },
  })
);
const { editStory } = useStoryStore();
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});
const ruleFormRef = ref<InstanceType<typeof ElForm>>();

const queryAttendant = async (queryString: string) => {
  const { data } = await service.api.actorControllerFindMany({
    take: 50,
    skip: 0,
    "where[actorName][contains]": queryString ? `${queryString}` : "",
    "where[actorName][mode]": "insensitive",
    "where[OR][0][actorPerson]": null,
    "where[OR][1][actorPerson][listIdActorPersonTypeObject][tag]": "PDS",
  });
  attendants.value = data.paginatedResult.map((e) => ({
    anyIdId: e.id,
    anyId: {
      actor: {
        id: e.id,
        actorName: e.actorName,
      },
    },
  }));
};
const handleTagClose = (tag: any) => {
  form.value.storyEvents.OffFieldActivityContact.storyEventInvolves =
    form.value?.storyEvents?.OffFieldActivityContact?.storyEventInvolves?.filter(
      (acc) => acc?.anyId?.actor?.id !== tag?.anyId?.actor?.id
    );
};
const handleCloseModal = () => {
  setModal("");
};
onMounted(async()=>{
  await queryAttendant('')
})
const handleSubmitForm = async () => {
  editStory({
    id: form.value.id,
    data: { ...form.value, storyEvents: Object.values(form.value.storyEvents) },
  });
};

const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
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
.custom_remote_select.el-select::after {
  content: "";
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translate(-50%,-10%) rotate(90deg);
  width: 16px;
  height: 16px;
  background-image: url("/svg/icons/arr064.svg");
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 1;
}
</style>
