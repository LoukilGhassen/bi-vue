<template>
  <div class="w-100">
    <div class="d-flex justify-content-between p-9 m-9 mt-5 noir">
      <div class="fs-1 fw-boldest noir">
        <span v-if="isEdit">Modifier</span><span v-else>Ajouter</span> un
        évènement
      </div>
      <div class="cursor-pointer" @click="handleCloseModal">
        <inline-svg src="/svg/icons/close.svg"></inline-svg>
      </div>
    </div>

    <el-form :model="form" ref="ruleFormRef" class="px-9 mx-9" :rules="rules">
      <div class="form fit-content d-flex flex-column">
        <div class="d-flex flex-column gap-5 w-100">
          <div class="d-flex gap-5">
            <el-form-item class="w-50" prop="aboutAny">
              <label class="w-100">Type d'évènement</label>
              <el-select
                class="w-100"
                size="large"
                placeholder=""
                v-model="form.aboutAny"
                @change="handleSelectType"
                :disabled="isEdit"
                value-key="id"
              >
                <el-option
                  v-for="object in lists?.CalendarEventType"
                  :key="object.id"
                  :label="object.captionFr"
                  :value="object.tag"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="form.aboutAny && form.aboutAny === 'OffFieldActivity'"
              class="w-50"
              prop="storyEvents.OffFieldType.listIdEventTypeValueObject.id"
            >
              <label class="w-100">Nature d'évènement</label>
              <el-select
                class="w-100"
                size="large"
                :disabled="form.aboutAny.length === 0"
                placeholder=""
                v-model="
                  form.storyEvents.OffFieldType.listIdEventTypeValueObject.id
                "
                @change="handleSelectNature"
              >
                <el-option
                  v-for="object in lists?.OffFieldTypes"
                  :key="object.id"
                  :label="object.captionFr"
                  :value="object.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-else
              class="w-50"
              prop="storyEvents.AppointmentType.listIdEventTypeValueObject.id"
            >
              <label class="w-100">Type</label>
              <el-select
                class="w-100"
                size="large"
                @change="handleSelectNature"
                :disabled="form.aboutAny.length === 0"
                placeholder=""
                v-model="
                  form.storyEvents.AppointmentType.listIdEventTypeValueObject.id
                "
              >
                <el-option
                  v-for="object in lists?.VisitType"
                  :key="object.id"
                  :label="object.captionFr"
                  :value="object.id"
                />
              </el-select>
            </el-form-item>
          </div>

          <el-form-item
            class=""
            prop="captionFr"
            v-if="
              form.aboutAny === 'OffFieldActivity' &&
              (!calendarEventNature ||
                (calendarEventNature && calendarEventNature.tag !== 'Leave'))
            "
          >
            <label>Nom de l'évènement</label>
            <el-input size="large" v-model="form.captionFr"> </el-input>
          </el-form-item>
          <!--start  dates -->
          <div class="d-flex gap-5 align-items-center w-100">
            <el-form-item class="w-50" prop="startDate">
              <label>Date de début</label>
              <div
                tabindex="0"
                class="d-flex align-items-center pe-5 w-100 date-picker__container"
                ref="datePickernextRdvContainerRef"
              >
                <el-date-picker
                  type="date"
                  size="large"
                  class="w-100 cursor-pointer date-picker-custom"
                  v-model="form.startDate"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  ref="datePickernextRdvRef"
                  placeholder="Sélectionnez une date"
                  @focus="$refs.datePickernextRdvContainerRef.focus()"
                >
                </el-date-picker>
                <el-icon
                  class="cursor-pointer"
                  @click="$refs.datePickernextRdvRef.focus()"
                  ><Calendar
                /></el-icon>
              </div>
            </el-form-item>
            <el-form-item class="w-50" prop="endDate">
              <label>Date de fin</label>
              <div
                ref="datePickerCourseContainerRef"
                tabindex="0"
                class="d-flex align-items-center pe-5 w-100 date-picker__container"
              >
                <el-date-picker
                  type="date"
                  size="large"
                  class="w-100 cursor-pointer date-picker-custom"
                  v-model="form.endDate"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  ref="datePickerCourseRef"
                  placeholder="Sélectionnez une date"
                  @focus="$refs.datePickerCourseContainerRef.focus()"
                >
                </el-date-picker>
                <el-icon
                  class="cursor-pointer"
                  @click="$refs.datePickerCourseRef.focus()"
                  ><Calendar
                /></el-icon>
              </div>
            </el-form-item>
          </div>
          <div class="d-flex gap-5 align-items-center w-100">
            <el-form-item class="w-50" prop="startTime">
              <label>Heure de début</label>
              <div
                ref="timePickerStartContainerRef"
                tabindex="0"
                class="d-flex align-items-center pe-5 w-100 date-picker__container"
              >
                <el-time-picker
                  v-model="form.startTime"
                  ref="timePickerStartRef"
                  placeholder="hh:mm"
                  format="HH:mm"
                  class="w-100"
                  size="large"
                  :default-value="new Date().setMinutes(0)"
                  @click="$refs.timePickerStartContainerRef.focus()"
                />
                <el-icon
                  class="cursor-pointer"
                  @click="$refs.timePickerStartRef.focus()"
                  ><Clock
                /></el-icon>
              </div>
            </el-form-item>
            <el-form-item class="w-50" prop="endTime">
              <label>Heure de fin</label>
              <div
                ref="timePickerEndContainerRef"
                tabindex="0"
                class="d-flex align-items-center pe-5 w-100 date-picker__container"
              >
                <el-time-picker
                  v-model="form.endTime"
                  placeholder="hh:mm"
                  format="HH:mm"
                  class="w-100"
                  size="large"
                  ref="timePickerEndRef"
                  :default-value="new Date().setMinutes(0)"
                  @click="$refs.timePickerEndContainerRef.focus()"
                />
                <el-icon
                  class="cursor-pointer"
                  @click="$refs.timePickerEndRef.focus()"
                  ><Clock
                /></el-icon>
              </div>
            </el-form-item>
          </div>
          <!-- end date -->
          <el-form-item
            class=""
            prop="storyEvents.OffField.description"
            v-if="
              form.aboutAny === 'OffFieldActivity' &&
              (!calendarEventNature ||
                (calendarEventNature && calendarEventNature.tag !== 'Leave'))
            "
          >
            <label>Adresse</label>
            <el-input
              size="large"
              v-model="form.storyEvents.OffField.description"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            class=""
            prop="storyEvents.AppointmentEvent.description"
            v-if="
              form.aboutAny === 'Appointment' &&
              (!calendarEventNature ||
                (calendarEventNature && calendarEventNature.tag !== 'Distance'))
            "
          >
            <label>Adresse</label>
            <el-input
              size="large"
              v-model="form.storyEvents.AppointmentEvent.description"
            >
            </el-input>
          </el-form-item>

          <el-form-item class="">
            <label>Description</label>
            <el-input
              v-model="form.description"
              :autosize="{ minRows: 4 }"
              type="textarea"
            />
          </el-form-item>
          <el-form-item
            class="w-100"
            prop="storyEvents.AppointmentReason.description"
            v-if="form.aboutAny && form.aboutAny === 'Appointment'"
          >
            <label class="w-100">Objectif du rendez-vous</label>
            <el-input
              show-word-limit
              maxlength="50"
              size="large"
              v-model="form.storyEvents.AppointmentReason.description"
            />
          </el-form-item>
          <el-form-item
            prop="actorIdByObject.id"
            v-if="form.aboutAny && form.aboutAny === 'Appointment'"
          >
            <label class="w-100">Attacher un contact</label>

            <el-select
              remote
              filterable
              size="large"
              class="w-100"
              :remote-method="querySearch"
              v-model="form.actorIdByObject.id"
              value-key="id"
              clearable
            >
              <el-option
                v-for="item in actorList"
                :key="item.id"
                :label="item.actorName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <div
            class="form fit-content d-flex flex-column"
            v-if="calendarEventNature && calendarEventNature.tag === 'RP/STAFF'"
          >
            <el-form-item class="w-100">
              <label>Attacher un contact</label>
              <el-select
                size="large"
                class="w-100"
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
                v-for="tag in form.storyEvents.OffFieldActivityContact
                  .storyEventInvolves"
                :key="tag"
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
        <inline-svg
          v-if="!isEdit"
          class="me-2"
          src="/svg/icons/plus.svg"
        ></inline-svg>
        <span v-if="!isEdit">Ajouter</span>
        <!--         <span v-if="isEdit">Modifier</span>
 -->
        <span v-if="isEdit && canUpdateActivity">Modifier</span>
        <span
          v-if="isEdit && !canUpdateActivity"
          >Contacter l'administrateur</span
        >
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { setModal } from "@/core/helpers/config";
import service from "@/service";
import { useAuthStore } from "@/store/useAuth";
import { useStoryStore } from "@/store/useStoryModule";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import type { ElForm } from "element-plus";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import _ from "lodash";
import { t } from "@/core/i18n/translate";
import { validateDates } from "@/core/helpers/customValidation";

const { createStory, editStory } = useStoryStore();
const { error } = storeToRefs(useStoryStore());
const { currentUser } = storeToRefs(useAuthStore());

const ruleFormRef = ref<InstanceType<typeof ElForm>>();

const handleCloseModal = () => {
  setModal("");
};
const { story } = storeToRefs(useStoryStore());
const form = ref({
  captionFr: "",
  description: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  aboutAny: "Appointment",
  actorIdByObject: { id: "" },
  storyEvents: {
    AppointmentEvent: {
      listIdEventTypeObject: { id: "" },
      description: "",
    },
    AppointmentType: {
      listIdEventTypeObject: { id: "" },
      listIdEventTypeValueObject: { id: "" },
    },
    AppointmentReason: {
      listIdEventTypeObject: { id: "" },
      listIdEventTypeValueObject: { id: "" },
      description: "",
    },
  },
});
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    required: false,
  },
  selectedDate: {
    type: String,
    required: false,
  },
});
const lists = ref([]);
const actorList = ref([]);
const querySearch = async (queryString: string) => {
  const { data } = await service.api.actorControllerFindManyView({
    take: 50,
    skip: 0,
    "where[actorObject][actorName][contains]": queryString
      ? `${queryString}`
      : "",
    "where[actorObject][actorName][mode]": "insensitive",
    "where[OR][0][actorPerson]": null,
    "where[OR][1][actorPerson][listIdActorPersonTypeObject][tag]": "PDS",
  });

  actorList.value = data.paginatedResult.map((item) => item.actorObject);
};
const attendants = ref([]);
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
    form.value.storyEvents.OffFieldActivityContact.storyEventInvolves.filter(
      (acc) => acc.anyId.actor.id !== tag.anyId.actor.id
    );
};
const showButton = computed(() => new Date() >= new Date(form.value.endDate));
const calendarEventNature = ref();
const handleSelectNature = (value: string) => {
  if (form.value.aboutAny === "OffFieldActivity") {
    calendarEventNature.value = lists.value.OffFieldTypes.find(
      (e) => e.id === value
    );
  }
  if (form.value.aboutAny === "Appointment") {
    calendarEventNature.value = lists.value?.VisitType?.find(
      (e) => e.id === value
    );
  }
};
const handleSelectType = (value: string) => {
  if (value === "Appointment") {
    form.value.storyEvents = {
      AppointmentEvent: {
        listIdEventTypeObject: { id: "" },
        description: "",
      },
      AppointmentType: {
        listIdEventTypeObject: { id: "" },
        listIdEventTypeValueObject: { id: "" },
      },
      AppointmentReason: {
        listIdEventTypeObject: { id: "" },
        listIdEventTypeValueObject: { id: "" },
        description: "",
      },
    };
    lists.value.AppointmentEventType.map((e) => {
      form.value.storyEvents[e.tag].listIdEventTypeObject.id = e.id;
    });
  } else {
    form.value.storyEvents = {
      OffField: {
        listIdEventTypeObject: { id: "" },
        description: "",
      },
      OffFieldType: {
        listIdEventTypeObject: { id: "" },
        listIdEventTypeValueObject: { id: "" },
      },
      OffFieldActivityContact: {
        listIdEventTypeObject: { id: "" },
        storyEventInvolves: null,
      },
    };
    lists.value.OffFieldEventType.map((e) => {
      form.value.storyEvents[e.tag].listIdEventTypeObject.id = e.id;
    });
  }
  form.value.actorIdByObject = { id: "" };
  calendarEventNature.value = null;
};
const handleSubmitForm = async () => {
  /*  if (
    !(calendarEventNature && calendarEventNature.tag === 'RP/STAFF' 
            || (calendarEventNature && calendarEventNature.tag === 'Congress' && showButton))
  ) {
    form.value.storyEvents.OffFieldActivityContact.storyEventInvolves = null;
  } */

  const data = {
    ...form.value,
    storyEvents: Object.values(form.value.storyEvents),
  };
  if (props.isEdit) {
    await editStory({
      id: form.value.id,
      data,
    });
  } else {
    await createStory({ data });
  }
};

const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  if((props.isEdit && !canUpdateActivity.value)){
    handleAdminContact()
  }else{
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
  }
  
  
};

const canUpdateActivity = computed(() => {
  const targetDate = new Date(form.value?.ids?.creation);
  return new Date(targetDate.setDate(targetDate.getDate() + 5)) > new Date();
});
const handleAdminContact = () => {
  setModal("SendEmailModal", {
    title: "Contacter l'administrateur",
    type: "adminContact",
  });
};

onMounted(async () => {
  const resp =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "CalendarEventForm"
    );
  lists.value = resp.data;
  lists.value.AppointmentEventType.map((e) => {
    form.value.storyEvents[e.tag].listIdEventTypeObject.id = e.id;
  });

  if (props.isEdit) {
    form.value = _.cloneDeep({
      ...story.value,
      storyEvents:
        story.value.aboutAny === "Appointment"
          ? story.value.storyEvents
          : {
              ...story.value.storyEvents,
              OffFieldActivityContact: {
                ...story.value.storyEvents?.OffFieldActivityContact,
                storyEventInvolves:
                  story.value.storyEvents?.OffFieldActivityContact?.storyEventInvolves?.map(
                    (item) => ({
                      ...item,
                      anyIdId: item.anyId.actor.id,
                    })
                  ),
              },
            },
    });
    if (form.value?.aboutAny === "Appointment") {
      actorList.value = form.value.actorIdByObject
        ? [form.value.actorIdByObject]
        : [];
      calendarEventNature.value = form.value.storyEvents?.AppointmentType?.listIdEventTypeValueObject;

    } else {
      calendarEventNature.value =
        form.value.storyEvents?.OffFieldType?.listIdEventTypeValueObject;
    }
  } else {
    let startDate = props.selectedDate
      ? new Date(props.selectedDate)
      : new Date();
    let formattedDate =
      startDate.getFullYear() +
      "-" +
      (startDate.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      startDate.getDate().toString().padStart(2, "0");
    form.value.startDate = formattedDate;
    form.value.endDate = formattedDate;
    form.value.startTime = new Date(startDate.setMinutes(0));
  }
  await queryAttendant("");
  await querySearch("");
});

const rules = {
  aboutAny: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "storyEvents.AppointmentType.listIdEventTypeValueObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "storyEvents.OffFieldType.listIdEventTypeValueObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  captionFr: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  startDate: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        const valid = validateDates(
          form.value.startDate,
          form.value.startTime,
          form.value.endDate,
          form.value.endTime
        );
        if (valid) {
          ruleFormRef.value?.clearValidate([
            "startTime",
            "startDate",
            "endDate",
            "endTime",
          ]);
          callback();
        } else {
          callback(new Error("Veuillez vérifier la date et l'heure"));
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  endDate: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        const valid = validateDates(
          form.value.startDate,
          form.value.startTime,
          form.value.endDate,
          form.value.endTime
        );
        if (valid) {
          ruleFormRef.value?.clearValidate([
            "startTime",
            "startDate",
            "endDate",
            "endTime",
          ]);
          callback();
        } else {
          callback(new Error("Veuillez vérifier la date et l'heure"));
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  startTime: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        const valid = validateDates(
          form.value.startDate,
          form.value.startTime,
          form.value.endDate,
          form.value.endTime
        );
        if (valid) {
          ruleFormRef.value?.clearValidate([
            "startTime",
            "startDate",
            "endDate",
            "endTime",
          ]);
          callback();
        } else {
          callback(new Error("Veuillez vérifier la date et l'heure"));
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  endTime: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
    {
      validator: (rule: any, value: any, callback: any) => {
        const valid = validateDates(
          form.value.startDate,
          form.value.startTime,
          form.value.endDate,
          form.value.endTime
        );
        if (valid) {
          ruleFormRef.value?.clearValidate([
            "startTime",
            "startDate",
            "endDate",
            "endTime",
          ]);
          callback();
        } else {
          callback(new Error("Veuillez vérifier la date et l'heure"));
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  "storyEvents.OffField.description": [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "storyEvents.AppointmentEvent.description": [
    {
      required: false,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "storyEvents.AppointmentReason.description": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "actorIdByObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
};
</script>

<style lang="scss" scoped>
.date-picker__container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.date-picker__container:hover {
  border: 1px solid #c0c4cc !important;
}
.date-picker__container:focus {
  border: 1px solid $violet-fonce !important;
}
:deep(.el-input__prefix) {
  display: none !important;
}
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
