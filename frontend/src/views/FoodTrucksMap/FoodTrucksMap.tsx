import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import ErrorAlert from "~/components/ErrorAlert";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { Button } from "~/components/ui/button";
import { useFoodTrucks } from "~/services/food-trucks";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";

const markerIcon = new Icon({ iconUrl: markerIconUrl, iconSize: [25, 41], iconAnchor: [12, 41] });

export default function FoodTrucksMap() {
  const { data, isPending, error, refetch } = useFoodTrucks();

  const render = () => {
    if (isPending)
      return (
        <div className="flex justify-center">
          <LoadingSpinner data-testid="loading" />
        </div>
      );
    if (error) {
      return (
        <ErrorAlert
          description={`Failed to fetch data, reason: ${error?.message}`}
          extra={
            <Button variant="secondary" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      );
    }
    const latitude = data?.[0].latitude ?? 37.78788969990609;
    const longitude = data?.[0].longitude ?? -122.40053532677749;

    return (
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{
          width: "100%",
          height: 600,
          maxHeight: "80vh",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {(data || []).map((d) => (
          <Marker
            key={d.locationId}
            position={[d.latitude, d.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <div className="flex flex-col gap-2">
                <div className="font-semibold">{d.applicant}</div>
                <div>{d.address}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  return (
    <div className="container p-4 mx-auto">
      <div>{render()}</div>
    </div>
  );
}
