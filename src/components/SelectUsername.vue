<script>
export default {
    name: "SelectUsername",
    data() {
        return {
            username: "",
        };
    },
    computed: {
        isValid() {
            return this.username.length > 4;
        }
    },
    method: {
        onSubmit() {
            this.$emit("input", this.username)
        }
    }
};
</script>

<template>
    <div class="select-username">
        <form action="">
            <input type="text">
            <button :disabled="!isValid">Send</button>
        </form>
    </div>
</template>


<style scoped>
.select-username {
    width: 300px;
    margin: 200px auto 0;
}
</style>
