import mapboxgl from 'mapbox-gl';
import { useRef, useEffect, useState } from 'react';
import Table from './Table';
import Form from './Form';

const Map = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [drawnMarkers, setDrawnMarkers] = useState([])
  const colors = {
    0: "black",
    1: "gray",
    2: "red",
    3: "orange",
    4: "lime",
    5: "green"
  }
  const [geojson, setGeojson] = useState({
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "markerColor": "grey",
          "marker-size": "medium",
          "marker-symbol": "",
          "score": 1,
          "id": 123
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            24.121856689453125,
            49.93973135157948
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {
          "markerColor": "red",
          "marker-size": "medium",
          "marker-symbol": "",
          "score": 2,
          "id": 124
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            24.224853515625,
            49.7768301343366
          ]
        }
      }
    ]
  });
  const createMap = () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiNWhhbWVsZTU1IiwiYSI6ImNrdm0yeXN1dTB2aGcyeG91bjl0YzVsZTUifQ.2KMwF-DnCJaK8VOj9OcHkg';
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [24.039269, 49.848178],
      zoom: 9
    });
    map.current.on('load', () => {
      map.current.addSource('markers', {
        type: 'geojson',
        data: geojson
      })
      map.current.on('click', e => addMarker(e))
    })
  }
  const drawMarkers = item => {
    const popupTemplate = `
    <select>
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>
    <button>Delete</button>
`
    const popup = new mapboxgl.Popup({
      offset: 30
    })
      .setHTML(popupTemplate)
    const marker = new mapboxgl.Marker({
      color: item.properties.markerColor,
      draggable: true
    })
      .setLngLat(item.geometry.coordinates)
      .setPopup(popup)
      .addTo(map.current)
    marker.on('dragend', () => onDragEnd(item.properties.id, marker))
    marker.getElement().addEventListener('click', e => {
      marker.togglePopup()
      if (popup.isOpen()) {
        const delBtn = popup.getElement().children[1].children[1]
        delBtn.addEventListener('click', () => deleteMarker(item.properties.id))

        const select = popup.getElement().children[1].children[0]
        select.value = item.properties.score
        select.addEventListener('change', () => changeScore(select, item.properties.id))
      }
      e.stopPropagation()
    })
    setDrawnMarkers(prevState => [...prevState, marker])
  }
  const addMarker = e => {
    const newMaker = {
      "type": "Feature",
      "properties": {
        "markerColor": "black",
        "score": 0,
        "id": Date.now()
      },
      "geometry": {
        "type": "Point",
        "coordinates": [e.lngLat.lng, e.lngLat.lat]
      }
    }
    setGeojson(prevState => {
      return { ...prevState, features: [...prevState.features, newMaker] }
    })
  }
  const deleteMarker = (id) => {
    setGeojson(prevState => {
      const newFeatures = prevState.features.filter(item => item.properties.id !== id)
      return {
        ...prevState, features: [...newFeatures]
      }
    })
  }
  const changeScore = (select, id) => {
    setGeojson(prevState => {
      return {
        ...prevState, features: prevState.features.map(feature => {
          if (feature.properties.id === id) {
            feature.properties.score = +select.value
            feature.properties.markerColor = colors[select.value]
          }
          return feature
        })
      }
    })
  }
  const onDragEnd = (id, marker) => {
    setGeojson(prevState => {
      return {
        ...prevState, features: prevState.features.map(feature => {
          if (feature.properties.id === id) {
            feature.geometry.coordinates = marker.getLngLat()
          }
          return feature
        })
      }
    })
  }
  const upload = (file) => setGeojson(file)
  const rewriteMarkers = () => {
    setDrawnMarkers([])
    drawnMarkers.forEach(m => m.remove())
    geojson.features.map(item => drawMarkers(item))
  }
  useEffect(() => createMap())
  useEffect(() => rewriteMarkers(), [geojson])
  return (
    <>
      <div ref={mapContainer} className="map"></div>
      <Table geojson={geojson} />
      <Form geojson={geojson} upload={upload} />
    </>
  );
}

export default Map;