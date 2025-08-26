"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, ChevronLeft, ChevronRight, Clock } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Team Standup",
    date: "2025-08-18",
    time: "09:00 AM",
    duration: "30 min",
    type: "Meeting",
    attendees: 8,
  },
  {
    id: 2,
    title: "Product Review",
    date: "2025-08-18",
    time: "02:00 PM",
    duration: "1 hour",
    type: "Review",
    attendees: 12,
  },
  {
    id: 3,
    title: "Sarah Johnson - Annual Leave",
    date: "2025-08-20",
    time: "All Day",
    duration: "Full Day",
    type: "Leave",
    attendees: 1,
  },
  {
    id: 4,
    title: "Engineering All-Hands",
    date: "2025-08-25",
    time: "04:00 PM",
    duration: "45 min",
    type: "Meeting",
    attendees: 25,
  },
]

const upcomingEvents = [
  {
    id: 1,
    title: "Quarterly Planning",
    date: "Tomorrow",
    time: "10:00 AM",
    type: "Planning",
  },
  {
    id: 2,
    title: "Client Presentation",
    date: "Aug 28",
    time: "03:00 PM",
    type: "Presentation",
  },
  {
    id: 3,
    title: "Holiday Party",
    date: "Aug 30",
    time: "06:00 PM",
    type: "Event",
  },
]

function generateCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  while (days.length % 7 !== 0) days.push(null)

  return days
}

export default function CalendarPage() {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  const days = generateCalendarDays(currentYear, currentMonth)

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return prev - 1
    })
    setSelectedDay(null)
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return prev + 1
    })
    setSelectedDay(null)
  }

  const isToday = (day: number | null) =>
    day &&
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear()

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })

  // Filter events by selected day
  const selectedDateString =
    selectedDay !== null
      ? new Date(currentYear, currentMonth, selectedDay).toISOString().split("T")[0]
      : null

  const filteredEvents = selectedDateString
    ? events.filter((event) => event.date === selectedDateString)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Manage events, meetings, and employee schedules</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {monthName} {currentYear}
                  </CardTitle>
                  <CardDescription>
                    Today is{" "}
                    {today.toLocaleDateString("default", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentMonth(today.getMonth())
                      setCurrentYear(today.getFullYear())
                      setSelectedDay(today.getDate())
                    }}
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Dynamic calendar grid */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
                {days.map((day, i) => (
                  <div
                    key={i}
                    onClick={() => day && setSelectedDay(day)}
                    className={`p-2 text-center text-sm border rounded cursor-pointer hover:bg-accent ${
                      day ? "text-foreground" : "text-muted-foreground"
                    } ${isToday(day) ? "bg-primary text-primary-foreground font-bold" : ""} ${
                      selectedDay === day ? "bg-accent font-bold" : ""
                    }`}
                  >
                    {day || ""}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Day's Events */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>
                {selectedDay
                  ? `Events on ${new Date(currentYear, currentMonth, selectedDay).toLocaleDateString("default", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}`
                  : "No Day Selected"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-8 bg-primary rounded-full"></div>
                        <div>
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {event.time} • {event.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                        <Badge variant="outline">{event.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No events scheduled.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">This Week</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Events</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Meetings</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Leave Requests</span>
                <span className="font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Company Events</span>
                <span className="font-semibold">3</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-accent">
                    <Calendar className="h-4 w-4 text-primary mt-1" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {event.date} at {event.time}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
