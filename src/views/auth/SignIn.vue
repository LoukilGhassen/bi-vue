<template>
  <div
    class="d-flex align-items-center justify-content-center"
    style="height: 100vh"
  >
    <!--Illustration
    <div class="d-flex bg-login">
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-500px mb-xl-10 test3 w-25"
        style="
          background-image: url('/svg/authentication/login-geolocation-icon.svg');
          z-index: 1;
          position: absolute;
          bottom: 0%;
          left: 0%;
        "
      ></div>
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-500px mb-xl-10 test3 w-25"
        style="
          background-image: url('/svg/authentication/login-community-icon.svg');
          position: absolute;
          bottom: 0%;
          right: 0%;
          z-index: -1;
        "
      ></div>
      <div
        class="bgi-no-repeat bgi-position-x-end bgi-size bgi-position-y-bottom min-h-200px min-h-xl-400px mb-xl-10 test4"
        style="
          background-image: url('/svg/authentication/login-polygon-icon.svg');
          position: absolute;
          bottom: 0;
          width: 22%;
          left: 60%;
          z-index: -1;
        "
      ></div>
      <div
        class="bgi-no-repeat bgi-position-x-center bgi-size bgi-position-center min-h-200px min-h-xl-600px mb-xl-10 test3 square2"
        style="
          background-image: url('/svg/authentication/login-ellipse-icon.svg');
          position: absolute;
          bottom: 0%;
          left: 14%;
          width: 45%;
          z-index: -2;
        "
      ></div>
    </div>
    -->
    <!-- end Illustration-->
    <div class="w-lg-500px mb-10 mb-lg-3 mx-auto d-flex flex-column">
      <img alt="Logo" src="/svg/logos/logo.svg" class="h-60px mb-lg-20" />
      <el-form ref="formRef" class="form" :model="form" :rules="rules">
        <el-card class="card">
          <div class="card-body p-lg-9">
            <h1 class="d-flex justify-content-center fw-bolder">
              {{ t("login.title") }}
            </h1>
            <div class="mt-lg-10">
              <el-form-item prop="email">
                <label class="form-label fw-bolder text-gray-900 fs-6">
                  {{ t("email") }}</label
                >
                <el-input
                  size="large"
                  type="email"
                  v-model="form.email"
                  data-test="signInFormEmail"
                />
              </el-form-item>
            </div>
            <div class="mt-lg-8">
              <div class="row justify-content-between form-label">
                <div class="col-6 text-start fw-bolder text-gray-900 fs-6">
                  {{ t("password") }}
                </div>
                <div class="col-6 text-end">
                  <router-link
                    data-test="signInFormForgotPasswordLink"
                    :to="{ name: 'email-reset-password' }"
                    >{{ t("forgotPassword") }} ?</router-link
                  >
                </div>
              </div>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  size="large"
                  v-model="form.password"
                  data-test="signInFormPassword"
                  show-password
                />
              </el-form-item>
              <div class="menu-content" v-if="false">
                <label
                  class="form-check form-switch form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input w-30px h-20px"
                    type="checkbox"
                    value="1"
                    name="notifications"
                    v-model="form.rememberMe"
                  />
                  <span class="form-check-label text-muted fs-7">
                    Remember Me
                  </span>
                </label>
              </div>
            </div>
            <div class="mt-lg-10 d-grid">
              <el-button
                data-test="signInSubmitButton"
                @click="onSubmit(formRef)"
                :loading="isLoading"
                type="primary"
                size="large"
                class="btn-lg mt-2"
                >{{ t("signIn") }}</el-button
              >
            </div>
          </div>
          <div class="d-flex justify-content-center">
            <h4>
              {{ t("login.newHere") }}?
              <span @click="sendEmailModal = true" class="cursor-pointer text-decoration-underline"
                >Contacter l'administrateur</span
              >
            </h4>
          </div>
        </el-card>
        <SendEmailModal
          :showModal="sendEmailModal"
          @close-modal="closeModal"
          :payload="{ title: 'Contacter l’administrateur', type: 'adminContact' }"
          @approve-modal="confirm"
        />
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import { Components } from "@tekab-dev-team/storybook-devfactory";
import { t } from "@/core/i18n/translate";
import { useAuthStore } from "@/store/useAuth";
import { ref, defineComponent } from "vue";
import SendEmailModal from "@/components/modals/SendEmailModal.vue";
import type { ElForm } from "element-plus";
import service from "@/service";

let failMessage: string | null;

export default defineComponent({
  name: "sign-in",
  components: { SendEmailModal },
  setup() {
    failMessage = t("messages.loginFailed");
    const authStore = useAuthStore();
    const sendEmailModal = ref(false);

    const isLoading = ref<boolean>(false);
    const form = ref({ email: "", password: "", rememberMe: false });
    const formRef = ref<InstanceType<typeof ElForm>>();
    const rules = ref({
      email: [
        {
          required: true,
          message: t("entityForm.validation.required"),
          trigger: "blur",
        },
        {
          type: "email",
          message: "Ladresse e-mail est invalide",
          trigger: ["blur", "change"],
        },
      ],
      password: [
        {
          required: true,
          message: t("entityForm.validation.required"),
          trigger: "blur",
        },
      ],
    });

    const login = async () => {
      isLoading.value = true;
      try {
        await authStore.login(
          form.value.email,
          form.value.password,
          form.value.rememberMe
        );
        isLoading.value = false;
      } catch (error) {
        Components.ElMessage.error(failMessage);
        isLoading.value = false;
      }
    };
    const closeModal = () => {
      sendEmailModal.value = false;
    };
    const onSubmit = async (
      formEl: InstanceType<typeof ElForm> | undefined
    ) => {
      if (!formEl) return;
      formEl.validate(async (valid) => {
        if (valid) {
          await login();
        } else {
          console.log("error submit!");
          return false;
        }
      });
    };

    const confirm = async (val) => {
      await service.api.authControllerContactAdmin(val._value);
    };
    return {
      t,
      form,
      onSubmit,
      isLoading,
      rules,
      formRef,
      sendEmailModal,
      closeModal,
      confirm,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-input {
  background-color: #e9ecef;
}
:deep(.el-input__inner) {
  width: 100%;
}
@media (max-width: 1200px) {
  .bg-login {
    display: none !important;
  }
}
.logo {
  cursor: pointer;
}

.line {
  border-top: 1px solid #7239ea;
  width: 45%;
}
</style>
