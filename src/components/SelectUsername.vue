<script>
import { ref } from "vue";
export default {
  name: "SelectUsername",
  emits: ["submit"],
  data() {
    return {
      username: ref(""),
    };
  },
  computed: {
    isValid() {
      return this.username.length >= 4;
    },
  },
  methods: {
    onSubmit() {
      console.log(this.username)
      this.$emit("submit", this.username);
    },
  },
};
</script>
<template>
  <div class="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
    <div class="row gx-lg-5 align-items-center mb-5 justify-content-center">
      <div class="col-lg-6 mb-5 mb-lg-0 position-relative">
        <div class="card bg-glass">
          <div class="card-body px-4 py-5 px-md-5 shadow">
            <form @submit.prevent="onSubmit">
              <h1 style="color: green; text-align: center; margin-top:-5% ;">LOGIN</h1>
              <hr>
              <!-- Email input -->
              <div class="form-outline mb-4">
                <input v-model="username" class="form-control" placeholder="Username..." />
              </div>
              <!-- Submit button -->
              <div class="text-center" style=" margin-bottom: -5%;">
                <button type="submit" class="btn btn-primary btn-block mb-3" style="width:60%;" :disabled="!isValid">
                  LOG IN
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.bg-glass {
  background-color: hsla(0, 0%, 100%, 0.9) !important;
  backdrop-filter: saturate(200%) blur(25px);
}
</style>
