<template>
    <div class="card">
        <h3> {{ title }}</h3>
        <p>{{ description }}</p>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        title: { type: String, required: true },
        description: { type: String, required: true }
    }
}
</script>

<style scoped>

.card {
    border: 1px solid #ddd;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem;
}



</style>