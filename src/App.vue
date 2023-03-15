<template>
  <v-app>
      <NavViewer/>
      <CesiumViewer/>
  </v-app>
</template>

<script>
import NavViewer from './components/NavViewer.vue'
import CesiumViewer from './components/CesiumViewer.vue'

export default {
  name: 'App',

  components: {
    CesiumViewer,
    NavViewer
  },

  data: () => ({
    //
  }),
}
</script>

<style>
@import "@/assets/css/reset.css";

#app{
  width: 100vw;
  height: 100vh;
}

</style>
