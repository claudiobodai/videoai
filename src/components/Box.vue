<template>
    <div class="box">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Box'
}
</script>

<style scoped>

.box {
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
    margin: 1rem 0;
}

</style>