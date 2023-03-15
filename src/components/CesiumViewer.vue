<template>
  <div id="cesiumContainer"></div>
  <div class="locationSearch">
    <form @submit.prevent="doSearch">
      <input type="text" id="lon-ipt" placeholder="lon" v-model.number="lon" />
      <input type="text" id="lat-ipt" placeholder="lat" v-model.number="lat" />
      <input type="text" id="hei-ipt" placeholder="hei" v-model.number="hei" />
      <button
        style="
          background: white;
          width: 120px;
          height: 30px;
          border-radius: 5px;
        "
      >
        Search
      </button>
    </form>
  </div>
</template>

<script>
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { mapActions, mapGetters } from "vuex";

let lon = -3137726.630123387;
let lat = 4145092.0695943628;
let hei = 3705541.040338162;

export default {
  data: () => ({
    return: {
      lon: "",
      lat: "",
      hei: "",
    },
  }),
  methods: {
    ...mapGetters("MapViewer", ["getViewer"]),
    ...mapActions("MapViewer", ["initViewer"]),
    doSearch() {
      lon = this.lon;
      lat = this.lat;
      hei = this.hei;
      console.log(lon);
      const viewer = this.getViewer();
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(lon, lat, hei),
      });
    },
  },
  mounted() {
    this.initViewer();

    const viewer = this.getViewer();
    viewer.camera.flyTo({
      destination: new Cesium.Cartesian3(lon, lat, hei),
    });
  },
};
</script>

<style>
#cesiumContainer {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  width: 100vw;
  height: 100vh;
}

.locationSearch {
  z-index: 999;
  width: 150px;
  height: auto;
  text-align: center;
}

.locationSearch input {
  width: 120px;
  padding: 10px;
  margin: 10px 0;
  height: 30px;
  background: #efefef;
  border-radius: 5px;
}
</style>