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
    <v-btn @click="addPin" style="margin: 10px 0; width: 150px">Add Pin</v-btn>
    <v-btn @click="currentLocation" style="margin: 10px 0; width: 150px"
      >currentLocation</v-btn
    >
    <ul>
      <li v-for="list in pinList" :key="list.id">{{ list.addr }}</li>
    </ul>
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

let idx = 0;
let pinList = [];

export default {
  data: () => ({
    return: {
      lon: "",
      lat: "",
      hei: "",
      pinList: [],
    },
  }),
  methods: {
    // 위도 경도 거리 공식
    // p1.x : lon p1.y : lat
    /* distance(p1, p2) {
      return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }, */

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
      console.log(pinList);
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
      // 현 위치 경도 위도
      var cartographic = new Cesium.Rectangle(0, 0, 0, 0);
      viewer.camera.computeViewRectangle(Cesium.Ellipsoid.WGS84, cartographic);
      var west = Number(Cesium.Math.toDegrees(cartographic.west));
      var south = Number(Cesium.Math.toDegrees(cartographic.south));
      var east = Number(Cesium.Math.toDegrees(cartographic.east));
      var north = Number(Cesium.Math.toDegrees(cartographic.north));
      lon = (east - west) / 2 + west;
      lat = (north - south) / 2 + south;

      var url = `${baseUrl}${lat},${lon}?key=${bingMap_API_KEY}`; //bingmap url

      var addr = "";

      // 지역명 불러오기
      await this.$axios.get(url, {}).then((res) => {
        console.log(res.data);
        addr =
          res.data.resourceSets[0].resources[0].businessesAtLocation[0]
            .businessAddress.formattedAddress;
      });

      // 핀 표시
      const pinBuilder = new Cesium.PinBuilder();
      const locationPin = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(lon, lat, 20),
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

      // pinList에 값 저장하는 로직
      pinList.push({ id: idx++, lon: lon, lat: lat, addr: addr });
    },
  },
  mounted() {
    this.initViewer();

    viewer = this.getViewer();

    viewer.camera.flyTo({
      destination: new Cesium.Cartesian3.fromDegrees(lon, lat, hei),
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
  width: 250px;
  height: auto;
  text-align: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.locationSearch input {
  width: 150px;
  padding: 10px;
  margin: 10px 0;
  height: 30px;
  background: #efefef;
  border-radius: 5px;
}
</style>