<template>
  <div class="w-100 h-100">
    <div
      class="cursor-pointer appointment-close d-flex justify-content-end w-100 me-5 mt-5"
      @click="handleCloseClick"
      v-if="isEdit && payload && payload.type === 'appointmentToStory'"
    >
      <inline-svg src="/svg/icons/close.svg"></inline-svg>
    </div>
    <div v-if="!isEdit" class="d-flex justify-content-between p-9 m-9">
      <div>
        <div class="fs-1 fw-boldest noir">Nouvelle visite - Contact</div>
        <div class="poppins fs-6 mt-2 noir">
          La création d’une visite s’effectue après la fin du rendez-vous avec
          le contact. Il n’y a pas de visite prévisionnelle.
        </div>
      </div>
      <div class="cursor-pointer" @click="handleCloseClick">
        <inline-svg src="/svg/icons/close.svg"></inline-svg>
      </div>
    </div>
    <el-form
      :model="form"
      :rules="rules"
      ref="ruleFormRef"
      class="h-100 d-flex flex-column justify-content-between"
    >
      <div
        :class="
          isEdit && !(payload && payload.type === 'appointmentToStory')
            ? ''
            : 'px-9 mx-9'
        "
      >
        <div class="d-flex gap-10 justify-content-between">
          <div class="w-25">
            <template v-if="!isEdit">
              <div class="fs-3 fw-boldest pb-5 noir">
                Informations générales
              </div>
              <el-form-item prop="actorIdByObject.id">
                <label class="w-100">Rechercher un contact*</label>
                <el-select
                  remote
                  filterable
                  size="large"
                  class="w-100 custom-remote"
                  prefix-icon="Search"
                  remote-show-suffix
                  @change="handleSelectClient"
                  :remote-method="querySearch"
                  v-model="contactSearch"
                  value-key="id"
                  clearable
                  placeholder="Rechercher un contact"
                >
                  <el-option
                    v-for="item in actorList"
                    :key="item.id"
                    :label="item.actorObject.actorName"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
              <el-divider />
            </template>
            <div class="fs-3 fw-boldest pb-5 noir">Détails de la visite</div>
            <div class="d-flex gap-5">
              <el-form-item prop="startDate" class="w-50">
                <label>Date*</label>
                <el-date-picker
                  type="date"
                  size="large"
                  class="w-100 cursor-pointer date-picker-custom"
                  v-model="form.startDate"
                  prefix-icon="none"
                  placeholder="Sélectionnez une date"
                  :disabled-date="disabledDate"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                  :validate-event="false"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="startTime" class="w-50">
                <label>Horaire*</label>
                <el-time-picker
                  size="large"
                  format="HH:mm"
                  v-model="form.startTime"
                  placeholder="Horaire"
                  :default-value="new Date().setMinutes(0)"
                />
              </el-form-item>
            </div>
            <el-form-item
              prop="storyEvents.VisitType.listIdEventTypeValueObject.id"
            >
              <label class="w-100">Type de visite*</label>
              <el-select
                size="large"
                class="w-100"
                placeholder="Sélectionnez un type"
                v-model="
                  form.storyEvents.VisitType.listIdEventTypeValueObject.id
                "
              >
                <el-option
                  v-for="item in lists?.VisitType"
                  :key="item.id"
                  :label="item.captionFr"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item
              prop="storyEvents.Visit.listIdEventTypeValueObject.id"
            >
              <label class="w-100">Motif de visite*</label>
              <el-select
                size="large"
                class="w-100"
                placeholder="Sélectionnez un motif"
                v-model="form.storyEvents.Visit.listIdEventTypeValueObject.id"
              >
                <el-option
                  v-for="item in lists?.VisitReasons"
                  :key="item.id"
                  :label="item.captionFr"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="listIdDurationObject.id">
              <label class="w-100">Temps de visite*</label>
              <el-select
                size="large"
                class="w-100"
                placeholder="Sélectionnez une période"
                v-model="form.listIdDurationObject.id"
              >
                <el-option
                  v-for="item in lists?.visitDuration"
                  :key="item.id"
                  :label="item.captionFr"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="mb-4">
              <label class="w-100">Acompagnant(s) (3 maximum)</label>

              <el-select
                size="large"
                class="w-100"
                placeholder="Sélectionnez un accompagnant"
                multiple
                remote
                filterable
                :remote-method="queryAttendant"
                value-key="anyIdId"
                v-model="form.storyEvents.ContactAttendant.storyEventInvolves"
                :multiple-limit="3"
              >
                <el-option
                  v-for="item in attendants"
                  :key="item.anyId.user.id"
                  :label="item.anyId.user.firstName"
                  :value="item"
                />
              </el-select>
            </el-form-item>
            <el-tag
              v-for="tag in form.storyEvents.ContactAttendant
                .storyEventInvolves"
              :key="tag"
              class="mx-1 p-5 fs-6 poppins"
              closable
              round
              color="#9A5AFF"
              @close="handleTagClose(tag)"
            >
              {{ tag.anyId.user.firstName }}
            </el-tag>
          </div>
          <div
            v-if="form.actorIdByObject"
            class="ms-9 d-flex gap-5 justify-content-between visit-form__contact w-75"
          >
            <div
              class="py-5 px-10 px-l-5 d-flex flex-column align-items-center justify-content-center visit-form__contact-info"
            >
              <div class="w-100">
                <div class="d-flex gap-5 poppins fs-7">
                  <!--begin::Avatar-->
                  <div class="symbol symbol-56px">
                    <avatar
                      shape="circle"
                      :first-name="
                        form.actorIdByObject?.actorObject?.actorPerson
                          ? form.actorIdByObject?.actorObject?.actorPerson
                              .firstName
                          : ''
                      "
                      :last-name="form.actorIdByObject?.actorObject.actorName"
                      :size="36"
                      background-color="#FFC200"
                      text-color="#363636"
                      src=""
                    />
                  </div>
                  <!--end::Avatar-->
                  <div>
                    <div class="fs-6 noir">
                      {{ form.actorIdByObject?.actorObject.actorName }}
                      {{
                        form.actorIdByObject?.actorObject?.actorPerson
                          ? form.actorIdByObject?.actorObject?.actorPerson
                              ?.firstName
                          : ""
                      }}
                    </div>
                    <div class="violet-fonce">
                      Dernière visite le
                      {{
                        form.actorIdByObject?.lastVisitDate
                          ? new Date(
                              form.actorIdByObject?.lastVisitDate
                            ).toLocaleDateString("FR-fr")
                          : "xx/xx/xx"
                      }}
                    </div>
                    <div>
                      Importance :
                      {{ form.actorIdByObject?.actorObject?.importance ?? "-" }}
                    </div>
                    <div>
                      {{ form.actorIdByObject?.yearlyVisit }} visite(s) depuis
                      le début d'année
                    </div>
                    <div>
                      {{
                        form.actorIdByObject?.actorObject?.yearVisitObjective
                      }}
                      visite en objectif annuelle
                    </div>
                    <div v-if="form.actorIdByObject?.actorObject?.actorPerson">
                      RPPS :
                      {{ form.actorIdByObject?.actorObject?.actorPerson?.rpps }}
                    </div>
                    <div>
                      UGA :
                      {{
                        form.actorIdByObject?.actorObject?.addressOfActor &&
                        form.actorIdByObject?.actorObject?.addressOfActor
                          .length > 0
                          ? form.actorIdByObject?.actorObject?.addressOfActor[0]
                              .listIdUgaObject?.code
                          : "-"
                      }}
                    </div>
                    <div>
                      Département :
                      {{
                        form.actorIdByObject?.actorObject?.addressOfActor &&
                        form.actorIdByObject?.actorObject?.addressOfActor
                          .length > 0
                          ? form.actorIdByObject?.actorObject?.addressOfActor[0]
                              .departement
                          : "-"
                      }}
                    </div>
                    <div v-if="form.actorIdByObject?.actorObject?.actorPerson">
                      Spécialité :
                      {{
                        form.actorIdByObject?.actorObject
                          ?.listIdActorPersonSpecializationObject?.captionFr ||
                        "-"
                      }}
                    </div>
                    <div
                      v-if="
                        form.actorIdByObject?.actorObject?.actorCompany &&
                        form.actorIdByObject?.actorObject?.actorCompany
                          ?.listIdActorCompanyTypeObject?.tag === 'Pharmacy'
                      "
                    >
                      Code CIP :
                      {{
                        form.actorIdByObject?.actorObject?.actorCompany &&
                        form.actorIdByObject?.actorObject?.actorCompany
                          ?.listIdActorCompanyTypeObject?.tag === "Pharmacy" &&
                        form.actorIdByObject?.actorObject?.addressOfActor &&
                        form.actorIdByObject?.actorObject?.addressOfActor
                          .length > 0
                          ? form.actorIdByObject?.actorObject?.addressOfActor[0]
                              .row1Value
                          : "-"
                      }}
                    </div>
                  </div>
                </div>
                <el-divider class="visit-form__divider" />
                <el-form-item>
                  <label class="w-100">Remplaçant</label>
                  <el-select
                    size="large"
                    class="w-100"
                    @change="handleSelectRemplacant"
                    v-model="
                      form.storyEvents.ContactReplacement.storyEventInvolves[0]
                        .anyId.substitute.id
                    "
                  >
                    <el-option key="Aucun" label="Aucun" value=""></el-option>
                    <el-option
                      v-for="item in form.actorIdByObject.actorObject
                        .substituteds"
                      :key="item.id"
                      :label="
                        item.substitute
                          ? item.substitute.actorName +
                            ' ' +
                            item.substitute.actorPerson.firstName
                          : item.firstName + ' ' + item.lastName
                      "
                      :value="item.id"
                    ></el-option>
                    <el-option
                      key="newRemplacant"
                      label="Nouveau remplaçant"
                      value="newRemplacant"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <label class="w-100">Adresse</label>
                  <el-select
                    size="large"
                    class="w-100"
                    v-model="form.storyEvents.Visit.address.id"
                  >
                    <el-option
                      v-for="address in actorAdresses"
                      :key="address.id"
                      :label="
                        address.streetNb +
                        ' ' +
                        address.street +
                        ' ' +
                        address.zipCode +
                        ' ' +
                        address.town
                      "
                      :value="address.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <div class="visit-form__contact-map">
              <img
                class="h-100 w-100 map-img"
                src="/png/illustrations/map.png"
              />
            </div>
          </div>
        </div>
        <el-divider v-if="form.actorIdByObject" />
        <div v-if="form.actorIdByObject">
          <div class="fs-3 fw-boldest pb-5 noir">
            Présentation des produits et documents
          </div>
          <div>
            <div
              v-if="!form.storyEvents.Product.storyEventInvolves.length"
              class="fw-boldest noir"
            >
              Produit(s) présenté(s)
            </div>

            <InputTable
              ref="inputTableProductRef"
              :data="form.storyEvents.Product.storyEventInvolves"
              :columns="productColumns"
              @action="handleProductSelect"
              @add="handleProductAdd"
              @result="handleProductSelect"
              @delete="handleProductDelete"
              @name="handleSelectProduct"
              @nameSuggest="handleProductSuggest"
            />
          </div>
          <!--           <div class="fw-boldest" v-if="form.documents && !form.documents.length">
            Documents remis
          </div>
          <InputTable
            v-if="false"
            :data="form.documents"
            :columns="documentsColumns"
            @add="handleDocumentAdd"
            @delete="handleDocumentDelete"
          /> -->
          <div
            class="d-flex gap-9"
            v-if="
              form.actorIdByObject.actorObject.actorCompany &&
              form.actorIdByObject.actorObject.actorCompany
                .listIdActorCompanyTypeObject.tag === 'Pharmacy'
            "
          >
            <div class="me-9">
              <div class="fw-boldest noir">Commande en direct</div>
              <el-radio-group
                class="ml-4 poppins"
                v-model="form.storyEvents.Order.listIdEventTypeValueObject.id"
              >
                <el-radio
                  v-for="item in lists?.ProductOrderType"
                  :label="item.id"
                  size="large"
                  class="noir"
                  :key="item.id"
                  ><span class="noir">{{ item.captionFr }}</span>
                </el-radio>
              </el-radio-group>
            </div>
            <div class="ms-9">
              <div class="fw-boldest noir">Livraison en entrepôt</div>
              <el-radio-group
                class="ml-4 poppins"
                v-model="
                  form.storyEvents.Delivery.listIdEventTypeValueObject.id
                "
              >
                <el-radio
                  v-for="item in lists?.ProductDeliveryType"
                  :label="item.id"
                  size="large"
                  class="noir"
                  :key="item.id"
                  ><span class="noir">{{ item.captionFr }}</span></el-radio
                >
              </el-radio-group>
            </div>
          </div>
          <template
            v-if="
              form.actorIdByObject.actorObject.actorPerson ||
              (form.actorIdByObject.actorObject.actorCompany &&
                form.actorIdByObject.actorObject.actorCompany
                  .listIdActorCompanyTypeObject.tag !== 'Pharmacy')
            "
          >
            <el-divider />
            <div class="fs-3 fw-boldest pb-5 noir">Remise d'échantillons</div>
            <div>
              <div class="d-flex gap-5 mb-3">
                <div class="d-flex d-flex align-items-center gap-3">
                  <el-switch
                    @change="handleInPlaceSwitch"
                    v-model="inPlaceSwitch"
                  />
                  <span class="poppins noir">Echantillons remis sur place</span>
                </div>
                <div class="d-flex d-flex align-items-center gap-3">
                  <el-switch
                    class="ml-2"
                    @change="handleToSendSwitch"
                    v-model="toSendSwitch"
                  />
                  <span class="poppins noir">Echantillons à expédier</span>
                </div>
              </div>
              <div v-if="inPlaceSwitch">
                <div class="fw-boldest">Remis sur place</div>
                <InputTable
                  ref="inputTableInPlaceRef"
                  :data="form.storyEvents.InPlaceSample.storyEventInvolves"
                  :columns="inPlaceColumns"
                  @inputChange="handleInPlaceInput"
                  @add="handleAddInPlace"
                  @delete="handleInPlaceDelete"
                  @name="handleInplaceSampleSelect"
                  @nameSuggest="handleInplaceSuggest"
                />
              </div>
              <div v-if="toSendSwitch">
                <div class="fw-boldest my-4">À expédier</div>
                <InputTable
                  ref="inputTableToSendRef"
                  :data="form.storyEvents.ToSendSample.storyEventInvolves"
                  :columns="toSendColumns"
                  @inputChange="handleToSendInput"
                  @add="handleAddExp"
                  @adrExp="handleSelectAdr"
                  @delete="handleToSendDelete"
                  @name="handleToSendSampleSelect"
                  @nameSuggest="handleToSendSuggest"
                />
              </div>
            </div>
          </template>
          <div
            v-if="
              form.actorIdByObject.actorObject.actorCompany &&
              form.actorIdByObject.actorObject.actorCompany
                .listIdActorCompanyTypeObject.tag === 'Pharmacy'
            "
          >
            <el-divider />
            <div class="fs-3 fw-boldest pb-5 noir">Formation</div>
            <div class="d-flex align-items-center pe-5 gap-3 mb-3">
              <el-switch v-model="courseSwitch" @change="handleCourseSwitch" />
              <span class="noir">Formation demandée</span>
            </div>
            <div class="d-flex align-items-end gap-5" v-if="courseSwitch">
              <el-form-item>
                <div class="d-flex flex-column">
                  <label>Type de formation</label>
                  <el-select
                    size="large"
                    v-model="
                      form.storyEvents.Course.listIdEventTypeValueObject.id
                    "
                  >
                    <el-option
                      v-for="course in lists?.CourseType"
                      :key="course.id"
                      :label="course.captionFr"
                      :value="course.id"
                    ></el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item>
                <label>Date de formation</label>
                <div
                  ref="datePickerCourseContainerRef"
                  tabindex="0"
                  class="d-flex align-items-center pe-5 w-100 date-picker__container"
                >
                  <el-date-picker
                    type="date"
                    size="large"
                    class="w-100 cursor-pointer date-picker-custom"
                    v-model="form.storyEvents.Course.eventDate"
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
              <el-form-item>
                <label>Information complémentaire</label>
                <el-input
                  show-word-limit
                  maxlength="150"
                  size="large"
                  v-model="form.storyEvents.Course.description"
                />
              </el-form-item>
            </div>
          </div>
          <el-divider />
          <div class="fs-3 fw-boldest pb-5 noir">
            Objectif de la prochaine visite
          </div>
          <div class="d-flex align-items-end gap-5">
            <el-form-item
              v-if="
                form.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
                  .aboutAny &&
                form.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
                  .aboutAny === 'Appointment'
              "
              prop="storyEvents.NextVisit.storyEventInvolves[0].anyId.story.storyEvents[0].description"
            >
              <label>Objectif de la prochaine visite</label>
              <el-input
                show-word-limit
                maxlength="50"
                size="large"
                v-model="
                  form.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
                    .storyEvents[0].description
                "
              />
            </el-form-item>
            <el-form-item
              v-else
              prop="storyEvents.NextVisit.storyEventInvolves[0].anyId.story.description"
            >
              <label>Objectif de la prochaine visite</label>
              <el-input
                show-word-limit
                maxlength="50"
                size="large"
                v-model="
                  form.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
                    .description
                "
              />
            </el-form-item>
            <el-form-item
              prop="storyEvents.NextVisit.storyEventInvolves[0].anyId.story.startDate"
            >
              <label>Date du prochain rendez-vous/Rappel</label>
              <div
                tabindex="0"
                class="d-flex align-items-center pe-5 w-100 date-picker__container"
                ref="datePickernextRdvContainerRef"
              >
                <el-date-picker
                  type="date"
                  size="large"
                  class="w-100 cursor-pointer date-picker-custom"
                  v-model="
                    form.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
                      .startDate
                  "
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
            <el-form-item
              prop="storyEvents.NextVisit.storyEventInvolves[0].anyId.story.startTime"
            >
              <label>Heure de début</label>
              <div
                ref="timePickerStartContainerRef"
                tabindex="0"
                class="d-flex align-items-center pe-5 w-100 date-picker__container"
              >
                <el-time-picker
                  v-model="
                    form.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
                      .startTime
                  "
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
              </div> </el-form-item
            ><el-form-item
              prop="storyEvents.NextVisit.storyEventInvolves[0].anyId.story.endTime"
            >
              <label>Heure de fin</label>
              <div
                ref="timePickerEndContainerRef"
                tabindex="0"
                class="d-flex align-items-center pe-5 w-100 date-picker__container"
              >
                <el-time-picker
                  v-model="
                    form.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
                      .endTime
                  "
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
        </div>
      </div>
      <div
        v-if="!isEdit || (isEdit && payload && payload.type === 'appointmentToStory')"
        class="visit-form__footer mx-5 d-flex justify-content-end m-5"
      >
        <el-button
          size="large"
          type="primary"
          class="fw-bolder me-2"
          @click="onSubmit(ruleFormRef)"
        >
          Valider la visite
        </el-button>
      </div>
      <div
        v-if="isEdit && form.actorIdByObject && !payload"
        class="d-flex justify-content-end m-5"
      >
        <el-button
          v-if="canUpdateVisit"
          size="large"
          type="primary"
          class="fw-bolder me-2"
          @click="onSubmit(ruleFormRef)"
        >
          Modifier
        </el-button>
        <el-button
          v-else
          size="large"
          type="primary"
          class="fw-bolder me-2"
          @click="handleAdminContact"
        >
          Contacter l'administrateur
        </el-button>
      </div>
    </el-form>
    <ConfirmModal
      title="Ajouter une nouvelle adresse d'expedition au contact"
      :isOpenModal="createNewAddress.visible"
      @close-confirm-modal="handleAddressClose"
      @approve-confirm-modal="createNewAddress.submit = true"
      :beforeClose="handleAddressClose"
      confirmTitle="Ajouter"
    >
      <div class="p-9 form">
        <AddressForm
          @update="handleNewAddressUpdate"
          :inputs="inputs"
          @validate="handleValidate"
          :submit="createNewAddress.submit"
        />
      </div>
    </ConfirmModal>
    <ConfirmModal
      title="Ajouter un nouveau remplaçant au contact"
      :isOpenModal="createNewSubstitute.visible"
      @close-confirm-modal="handleSubstituteClose"
      @approve-confirm-modal="createNewSubstitute.submit = true"
      :beforeClose="handleSubstituteClose"
      confirmTitle="Ajouter"
    >
      <SubstituteForm
        :submit="createNewSubstitute.submit"
        @submit="handleNewSubstitute"
        @invalid="createNewSubstitute.submit = false"
        :contact="form.actorIdByObject.actorObject"
      />
    </ConfirmModal>
  </div>
</template>
<script setup lang="ts">
import { useConfigStore } from "@/store/useConfig";
import { DfAvatar as Avatar } from "@tekab-dev-team/storybook-devfactory";
import InputTable from "@/components/shared/InputTable.vue";
import { computed, ref, onMounted, watch } from "vue";
import { setModal } from "@/core/helpers/config";
import AddressForm from "@/components/forms/AddressForm.vue";
import ConfirmModal from "@/components/modals/ConfirmModal.vue";
import SubstituteForm from "@/components/forms/SubstituteForm.vue";
import { useActorStore } from "@/store/useActorModule";
import { useProductStore } from "@/store/useProductModule";
import { t } from "@/core/i18n/translate";
import type { ElForm } from "element-plus";
import { storeToRefs } from "pinia";
import service from "@/service";
import _ from "lodash";
import { useRoute } from "vue-router";
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { useAddressStore } from "@/store/useAddressModule";
import { useStoryStore } from "@/store/useStoryModule";
import { useUserStore } from "@/store/useUserModule";
import { Actor } from "index";
import { validateDates } from "@/core/helpers/customValidation";
import { Search } from "@element-plus/icons-vue";
import { ElIcon } from "element-plus";
import { useAuthStore } from "@/store/useAuth";
const lists = ref();
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const handleCloseClick = () => {
  setModal("");
};
const { fetchUsers } = useUserStore();
const actorList = ref<Array<Actor>>([]);
const { fetchProducts } = useProductStore();
const { productList } = storeToRefs(useProductStore());
const { createAddress } = useAddressStore();
const { createStory, getStoryById, editStory, showNewAppointment , appointmentToStory} =
  useStoryStore();
const { story, error } = storeToRefs(useStoryStore());
const { currentUser } = storeToRefs(useAuthStore());

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false,
  },
  payload: {
    type: Object,
    default: null,
  },
});
const route = useRoute();
const id = props.payload?.id || (route.params.id as string);
const createNewAddress = ref({
  visible: false,
  index: 0,
  submit: false,
  address: {},
});
const inputTableInPlaceRef = ref(null);
const inputTableToSendRef = ref(null);
const inputTableProductRef = ref(null);
const createNewSubstitute = ref({ visible: false, submit: false, old: "" });
const handleAddressClose = () => {
  createNewAddress.value.visible = false;
};
const canUpdateVisit = computed(() => {
  const targetDate = new Date(form.value.ids.creation);
  return new Date(targetDate.setDate(targetDate.getDate() + 5)) > new Date();
});

const handleAdminContact = () => {
  setModal("SendEmailModal", {
    title: "Contacter l'administrateur",
    type: "adminContact",
  });
};
const handleSubstituteClose = () => {
  form.value.storyEvents.ContactReplacement.storyEventInvolves[0].anyId.substitute.id =
    createNewSubstitute.value.old;
  createNewSubstitute.value.visible = false;
};
const form = ref(props.payload?.type === 'appointmentToStory'  ? props.payload.form : {
  captionFr: "",
  aboutAny: "visit",
  startDate: null,
  startTime: null,
  listIdDurationObject: {
    id: "2028",
  },
  storyEvents: {
    VisitType: {
      listIdEventTypeObject: { id: "" },
      listIdEventTypeValueObject: { id: "" },
    },
    NextVisit: {
      listIdEventTypeObject: { id: "" },
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
              storyEvents: [
                {
                  listIdEventTypeObject: {
                    id: "3049",
                  },
                  description: "",
                },
                {
                  listIdEventTypeObject: {
                    id: "3047",
                  },
                  description: "",
                },
                {
                  listIdEventTypeObject: {
                    id: "3048",
                  },
                  listIdEventTypeValueObject: {
                    id: "3018",
                  },
                },
              ],
            },
          },
        },
      ],
    },
    Course: {
      listIdEventTypeObject: { id: "" },
      listIdEventTypeValueObject: { id: "" },
      eventDate: null,
      description: "",
    },
    InPlaceSample: {
      listIdEventTypeObject: { id: "" },
      eventDate: null,
      storyEventInvolves: null,
    },
    ToSendSample: {
      listIdEventTypeObject: { id: "" },
      eventDate: null,
      storyEventInvolves: null,
    },
    Delivery: {
      listIdEventTypeObject: { id: "" },
      listIdEventTypeValueObject: { id: "3011" },
    },
    Order: {
      listIdEventTypeObject: { id: "" },
      listIdEventTypeValueObject: { id: "3008" },
    },
    ContactReplacement: {
      listIdEventTypeObject: { id: "" },
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
    Product: { listIdEventTypeObject: { id: "" }, storyEventInvolves: [] },
    Visit: {
      listIdEventTypeObject: { id: "" },
      listIdEventTypeValueObject: { id: "" },
      address: { id: null },
    },
    ContactAttendant: {
      listIdEventTypeObject: { id: "" },
      storyEventInvolves: [],
    },
  },
  documents: [],
});

// begin products management
const handleProductSelect = (payload: any) => {
  _.set(
    form.value.storyEvents.Product.storyEventInvolves[payload.index],
    payload.column,
    payload.value
  );
};
const courseSwitch = ref(false);
const handleProductAdd = async () => {
  form.value.storyEvents.Product.storyEventInvolves = [
    ...form.value.storyEvents.Product.storyEventInvolves,
    {
      anyId: {
        actorProduct: {
          name: "",
          id: "",
          description: "",
          markets:[]
        },
      },
      listIdProductActionObject: {
        id: "",
      },
      listIdProductResultObject: {
        id: "",
      },
    },
  ];
  await handleProductSuggest({
    query: "",
    index: form.value.storyEvents.Product.storyEventInvolves.length - 1,
  });
};
const handleSelectProduct = (payload) => {
  _.set(
    form.value.storyEvents.Product.storyEventInvolves[payload.index].anyId,
    "actorProduct",
    payload.value
  );
};
const productColumns = ref([
  {
    label: "Produit(s) présenté(s)",
    prop: "anyId.actorProduct.name",
    type: "autoComplete",
    valueKey: "name",
    suggestions: [productList.value],
    name: "name",
    rules: {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  },
  {
    label: "Marché(s)",
    prop: "anyId.actorProduct.markets",
    type: "joinArray",
    joinProperty: "listIdProductMarketObject.captionFr",
    name: "market",
  },
  {
    label: "Catégorie(s)",
    prop: "anyId.actorProduct.listIdProductCategoryObject.captionFr",
    type: "text",
    name: "category",
  },
  {
    label: "Action(s)",
    prop: "listIdProductActionObject.id",
    type: "select",
    options: [],
    name: "action",
    rules: {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  },
  {
    label: "Résultat(s)",
    prop: "listIdProductResultObject.id",
    type: "select",
    options: [],
    name: "result",
    rules: {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  },
]);
const handleProductSuggest = async (payload: {
  query: string;
  index: number;
}) => {
  const searchInput = payload.query ?? "";
  const { data } = await service.api.actorProductControllerFindMany({
    skip: 0,
    take: 50,
    "where[name][contains]": searchInput ? `${searchInput}` : "",
    "where[name][mode]": "insensitive",
    "where[id][notIn]": form.value.storyEvents.Product.storyEventInvolves.map(
      (item) => item.anyId.actorProduct.id
    ),
    "where[ids][actif][equals]":true
  });
  productColumns.value[0].suggestions[payload.index] = data.paginatedResult;
};
const handleProductDelete = (payload: any) => {
  form.value.storyEvents.Product.storyEventInvolves.splice(payload.index, 1);
};
// end products management
// begin inPlace Samples management
const inPlaceSwitch = ref(
  form.value.storyEvents.InPlaceSample.storyEventInvolves !== null
);

const inPlaceColumns = ref([
  {
    label: "Echantillon",
    prop: "anyId.packaging.sample.name",
    type: "autoComplete",
    valueKey: "name",
    suggestions: [[]],
    name: "name",
    rules: {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  },
  {
    label: "Qté. remise",
    prop: "anyId.packaging.qty",
    type: "inputNumber",
    name: "qty",
    rules: {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  },
  {
    label: "Qté. restante après remise",
    prop: "anyId.packaging.sample.qteReste",
    type: "text",
    name: "remainingStock",
  },
]);
const handleAddInPlace = async () => {
  form.value.storyEvents.InPlaceSample.storyEventInvolves = [
    ...form.value.storyEvents.InPlaceSample.storyEventInvolves,
    {
      anyId: {
        packaging: {
          qty: 0,
          captionFr: "",
          sample: {
            id: "",
            name: "",
            description: "",
            stockQty: 0,
          },
          listIdPackagingTypeObject: {
            listTypeName_tag: {
              listTypeName: "PackagingType",
              tag: "inPlace",
            },
          },
        },
      },
    },
  ];
  await handleInplaceSuggest({
    index: form.value.storyEvents.InPlaceSample.storyEventInvolves.length - 1,
    query: "",
  });
};

const handleInPlaceInput = (payload: any) => {
  _.set(
    form.value.storyEvents.InPlaceSample.storyEventInvolves[payload.index],
    payload.column,
    payload.value
  );
  if (payload.column === "anyId.packaging.qty") {
    const userStock = props.isEdit ? form.value.ids.creationBy : currentUser.value.id
    const sampleStock = form.value.storyEvents.InPlaceSample.storyEventInvolves[payload.index]
        .anyId.packaging.sample.sampleStocks.find((s) => s.userId === userStock) 
    let remainingStock = 0
    if(sampleStock){
      remainingStock = sampleStock.stockView.userRemainingQty
    }else{
      remainingStock = form.value.storyEvents.InPlaceSample.storyEventInvolves[payload.index]
        .anyId.packaging.sample.stockQty
    }
    if (
      payload.value > remainingStock
    ) {
      form.value.storyEvents.InPlaceSample.storyEventInvolves[
        payload.index
      ].anyId.packaging.sample.qteReste =
        "<span class='rouge'>  La quantité saisie et supérieure à la quantité de stock restante. </span>";
    } else {
      form.value.storyEvents.InPlaceSample.storyEventInvolves[
        payload.index
      ].anyId.packaging.sample.qteReste =
      remainingStock -
        form.value.storyEvents.InPlaceSample.storyEventInvolves[payload.index]
          .anyId.packaging.qty;
    }
  }
};

const handleInplaceSampleSelect = (payload) => {
  _.set(
    form.value.storyEvents.InPlaceSample.storyEventInvolves[payload.index].anyId
      .packaging,
    "sample",
    payload.value
  );
};
const handleInPlaceSwitch = (val: boolean) => {
  if (val) {
    form.value.storyEvents.InPlaceSample.storyEventInvolves = [];
  } else {
    form.value.storyEvents.InPlaceSample.storyEventInvolves = null;
  }
};
const handleInplaceSuggest = async (payload: {
  query: string;
  index: number;
}) => {
  const searchInput = payload.query ?? "";
  const { data } = await service.api.actorSampleControllerFindManyVisitSample("inPlace",{
    skip: 0,
    take: 50,
    "where[name][contains]": searchInput ? `${searchInput}` : "",
    "where[name][mode]": "insensitive",
    "where[id][notIn]":
      form.value.storyEvents.InPlaceSample.storyEventInvolves.map(
        (item) => item.anyId.packaging.sample.id
      ),
    "where[ids][actif][equals]": true
  });
  inPlaceColumns.value[0].suggestions[payload.index] = data.paginatedResult;
};
const handleInPlaceDelete = (payload: any) => {
  form.value.storyEvents.InPlaceSample.storyEventInvolves.splice(
    payload.index,
    1
  );
};

// end inPlace Samples management

// begin toSend Samples management
const toSendColumns = ref([
  {
    label: "Echantillon",
    prop: "anyId.packaging.sample.name",
    type: "autoComplete",
    valueKey: "name",
    suggestions: [[]],
    name: "name",
    rules: {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  },
  {
    label: "Qté. expédiée",
    prop: "anyId.packaging.qty",
    type: "inputNumber",
    name: "qty",
    rules: {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  },
  {
    label: "Adresse d'expédition",
    prop: "anyId.packaging.address.id",
    type: "select",
    options: !form.value.actorIdByObject?.actorObject
      ? [{ captionFr: "Nouvelle adresse", id: "newAdress" }]
      : [
          ...form.value.actorIdByObject.actorObject.addressOfActor
            .filter(
              (adr) => adr?.streetNb || adr?.street || adr?.zipCode || adr?.town
            )
            .map((address) => {
              return {
                captionFr:
                  (address.streetNb || "") +
                  " " +
                  (address.street || "") +
                  " " +
                  (address.zipCode || "") +
                  " " +
                  (address.town || ""),
                id: address.id,
              };
            }),
          { captionFr: "Nouvelle adresse", id: "newAdress" },
        ],

    optionsData: true,
    name: "adrExp",
    rules: {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  },
]);

const toSendSwitch = ref(
  form.value.storyEvents.ToSendSample.storyEventInvolves !== null
);
const handleToSendSwitch = (val: boolean) => {
  if (val) {
    form.value.storyEvents.ToSendSample.storyEventInvolves = [];
  } else {
    form.value.storyEvents.ToSendSample.storyEventInvolves = null;
  }
};
const handleAddExp = async () => {
  form.value.storyEvents.ToSendSample.storyEventInvolves = [
    ...form.value.storyEvents.ToSendSample.storyEventInvolves,
    {
      anyId: {
        packaging: {
          qty: 0,
          captionFr: "",
          sample: {
            id: "",
            name: "",
            description: "",
            stockQty: 0,
          },
          address: null,
          listIdPackagingTypeObject: {
            listTypeName_tag: {
              listTypeName: "PackagingType",
              tag: "ToSend",
            },
          },
        },
      },
    },
  ];
  await handleToSendSuggest({
    index: form.value.storyEvents.ToSendSample.storyEventInvolves.length - 1,
    query: "",
  });
};
const handleToSendInput = (payload: any) => {
  _.set(
    form.value.storyEvents.ToSendSample.storyEventInvolves[payload.index],
    payload.column,
    payload.value
  );
};
const inputs = ref();
const handleSelectAdr = async (payload: any) => {
  if (payload.value === "newAdress") {
    if (form.value.actorIdByObject.actorObject.actorPerson) {
      const resp = await service.api.addressTypeControllerFindOneByType("pds");
      inputs.value = resp.data;
    } else if (
      form.value.actorIdByObject.actorObject.actorCompany
        .listIdActorCompanyTypeObject.tag === "Pharmacy"
    ) {
      const resp = await service.api.addressTypeControllerFindOneByType(
        "depositAddress"
      );
      inputs.value = resp.data;
    } else if (
      form.value.actorIdByObject.actorObject.actorCompany
        .listIdActorCompanyTypeObject.tag === "Entity"
    ) {
      const resp = await service.api.addressTypeControllerFindOneByType(
        "entity"
      );
      inputs.value = resp.data;
    } else if (
      form.value.actorIdByObject.actorObject.actorCompany
        .listIdActorCompanyTypeObject.tag === "Congress"
    ) {
      const resp = await service.api.addressTypeControllerFindOneByType(
        "congress"
      );
      inputs.value = resp.data;
    } else {
      const resp = await service.api.addressTypeControllerFindOneByType(
        "healthCenter"
      );
      inputs.value = resp.data;
    }
    createNewAddress.value.index = payload.index;
    createNewAddress.value.visible = true;
    createNewAddress.value.address = {};
  } else {
    _.set(
      form.value.storyEvents.ToSendSample.storyEventInvolves[payload.index]
        .anyId.packaging,
      "address.id",
      payload.value
    );
  }
};

const handleToSendSampleSelect = (payload) => {
  _.set(
    form.value.storyEvents.ToSendSample.storyEventInvolves[payload.index].anyId
      .packaging,
    "sample",
    payload.value
  );
};

const handleToSendSuggest = async (payload: {
  query: string;
  index: number;
}) => {
  const searchInput = payload.query ?? "";
  const { data } = await service.api.actorSampleControllerFindManyVisitSample("ToSend",{
    skip: 0,
    take: 50,
    "where[name][contains]": searchInput ? `${searchInput}` : "",
    "where[name][mode]": "insensitive",
    "where[ids][actif][equals]": true

  });
  toSendColumns.value[0].suggestions[payload.index] = data.paginatedResult;
};

const handleToSendDelete = (payload: any) => {
  form.value.storyEvents.ToSendSample.storyEventInvolves.splice(
    payload.index,
    1
  );
};
const handleNewAddressUpdate = (payload) => {
  createNewAddress.value.address = payload;
};
const handleValidate = async (valid: boolean) => {
  if (valid) {
    await handleNewAddress();
    createNewAddress.value.submit = false;
  } else {
    createNewAddress.value.submit = false;
  }
};
const handleNewAddress = async () => {
  const address = await createAddress({
    data: {
      ...createNewAddress.value.address,
      addressOfActor: form.value.actorIdByObject.actorObject!.id!,
      listIdUgaObject:undefined,
      listIdUga:form?.value?.listIdUgaObject?.id
    },
  });
  if (address) {
    form.value.actorIdByObject.actorObject.addressOfActor = [
      ...form.value.actorIdByObject.actorObject.addressOfActor,
      address,
    ];
    toSendColumns.value[2].options = [
      ...form.value.actorIdByObject.actorObject.addressOfActor
        .filter(
          (adr) => adr?.streetNb || adr?.street || adr?.zipCode || adr?.town
        )
        .map((address) => {
          return {
            captionFr:
              (address.streetNb || "") +
              " " +
              (address.street || "") +
              " " +
              (address.zipCode || "") +
              " " +
              (address.town || ""),
            id: address.id,
          };
        }),
      { captionFr: "Nouvelle adresse", id: "newAdress" },
    ];
    _.set(
      form.value.storyEvents.ToSendSample.storyEventInvolves[
        createNewAddress.value.index
      ].anyId.packaging,
      "address.id",
      address.id
    );
    createNewAddress.value.visible = false;
    Components.ElNotification.success({
      message: "Opération effectuée avec succès",
      type: "success",
      position: "bottom-right",
      offset: 60,
      duration: 2000,
      customClass: "success-notif",
    });
  }
};

// end toSend Samples management

// begin contacct management

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
  actorList.value = data.paginatedResult;
};
const queryAttendant = async (queryString: string) => {
  const { data } = await service.api.userControllerFindMany({
    skip: 0,
    take: 20,
    "where[OR][0][firstName][contains]": queryString ? `${queryString}` : "",
    "where[OR][0][firstName][mode]": "insensitive",
    "where[OR][1][lastName][contains]": queryString ? `${queryString}` : "",
    "where[OR][1][lastName][mode]": "insensitive",
  });
  attendants.value = data.paginatedResult.map((user) => ({
    anyIdId: user.id,
    anyId: {
      user: {
        id: user.id,
        firstName: user.firstName,
      },
    },
  }));
};

const handleSelectClient = (item: any) => {
  contactSearch.value = item.actorObject.actorName;
  form.value.storyEvents.ContactReplacement.storyEventInvolves[0].anyId.substitute.id =
    "";
  form.value.actorIdByObject = item;

  if (item) {
    if(item?.actorObject?.listIdInitialValueObject?.id){
      form.value.storyEvents.Order.listIdEventTypeValueObject.id = item.actorObject.listIdInitialValueObject.id;
    }
    toSendColumns.value[2].options =
      item?.actorObject?.addressOfActor.length < 5
        ? [
            ...item?.actorObject?.addressOfActor
              .filter(
                (adr) =>
                  adr?.streetNb || adr?.street || adr?.zipCode || adr?.town
              )
              .map((address) => {
                return {
                  captionFr:
                    (address.streetNb || "") +
                    " " +
                    (address.street || "") +
                    " " +
                    (address.zipCode || "") +
                    " " +
                    (address.town || ""),
                  id: address.id,
                };
              }),
            { captionFr: "Nouvelle adresse", id: "newAdress" },
          ]
        : item?.actorObject?.addressOfActor
            .filter(
              (adr) => adr?.streetNb || adr?.street || adr?.zipCode || adr?.town
            )
            .map((address) => {
              return {
                captionFr:
                  (address.streetNb || "") +
                  " " +
                  (address.street || "") +
                  " " +
                  (address.zipCode || "") +
                  " " +
                  (address.town || ""),
                id: address.id,
              };
            });
  }
};
const contactSearch = ref("");

// end contact management
const handleTagClose = (tag: any) => {
  form.value.storyEvents.ContactAttendant.storyEventInvolves =
    form.value.storyEvents.ContactAttendant.storyEventInvolves.filter(
      (acc) => acc.anyId.user.id !== tag.anyId.user.id
    );
};

const handleDocumentAdd = () => {
  form.value.documents = [
    ...form.value.documents,
    {
      name: "Document",
    },
  ];
};
const handleDocumentDelete = (payload: any) => {
  form.value.documents.splice(payload.index, 1);
};
// begin substitution management
const handleNewSubstitute = async (payload) => {
  const subs = payload.map((sub) => {
    return {
      id: sub.id ?? undefined,
      substitute: sub.subId
        ? {
            id: sub.subId,
          }
        : undefined,
      firstName: sub.firstName,
      lastName: sub.lastName,
      rpps: sub.rpps,
      substituted: {
        id: form.value.actorIdByObject.id,
      },
    };
  });
  const resp = await service.api.substituteControllerCreateMany(
    form.value.actorIdByObject.actorObject.id,
    subs
  );
  if (resp?.data?.length) {
    Components.ElNotification.success({
      message: "Opération effectuée avec succès",
      type: "success",
      position: "bottom-right",
      offset: 60,
      duration: 2000,
      customClass: "success-notif",
    });
  }
  createNewSubstitute.value.submit = false;
  form.value.actorIdByObject.actorObject.substituteds = [...(resp.data ?? [])];
  createNewSubstitute.value.submit = false;
  const oldExist = resp.data
    ?.map((e) => e.id)
    .indexOf(createNewSubstitute.value.old);
  if (oldExist === -1) {
    form.value.storyEvents.ContactReplacement.storyEventInvolves[0].anyId.substitute.id =
      "";
  } else {
    form.value.storyEvents.ContactReplacement.storyEventInvolves[0].anyId.substitute.id =
      createNewSubstitute.value.old;
  }
  createNewSubstitute.value.visible = false;
};
const attendants = ref([]);
const handleCourseSwitch = (val: boolean) => {
  form.value.storyEvents.Course.listIdEventTypeValueObject = { id: "" };
  form.value.storyEvents.Course.eventDate = null;
};
const documentsColumns = [
  { label: "Document(s) remi(s)", prop: "name", type: "text" },
];

const handleSelectRemplacant = (value) => {
  if (value === "newRemplacant") {
    createNewSubstitute.value.visible = true;
  } else {
    createNewSubstitute.value.old = value;
  }
};

onMounted(async () => {
  if (props.payload && props.payload.actor) {
    const { data } = await service.api.actorControllerFindManyView({
      take: 1,
      skip: 0,
      "where[actorObject][id]": props.payload.actor,
    });
    handleSelectClient(data.paginatedResult[0]);
  }
  //contactSearch.value = form.value.actorIdByObject.actorObject.actorName;

  const resp: any =
    await service.api.webElementJListFilterControllerGetListByPageName(
      "VisitForm"
    );
  lists.value = resp.data;
  productColumns.value[3].options = resp.data.ProductActions;
  productColumns.value[4].options = resp.data.ProductResults;

  if (props.payload?.type !== 'appointmentToStory') {
    lists.value.EventType.map((e) => {
    form.value.storyEvents[e.tag].listIdEventTypeObject.id = e.id;
      });
  }

  if (props.isEdit && props.payload?.type !== 'appointmentToStory') {
    await getStoryById(id);
    actorList.value = [story.value.actorIdByObject.actorView];
    contactSearch.value =
      story.value.actorIdByObject.actorView.actorObject.actorName;
    const actor = story.value.actorIdByObject.actorView;
    const storyEvents = story.value.storyEvents.reduce((obj, item) => {
      const key = item.listIdEventTypeObject.tag;
      obj[key] =
      key === "ContactAttendant"
          ? item.storyEventInvolves &&
            item.storyEventInvolves.length === 0 
            ? item
            : {
                ...item,
                storyEventInvolves: item.storyEventInvolves.map((e)=> ({...e,anyIdId: e?.anyId?.user?.id}))
              }:

        key === "ContactReplacement"
          ? item.storyEventInvolves &&
            item.storyEventInvolves.length &&
            item.storyEventInvolves[0].anyId &&
            item.storyEventInvolves[0].anyId.substitute
            ? item
            : {
                ...item,
                storyEventInvolves: [
                  {
                    anyId: {
                      substitute: {
                        id: "",
                      },
                    },
                  },
                ],
              }
          : key === "Visit"
          ? item.address
            ? item
            : { ...item, address: { id: null } }
          : key === "Order" || key === "Delivery"
          ? {
              ...item,
              listIdEventTypeValueObject: item.listIdEventTypeValueObject ?? {
                id: "",
              },
            }
          : key === "NextVisit"
          ? item.storyEventInvolves &&
            item.storyEventInvolves[0] &&
            item.storyEventInvolves[0].anyId
            ? item
            : {
                ...item,
                storyEventInvolves: [
                  {
                    id:
                      item.storyEventInvolves && item.storyEventInvolves[0]
                        ? item.storyEventInvolves[0].id
                        : "",
                    anyId: {
                      story: {
                        aboutAny: "Appointment",
                        description: "",
                        startDate: null,
                        startTime: null,
                        endDate: null,
                        endTime: null,
                        storyEvents: [
                          {
                            listIdEventTypeObject: {
                              id: "3049",
                            },
                            description: "",
                          },
                          {
                            listIdEventTypeObject: {
                              id: "3048",
                            },
                            listIdEventTypeValueObject: {
                              id: "3018",
                            },
                          },

                          {
                            listIdEventTypeObject: {
                              id: "3047",
                            },
                            description: "",
                          },
                        ],
                      },
                    },
                  },
                ],
              }
          : item;

      return obj;
    }, {});
    form.value = _.cloneDeep({
      ...story.value,
      storyEvents,
      actorIdByObject: actor,
    });
    toSendColumns.value[2].options =
      form.value.actorIdByObject.actorObject.addressOfActor.length < 5
        ? [
            ...form.value.actorIdByObject.actorObject.addressOfActor
              .filter(
                (adr) =>
                  adr?.streetNb || adr?.street || adr?.zipCode || adr?.town
              )
              .map((address) => {
                return {
                  captionFr:
                    (address.streetNb || "") +
                    " " +
                    (address.street || "") +
                    " " +
                    (address.zipCode || "") +
                    " " +
                    (address.town || ""),
                  id: address.id,
                };
              }),
            { captionFr: "Nouvelle adresse", id: "newAdress" },
          ]
        : form.value.actorIdByObject.actorObject.addressOfActor
            .filter(
              (adr) => adr?.streetNb || adr?.street || adr?.zipCode || adr?.town
            )
            .map((address) => {
              return {
                captionFr:
                  (address.streetNb || "") +
                  " " +
                  (address.street || "") +
                  " " +
                  (address.zipCode || "") +
                  " " +
                  (address.town || ""),
                id: address.id,
              };
            });
    inPlaceSwitch.value =
      form.value.storyEvents.InPlaceSample.storyEventInvolves.length !== 0;
    toSendSwitch.value =
      form.value.storyEvents.ToSendSample.storyEventInvolves.length !== 0;
    courseSwitch.value = form.value.storyEvents.Course
      .listIdEventTypeValueObject
      ? true
      : false;
    form.value.storyEvents.InPlaceSample.storyEventInvolves =
      form.value.storyEvents.InPlaceSample.storyEventInvolves.map((item) => {

        const userStock = form.value.ids.creationBy 
        const sampleStock = item.anyId.packaging.sample.sampleStocks.find((s) => s.userId === userStock) 
        let remainingStock = 0
        if(sampleStock){
          remainingStock = sampleStock.stockView.userRemainingQty
        }else{
          remainingStock = item.anyId.packaging.sample.stockQty
        }
        return {
          ...item,
          anyId: {
            packaging: {
              ...item.anyId.packaging,
              sample: {
                ...item.anyId.packaging.sample,
                qteReste: remainingStock,
                sampleStocks: sampleStock ? [
                  {
                    ...sampleStock,
                    stockView: {
                      ...sampleStock.stockView,
                      userRemainingQty: remainingStock + item.anyId.packaging.qty
                    }
                  }
                ] : [],
                stockQty:
                  remainingStock +
                  item.anyId.packaging.qty,

              },
            },
          },
        };
      });
  }
  await querySearch("");
  await queryAttendant("");
  await fetchProducts({ take: 50, skip: 0 });
});

const handleSubmitForm = async () => {
  form.value.storyEvents.ToSendSample.storyEventInvolves =
    form.value.storyEvents.ToSendSample.storyEventInvolves?.filter(
      (item) => item.anyId.packaging?.sample?.id?.length
    );
  form.value.storyEvents.InPlaceSample.storyEventInvolves =
    form.value.storyEvents.InPlaceSample.storyEventInvolves?.filter(
      (item) => item.anyId.packaging?.sample?.id?.length
    );
  const data = {
    aboutAny: form.value.aboutAny,
    startDate: form.value.startDate,
    startTime: form.value.startTime,
    actorIdByObject: { id: form.value.actorIdByObject!.id },
    storyEvents: Object.values(form.value.storyEvents),
    listIdDurationObject: form.value.listIdDurationObject,
  };
  if(props.payload && props.payload.type === 'appointmentToStory'){
    const formData = {
      ...form.value,
      actorIdByObject: { id: form.value.actorIdByObject?.actorObject?.id },
      storyEvents: Object.values(form.value.storyEvents),

    }

    const result = await appointmentToStory({ id, data:formData });
    if(props.payload && props.payload.type ==='appointmentToStory') {
      setModal('')
      showNewAppointment(result)
    }
  }
  else if (!props.isEdit) {
    const res = await createStory({ data });
    if(props.payload && props.payload.type ==='agenda'){
      showNewAppointment(res)
    }
  } else {
    const result = await editStory({ id, data });
    if(props.payload && props.payload.type ==='appointmentToStory') {
      setModal('')
      showNewAppointment(result)
    }
  }
};

const onSubmit = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    let inPlaceValidation = true;
    let toSendValidation = true;
    let productValidation = true;
    if (
      form.value.storyEvents.Product.storyEventInvolves &&
      form.value.storyEvents.Product.storyEventInvolves.length
    ) {
      productValidation = await inputTableProductRef.value?.validateForm();
    }
    if (
      form.value.storyEvents.InPlaceSample.storyEventInvolves &&
      form.value.storyEvents.InPlaceSample.storyEventInvolves.length
    ) {
      inPlaceValidation = await inputTableInPlaceRef.value?.validateForm();
    }
    if (
      form.value.storyEvents.ToSendSample.storyEventInvolves &&
      form.value.storyEvents.ToSendSample.storyEventInvolves.length
    ) {
      toSendValidation = await inputTableToSendRef.value?.validateForm();
    }
    if (valid && productValidation && inPlaceValidation && toSendValidation) {
      await handleSubmitForm();
      if (!!error.value) {
        Components.ElMessage.error(error.value?.message);
        console.log(error, "error");
      } else {
        Components.ElNotification.success({
          message: "Opération effectuée avec succès !",
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
const actorAdresses = computed(() => {
  return form.value.actorIdByObject?.actorObject?.addressOfActor?.filter(
    (address) =>
      address.streetNb && address.street && address.zipCode && address.town
  );
});
const disabledDate = (time: Date) => {
  if (props.isEdit) {
    return time.getTime() > Date.parse(form.value.startDate);
  }
  return time.getTime() > Date.now();
};
const rules = ref({
  "actorIdByObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  startDate: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.value.startDate) {
          callback();
        } else {
          callback("Ce champ est requis");
        }
      },
    },
  ],
  startTime: [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "blur",
    },
  ],
  "storyEvents.VisitType.listIdEventTypeValueObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "storyEvents.Visit.listIdEventTypeValueObject.id": [
    {
      required: true,
      message: `${t("entityForm.validation.required")}`,
      trigger: "change",
    },
  ],
  "storyEvents.NextVisit.storyEventInvolves[0].anyId.story.startTime": [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (
          !form.value.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
            .endTime
        ) {
          callback();
        }
        const valid = validateDates(
          "2023-11-23",
          form.value.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
            .startTime,
          "2023-11-23",
          form.value.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
            .endTime
        );
        if (valid) {
          ruleFormRef.value?.clearValidate([
            "storyEvents.NextVisit.storyEventInvolves[0].anyId.story.startTime",
            "storyEvents.NextVisit.storyEventInvolves[0].anyId.story.endTime",
          ]);
          callback();
        } else {
          callback(new Error("Veuillez vérifier l'heure"));
        }
      },
      trigger: ["blur", "change"],
    },
  ],
  "storyEvents.NextVisit.storyEventInvolves[0].anyId.story.endTime": [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (
          !form.value.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
            .startTime ||
          !form.value.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
            .endTime
        ) {
          callback();
        }

        const valid = validateDates(
          "2023-11-23",
          form.value.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
            .startTime,
          "2023-11-23",
          form.value.storyEvents.NextVisit.storyEventInvolves[0].anyId.story
            .endTime
        );
        if (valid) {
          ruleFormRef.value?.clearValidate([
            "storyEvents.NextVisit.storyEventInvolves[0].anyId.story.startTime",
            "storyEvents.NextVisit.storyEventInvolves[0].anyId.story.endTime",
          ]);
          callback();
        } else {
          callback(new Error("Veuillez vérifier l'heure"));
        }
      },
      trigger: ["blur", "change"],
    },
  ],
});
</script>
<style lang="scss" scoped>
.visit-form__contact {
  max-height: 550px;
}
label {
  font-size: 12px;
  font-weight: 700;
  color: $gris-fonce;
}
:deep(.is-disabled) {
  background-color: rgba($violet-fonce, 0.4);
  border-color: rgba($violet-fonce, 0.4);
}
:deep(.el-divider--horizontal) {
  border-top: 1px solid $gris-clair;
}
.visit-form__ {
  &contact {
    background: $gris-clair;
    border-radius: 10px;
  }
  &contact-info {
    width: 40%;
  }
  &contact-map {
    width: 60%;
    object-fit: cover;
  }
  &footer {
    padding: 33px;
    background: rgb(255, 255, 255);
    box-shadow: 0px -4px 8px 0px rgba(199, 199, 204, 0.28);
    word-break: keep-all;
  }
  &divider {
    border-top: 1px solid $gris-fonce;
  }
}
.map-img {
  object-fit: cover;
}

:deep(.el-button) {
  margin: 0 !important;
}

:deep(.el-tag) {
  color: white;
}
:deep(.el-tag__close) {
  color: white;
}
:deep(.el-select-tags-wrapper) {
  display: none !important;
}

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

:deep(.el-input__inner) {
  padding-left: 11px !important;
}
:deep(.el-dialog__header) {
  display: none;
}
:deep(.el-dialog__body) {
  word-break: normal;
  padding: 0;
}
:deep(.el-dialog__headerbtn) {
  display: none;
}
:deep(.el-dialog) {
  --el-dialog-margin-top: 5vh !important;
}
.appointment-close {
  margin-left: -15px !important;
}
.form {
  background: #f4f4f6;
}
</style>
<style lang="scss">
.date-picker__container .el-input {
  --el-input-border-color: none !important;
  --el-input-hover-border-color: none !important;
  --el-input-focus-border-color: none !important;
}

.custom-remote.el-select::after {
  content: "";
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-image: url("/svg/icons/search-1.svg");
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 1;
}
</style>
