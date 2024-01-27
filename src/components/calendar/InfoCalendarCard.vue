<template>
  <div>
    <el-dialog
      v-model="$props.showModal"
      custom-class="visit-dialog__custom-class"
      :close-on-click-modal="true"
      @close="$emit('close-modal')"
      width="600px"
    >
      <div class="w-100 p-8">
        <div class="d-flex justify-content-between align-items-center mb-5">
          <div class="d-flex gap-3 align-items-center">
            <div class="event-info__color"></div>
            <span class="fs-3 fw-bold noir poppins">{{
              cardTitle
            }}</span>
          </div>
          <div class="d-flex gap-3">
            <el-button
              size="large"
              type="primary"
              class="fw-boldest poppins"
              @click="handleAttachShow"
              v-if="
                (calendarData.offFieldActivityNature === 'Congress' && showButton) ||
                calendarData.offFieldActivityNature === 'RP/STAFF'
              "
            >
              Attacher des contacts
            </el-button>
            <el-button
              size="large"
              type="primary"
              class="fw-boldest poppins"
              @click="handleSaveVisit"
              v-if="calendarData.aboutAny ==='Appointment' && showButton"
            >
              Enregistrer la visite
            </el-button>

            <el-button size="large" @click="handleEdit">
              <template #icon>
                <el-icon :size="19"><EditPen /></el-icon>
              </template>
            </el-button>
            <el-button size="large" @click="handleDeleteModal">
              <template #icon>
                <el-icon :size="18"><Delete /></el-icon>
              </template>
            </el-button>
          </div>
        </div>
        <div class="mt-3 ps-7 noir">
          <div class="gris-fonce fw-boldest pt-3">
            Horaire et lieu de l’évènement
          </div>
          <div v-if="calendarData.startDate === calendarData.endDate" class="fw-bold">
            {{ calendarData.startDate }} {{ calendarData.startTime }} à
            {{ calendarData.endTime }}
          </div>
          <div v-else class="fw-bold">
            {{ calendarData.startDate }} {{ calendarData.startTime }} à
            {{ calendarData.endDate }} {{ calendarData.endTime }}
          </div>
          <div class="fw-bold">{{ calendarData.address }}</div>
          <div class="gris-fonce fw-boldest mt-5">Type d'évènement</div>
          <div class="fw-bold">{{ calendarData.eventType }}</div>
          <div class="gris-fonce fw-boldest mt-5">Description</div>
          <div class="fw-bold">{{ calendarData.description || "-" }}</div>


          <div v-if="
          (calendarData.offFieldActivityNature === 'Congress' && showButton) ||
          calendarData.offFieldActivityNature === 'RP/STAFF'
            ">
            <div class="gris-fonce fw-boldest mt-5">Participant(s)</div>
            <div class="fw-bold">{{calendarData.storyEvents?.OffFieldActivityContact?.storyEventInvolves?.map((p)=>p.anyId.actor.actorName).join(" , ") || '-'}}</div>
          </div>



          <div v-if="calendarData.aboutAny === 'Appointment'">
            <div class="gris-fonce fw-boldest mt-5">Participant</div>
            <div class="fw-bold">{{ calendarData.actorIdByObject?.actorName }}</div>
            <div class="gris-fonce fw-boldest mt-5">
              Objectif du rendez-vous
            </div>
            <div class="fw-bold">
              {{
                calendarData.storyEvents?.AppointmentReason
                  ?.description
              }}
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { storeToRefs } from "pinia";
import { setModal } from "@/core/helpers/config";
import { useStoryStore } from "@/store/useStoryModule";
import { useRouter } from "vue-router";
import { generateEventColorBasedOnType } from "@/core/helpers/calendarUtils";
import service from "@/service";
const router = useRouter();
import { Components } from "@tekab-dev-team/storybook-devfactory";

const { story } = storeToRefs(useStoryStore());
const showButton = ref(
  new Date() >= new Date(story.value.endDate));
const { deleteStory , appointmentToStory } = useStoryStore();
const bgColor = ref(generateEventColorBasedOnType(story.value).bgColor);
const textColor = ref("#000000");
const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});
const dateOptions = {
  weekday: "long",
  day: "numeric",
  month: "long",
};
const timeOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};


const calendarData = computed(() => {
  return {
    ...story.value,

    address:
      story.value.aboutAny === "Appointment"
        ? story.value?.storyEvents?.AppointmentEvent?.description
        : story.value.aboutAny === "OffFieldActivity"
        ? story.value?.storyEvents?.OffField?.description
        : story.value.aboutAny === "visit" ?
        story.value?.storyEvents?.Visit?.address ?
          story.value?.storyEvents?.Visit?.address?.street || ''+
          " " +
          story.value?.storyEvents?.Visit?.address?.streetNb || ''+
          " " +
          story.value?.storyEvents?.Visit?.address?.town || '' +
          " " +
          story.value?.storyEvents?.Visit?.address?.zipCode || ''
        : "" : "",
    eventType:
      story.value.aboutAny === "Appointment"
        ? "Rendez-vous - " +
          story.value.storyEvents?.AppointmentType?.listIdEventTypeValueObject
            ?.captionFr
        : story.value.aboutAny === "OffFieldActivity"
        ? "Hors Terrain - " +
          story.value.storyEvents?.OffFieldType?.listIdEventTypeValueObject
            ?.captionFr
        : "Visite",
    offFieldActivityNature:
      story.value.aboutAny === "OffFieldActivity"
        ? story.value.storyEvents?.OffFieldType?.listIdEventTypeValueObject?.tag
        : "",
    startDate: new Date(story.value.startDate).toLocaleDateString(
      "fr-FR",
      dateOptions
    ),
    startTime: new Date(story.value.startTime).toLocaleTimeString(
      "fr-FR",
      timeOptions
    ),
    endDate:
       story.value.endDate ?
        new Date(story.value.endDate).toLocaleDateString("fr-FR", dateOptions)
        : story.value.aboutAny === "visit" ?
        new Date(story.value.startDate).toLocaleDateString(
            "fr-FR",
            dateOptions
          ) : "",
    endTime:
      story.value.endTime ?
         new Date(story.value.endTime).toLocaleTimeString("fr-FR", timeOptions)
        :story.value.aboutAny === "visit" ?
         new Date(
            new Date(story.value.startTime).getTime() +
              story.value.listIdDurationObject?.code * 60 * 1000
          ).toLocaleTimeString("fr-FR", timeOptions) : "",
  };
});



const handleSaveVisit = async () => {
  const form = ({
    captionFr: "",
    aboutAny: "visit",
    startDate: story.value.startDate,
    startTime: story.value.startTime,
    endTime:story.value.endTime,
    endDate:story.value.endDate,
    actorIdByObject:{
      id: story.value?.actorIdByObject?.actorObject?.id,
      yearlyVisit: story.value?.actorIdByObject?.actorView?.yearlyVisit,
      monthlyVisit: story.value?.actorIdByObject?.actorView?.monthlyVisit,
      lastVisitDate: story.value?.actorIdByObject?.actorView?.lastVisitDate,
      actorObject:story.value?.actorIdByObject
    },
    description:story.value?.storyEvents?.AppointmentReason?.description,
    listIdDurationObject: {
      id:"2031"
    },
    ids:{
      creationBy:story.value?.ids?.creationBy,
      id: story.value?.ids?.id
    },
    storyEvents: {
      VisitType: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "VisitType",
          },
        },
        listIdEventTypeValueObject: { id: story.value?.storyEvents?.AppointmentType?.listIdEventTypeValueObject?.id },
      },

      NextVisit: {
      listIdEventTypeObject: { 
        listTypeName_tag: {
            listTypeName: "EventType",
            tag: "NextVisit",
          },
      },
      storyEventInvolves: [
        {
          anyId: {
            story: {
              aboutAny: "Appointment",
              description: "",
              startDate: null,
              startTime: null,
              endDate: null,
              endTime: null,
              storyEvents:[
                {
                listIdEventTypeObject: { 
                    id:"3049"
                },
                description:""                                              
              },{
                listIdEventTypeObject: {  
                  id:"3047"
           
              },
                description: "",
              },
              {
                listIdEventTypeObject: {  
                  id:"3048"
                 },
                listIdEventTypeValueObject: { 
                  id:"3018"
                
                },
              },
            ]
            },
          },
        },
      ],
    },
      Course: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "Course",
          },
        },
        listIdEventTypeValueObject: { id: "" },
        eventDate: null,
        description:""
      },
      InPlaceSample: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "InPlaceSample",
          },
        },
        eventDate: null,
        storyEventInvolves: null,
      },
      ToSendSample: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "ToSendSample",
          },
        },
        eventDate: null,
        storyEventInvolves: null,
      },
      Delivery: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "Delivery",
          },
        },
        listIdEventTypeValueObject: { id: "" },
      },
      Order: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "Order",
          },
        },
        listIdEventTypeValueObject: { id: "" },
      },
      ContactReplacement: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "ContactReplacement",
          },
        },
        storyEventInvolves: [
          {
            anyId: {
              substitute: {
                id: "",
              },
            },
          },
        ],
      },
      Product: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "Product",
          },
        },
        storyEventInvolves: [],
      },
      Visit: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "Visit",
          },
        },
        listIdEventTypeValueObject: { id: "1142" },
        address: { id: null },
      },
      ContactAttendant: {
        listIdEventTypeObject: {
          listTypeName_tag: {
            listTypeName: "EventType",
            tag: "ContactAttendant",
          },
        },
        storyEventInvolves: [],
      },
    },
  });
  const data = {
    ...form,
    storyEvents: Object.values(form.storyEvents),
  }
  setModal("VisitUpdate",{id:story.value?.id,type:"appointmentToStory",form:form})
};

const handleEdit = () => {
  if (story.value.aboutAny === "visit") {
    setModal("");
    router.push({
      name: "admin-detail-visit",
      params: { id: story.value.id },
    });
  } else {
    setModal("CalendarEventEdit");
  }
};
const handleDeleteEvent = async (id: string, motif: string) => {
  await deleteStory({
    id,
    deletedReason: motif,
  });
};
const handleDeleteModal = async () => {
  if(story.value.aboutAny === "visit"){
 setModal("DeleteContactModal", {
    id: story.value.id,
    deleteEntity: handleDeleteEvent,
    title: "Supprimer l'évènement",
    text: `l'évènement de ${story.value?.actorIdByObject?.actorName}`,
  });
  }else {
    await deleteStory({
    id :story.value.id,
    deletedReason: undefined,
  });
  Components.ElNotification.success({
          message: "Opération effectuée avec succès",
          position: "bottom-right",
          offset: 60,
          duration: 2000,
          customClass: "success-notif",
        });

  setModal('')
  }
};

const cardTitle = computed(() => {
  return story.value.captionFr ? story.value.captionFr :
          story.value.aboutAny === 'Appointment' ? "RDV - " + story.value?.actorIdByObject?.actorName :
          story.value.aboutAny === 'OffFieldActivity' ? 
          story.value.storyEvents?.OffFieldType?.listIdEventTypeValueObject?.captionFr :
          story.value.aboutAny === 'visit'? 'Visite - ' + story.value?.actorIdByObject?.actorName :
          "Évènement"
})

const handleAttachShow = () => {
  setModal("AttachContact");
};


</script>

<style lang="scss" scoped>
.event-info__color {
  height: 16px;
  width: 16px;
  background: $violet-hover;
  border-radius: 6px;
  box-shadow: 0px 2px 10px 4px rgba(199, 199, 204, 0.28);
  background-color: v-bind(bgColor);
}

:deep(.el-tag) {
  color: v-bind(textColor);
}
.scrollbar {
  overflow-wrap: break-word;
}
</style>
