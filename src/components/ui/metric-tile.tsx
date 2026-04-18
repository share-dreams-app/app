import { Card } from "@/components/ui/card";

type MetricTileProps = {
  label: string;
  value: string | number;
};

export function MetricTile({ label, value }: MetricTileProps) {
  return (
    <Card className="sd-metric-tile">
      <span className="sd-metric-value">{value}</span>
      <span className="sd-metric-label">{label}</span>
    </Card>
  );
}
