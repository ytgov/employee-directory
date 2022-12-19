<template>

    <div class="d-flex wrap ml-3 align-center">
        <h4 class="mr-3 mt-1">Grouped by their:</h4>
        <div class="d-md-flex chips">
            <v-chip v-if="search" class="ma-2 px-8" label outlined color="#00616D">All Employees</v-chip>
            <v-chip v-if="search" class="ma-2 px-8" label outlined color="#00616D">Department</v-chip>
            <v-chip class="ma-2 px-8" label outlined color="#00616D">Location</v-chip>
            <v-chip class="ma-2 px-8" label outlined color="#00616D">Position</v-chip>
        </div>
    </div>

</template>

<script>
export default {
    props: ['search']
}
</script>

<style>

</style>