import React from "react";
import ReactDOM from "react-dom";
import DeckGL, { ArcLayer, IconLayer, ScatterplotLayer } from "deck.gl";
import { StaticMap } from "react-map-gl";
import { EditableGeoJsonLayer } from "nebula.gl";

import sampleGeoJson from "./data.json";

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 0,
  zoom: 2,
  maxZoom: 20,
  pitch: 0,
  bearing: 0
};

export default class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      viewport: initialViewport,
      testFeatures: sampleGeoJson,
      mode: "modify",
      pointsRemovable: true,
      selectedFeatureIndexes: [],
      editHandleType: "point"
    };
  }

  render() {
    const editableGeoJsonLayer = new EditableGeoJsonLayer({
      id: "geojson",
      data: this.state.testFeatures,
      selectedFeatureIndexes: this.state.selectedFeatureIndexes,
      mode: this.state.mode,
      fp64: true,
      autoHighlight: true,

      // Editing callbacks
      onEdit: ({
        updatedData,
        updatedMode,
        updatedSelectedFeatureIndexes,
        editType,
        featureIndex,
        positionIndexes,
        position
      }) => {
        if (editType !== "movePosition") {
          // Don't log moves since they're really chatty
          // eslint-disable-next-line
          console.log(
            "onEdit",
            editType,
            updatedMode,
            updatedSelectedFeatureIndexes,
            featureIndex,
            positionIndexes,
            position
          );
        }
        if (editType === "removePosition" && !this.state.pointsRemovable) {
          // reject the edit
          return;
        }
        this.setState({
          testFeatures: updatedData,
          mode: updatedMode,
          selectedFeatureIndexes: updatedSelectedFeatureIndexes
        });
      },

      // test using icons for edit handles
      editHandleType: this.state.editHandleType,
      editHandleIconAtlas: assetUrl("../static/images/orbs.png"),
      editHandleIconMapping: {
        intermediate: {
          x: 0,
          y: 0,
          width: 58,
          height: 58,
          mask: false
        },
        existing: {
          x: 58,
          y: 0,
          width: 58,
          height: 58,
          mask: false
        }
      },
      getEditHandleIcon: d => d.type,
      getEditHandleIconSize: 40,
      getEditHandleIconColor: handle =>
        handle.type === "existing"
          ? [0xff, 0x80, 0x00, 0xff]
          : [0x0, 0x0, 0x0, 0x80],

      // Specify the same GeoJsonLayer props
      lineWidthMinPixels: 2,
      pointRadiusMinPixels: 5,
      getLineDashArray: () => [0, 0],

      // Accessors receive an isSelected argument
      getFillColor: (feature, isSelected) => {
        return isSelected ? [0x20, 0x40, 0x90, 0xc0] : [0x20, 0x20, 0x20, 0x30];
      },
      getLineColor: (feature, isSelected) => {
        return isSelected ? [0x00, 0x20, 0x90, 0xff] : [0x20, 0x20, 0x20, 0xff];
      },

      // Can customize editing points props
      getEditHandlePointColor: handle =>
        handle.type === "existing"
          ? [0xff, 0x80, 0x00, 0xff]
          : [0x0, 0x0, 0x0, 0x80],
      editHandlePointRadiusScale: 2,

      // customize drawing line style
      getDrawLineDashArray: () => [7, 4],
      getDrawLineColor: () => [0x8f, 0x8f, 0x8f, 0xff]
    });

    const layers = [editableGeoJsonLayer];

    return (
      <DeckGL
        layers={layers}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <Search />
        <StaticMap
          reuseMaps
          mapStyle="mapbox://styles/mapbox/dark-v9"
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
    );
  }
}
