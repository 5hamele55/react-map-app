const Table = ({ geojson }) => {
  return (
    <ul className="table">
      <li>Total: {geojson.features.length}</li>
      <li>Five: {geojson.features.filter(features => features.properties.score === 5).length}</li>
      <li>Four: {geojson.features.filter(features => features.properties.score === 4).length}</li>
      <li>Three:{geojson.features.filter(features => features.properties.score === 3).length}</li>
      <li>Two: {geojson.features.filter(features => features.properties.score === 2).length}</li>
      <li>One: {geojson.features.filter(features => features.properties.score === 1).length}</li>
      <li>Zero: {geojson.features.filter(features => features.properties.score === 0).length}</li>
    </ul>
  );
}

export default Table;