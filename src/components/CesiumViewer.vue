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
          margin: 10px 0;
        "
      >
        Search
      </button>
    </form>
    <v-btn @click="addPin">Add Pin</v-btn>
    <v-btn @click="currentLocation">currentLocation</v-btn>
  </div>
</template>

<script>
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { mapActions, mapGetters } from "vuex";

let lon = -75.1641667;
let lat = 39.9522222;
let hei = 150000;

const bingMap_API_KEY =
  "Aldlfozb7-8u1K5JFcNQpmiKm4vgfbjbLJox8PianHxmj_B_74Y5w5P3d_6SSgO_";
var baseUrl = "http://dev.virtualearth.net/REST/v1/locationrecog/";

let viewer;

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

    // 현위치
    currentLocation() {
      var cartographic = new Cesium.Rectangle(0, 0, 0, 0);
      viewer.camera.computeViewRectangle(Cesium.Ellipsoid.WGS84, cartographic);
      var west = Number(Cesium.Math.toDegrees(cartographic.west));
      var south = Number(Cesium.Math.toDegrees(cartographic.south));
      var east = Number(Cesium.Math.toDegrees(cartographic.east));
      var north = Number(Cesium.Math.toDegrees(cartographic.north));
      lon = (east - west) / 2 + west;
      lat = (north - south) / 2 + south;
      console.log("위도 : " + lat);
      console.log("경도 : " + lon);
    },

    // 위치 찾기
    doSearch() {
      lon = this.lon;
      lat = this.lat;
      hei = this.hei;
      console.log(lon);
      viewer.camera.flyTo({
        destination: new Cesium.Cartesian3.fromDegrees(lon, lat, hei),
      });
    },

    //Add pin
    async addPin() {
      var cartographic = new Cesium.Rectangle(0, 0, 0, 0);
      viewer.camera.computeViewRectangle(Cesium.Ellipsoid.WGS84, cartographic);
      var west = Number(Cesium.Math.toDegrees(cartographic.west));
      var south = Number(Cesium.Math.toDegrees(cartographic.south));
      var east = Number(Cesium.Math.toDegrees(cartographic.east));
      var north = Number(Cesium.Math.toDegrees(cartographic.north));
      lon = (east - west) / 2 + west;
      lat = (north - south) / 2 + south;
      hei = cartographic.height;

      var url = `${baseUrl}${lat},${lon}?key=${bingMap_API_KEY}`; //bingmap url

      var addr = "";

      // 지역명 불러오는 로직 구현
      await this.$axios.get(url, {}).then((res) => {
        addr = res.data.resourceSets[0].resources[0].businessesAtLocation[0].businessAddress.formattedAddress;
      });

      const pinBuilder = new Cesium.PinBuilder();
      const locationPin = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat),
        label: {
          text: `${addr}`,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
        },
        billboard: {
          image: pinBuilder.fromText("o", Cesium.Color.BLUE, 50).toDataURL(),
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        },
      });
      Promise.all([locationPin]).then(function (pins) {
        viewer.zoomTo(pins);
      });
    },
  },
  mounted() {
    this.initViewer();

    viewer = this.getViewer();

    viewer.camera.flyTo({
      destination: new Cesium.Cartesian3.fromDegrees(lon, lat, hei),
      label: {
        text: "Philadelphia",
      },
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