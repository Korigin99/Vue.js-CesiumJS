import * as Cesium from "cesium";


const MapViewer = {
  namespaced: true,
  state: {
    viewer: null,
  },
  getters: {
    getViewer: (state) => (state.viewer),
  },
  mutations: {
    initViewer: (state) => {
      window.CESIUM_BASE_URL = "/";
      Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzMDAxZmQ2OC1jYTI2LTRiMGItYjE3Mi0wOTcyYjljYmFiMmMiLCJpZCI6MTI3NzM4LCJpYXQiOjE2NzgyMzkxMDR9.FE-Akbv6EYAB3ampwgU7l49OMvS2xPFl7ThcV4Xvpag";
      const viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        fullscreenButton: false,
        baseLayerPicker: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        contextOptions: {
          webgl: {
            preserveDrawingBuffer: true
          }
        },
        navigationInstructionsInitiallyVisible: false,
        clock: {
          clockRange: Cesium.ClockRange.LOOP_STOP,
          currentTime: Cesium.JulianDate.fromIso8601("2021-03-10T14:00:00Z")
        },
        geocoder: false,
        timeline: false,
        animation: false,
        toolbar: false,
        // terrainProvider: Cesium.createWorldTerrain(),
      });
      viewer.scene.logarithmicDepthBuffer = false;
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.scene.backgroundColor = Cesium.Color.BLACK;
      viewer.scene.contextOptions = {
        allowTextureFilterAnisotropic: false,
        webgl: {
          antialias: false
        }
      };
      viewer.clock.shouldAnimate = false; //애니메이션 정지
      viewer.clock.multiplier = 1800;

      // 세슘 로고 삭제
      viewer._cesiumWidget._creditContainer.parentNode.removeChild(viewer._cesiumWidget._creditContainer);

      state.viewer = viewer;
    },
  },
  actions: {
    initViewer: (context) => {
      context.commit("initViewer");
    }
  }
}

export default MapViewer;