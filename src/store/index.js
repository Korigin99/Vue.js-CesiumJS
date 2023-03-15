import {createStore} from "vuex";
import MapViewer from "./MapViewer";

export default createStore({
  modules: {
    MapViewer: MapViewer
  }
});