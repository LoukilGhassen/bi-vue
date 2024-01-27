<template>
  <div class="d-flex flex-column legal-mention__container">
    <div class="legal-mention__articles">
      <div v-for="article in [1, 2, 3, 4, 6]" :key="article" class="mt-5">
        <div class="noir fw-boldest fs-4 pb-7">Article {{ article }}</div>
        <div>
          Fusce accumsan et odio quis porta. Sed vitae nisi placerat, auctor
          dolor quis, sagittis nibh. Morbi rutrum dolor eu erat volutpat, in
          ultrices sapien tincidunt. Fusce ornare mollis mauris, sagittis rutrum
          mi elementum eget. Duis hendrerit feugiat dui a varius. Curabitur
          sapien est, rhoncus eu lorem a, egestas semper leo. Proin nec leo
          porta dolor molestie interdum. In hac habitasse platea dictumst.
          Integer sit amet tortor et quam ornare porta. Nullam ligula libero,
          semper vitae ipsum dapibus, dapibus tempus quam. Maecenas nec placerat
          dui. Proin bibendum, dui lobortis venenatis elementum, turpis ipsum
          semper neque, sit amet dictum mi ante nec lacus. Nulla non diam non
          tortor posuere consequat.
        </div>
      </div>
    </div>
    <div class="legal-mention__footer ">
      <div class=" d-flex justify-content-between align-items-center gap-5" >
        <div class="fw-boldest noir">
          J’ai lu et j’accepte les conditions générales d’utilisation, la
          politique de confidentialité ainsi que les mentions légales
        </div>
        <div class="ms-5 d-flex  justify-content-center align-items-end gap-9">
          <el-button size="large" type="primary" class="fw-bolder me-2 confirm-btn" @click="handleAcceptClick">
            J'accepte
          </el-button>

        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const emit = defineEmits(['accept'])
const handleAcceptClick = () => {
    emit('accept')
}
</script>
<style scoped lang="scss">
.legal-mention__ {
  &container {
    height: 90%;
  }
  &articles {
    overflow-y: scroll;
    flex: 1;
    padding : 0px 33px 5px;
  }
  &footer {
    width:100%;
    padding:33px;
    background:rgb(255, 255, 255);
    box-shadow: 0px -4px 8px 0px rgba(199, 199, 204, 0.28);
    word-break: keep-all;

  }
}
.cancel-btn{
    color:$violet-hover;
    white-space:nowrap;
    cursor:pointer;
}
.confirm-btn{
    background:$violet-hover;
}
</style>