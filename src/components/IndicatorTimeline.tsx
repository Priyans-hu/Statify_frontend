import { Card, CardContent } from "@/components/ui/card"

type Incident = {
  title: string
  description: string
  time: string
}

type Props = {
  incidents: Incident[]
}

export default function IncidentTimeline({ incidents }: Props) {
  return (
    <div className="space-y-4">
      {incidents.map((incident, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <h4 className="font-semibold">{incident.title}</h4>
            <p className="text-sm text-gray-600">{incident.description}</p>
            <p className="text-xs text-gray-400 mt-2">{incident.time}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
