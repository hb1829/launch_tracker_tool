import { useMemo } from "react";
import type { ProductLaunch } from "@/data/launches";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import styles from "@/styles/ProductTimeline.module.css";

interface ProductTimelineProps {
  launches: ProductLaunch[];
  baseProductName: string;
}


const dateTypeColors: Record<string, string> = {
  "Strategy Kickoff": "#007acc",   // blue
  "Launch": "#00a97f",            // green
  "Market Readout": "#ff9900",    // orange
};

const regionLabels: Record<string, string> = {
  US: "United States",
  EU: "Europe",
  CN: "China",
  JP: "Japan",
};

interface TimelineEvent {
  region: string;
  dateType: string;
  fullDate: string;
}

interface TimelineDataPoint {
  date: string;
  timestamp: number;
  displayDate: string;
  y: number;
  events: TimelineEvent[];
}

// Custom dot component with different colors for different event types
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  
  if (!payload || !payload.events || payload.events.length === 0) {
    return <g />;
  }

  // Draw a marker for each event type at this timestamp
  const events = payload.events;
  const spacing = 22; // pixels between markers (wider to fit label)
  const totalWidth = (events.length - 1) * spacing;
  const startX = cx - totalWidth / 2;

  return (
    <g>
      {events.map((event: TimelineEvent, idx: number) => {
        const xPos = startX + idx * spacing;
        const label = new Date(event.fullDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        return (
          <g key={`${payload.timestamp}-${idx}`}> 
            <circle
              cx={xPos}
              cy={cy}
              r={6}
              fill={dateTypeColors[event.dateType] || "#00a97f"}
              stroke="white"
              strokeWidth={2}
            />
            <text
              x={xPos}
              y={cy + 16}
              textAnchor="middle"
              fontSize={10}
              fill="#333"
            >
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// Custom tooltip showing all events at a timestamp
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const events = data.events || [];

    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipDate}>{data.displayDate}</p>
        {events.map((event: TimelineEvent, idx: number) => (
          <div key={idx} style={{ marginBottom: "0.5rem" }}>
            <p
              style={{
                color: dateTypeColors[event.dateType],
                fontWeight: "600",
                margin: "0 0 0.25rem 0",
                fontSize: "0.95rem",
              }}
            >
              {event.dateType}
            </p>
            <p
              style={{
                color: "#666",
                margin: "0",
                fontSize: "0.9rem",
              }}
            >
              {regionLabels[event.region]} - {event.fullDate}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ProductTimeline({
  launches,
  baseProductName,
}: ProductTimelineProps) {
  const sortedLaunches = useMemo(
    () =>
      [...launches].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      }),
    [launches]
  );

  // Create timeline data with all date types as events
  const chartData = useMemo((): TimelineDataPoint[] => {
    const timelineMap = new Map<number, TimelineDataPoint>();
    // prepare cap for grouping 2030-2035 together
    const capYear = 2030;
    const capDate = new Date(capYear, 0, 1);
    const capTime = capDate.getTime();

    const normalize = (date: Date) => {
      if (date.getFullYear() >= capYear) {
        return capTime;
      }
      return date.getTime();
    };

    const labelFor = (date: Date) => {
      if (date.getFullYear() >= capYear) {
        return `${capYear}+`;
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    sortedLaunches.forEach((launch: ProductLaunch) => {
      // Strategy Kickoff date
      const kickoffDate = new Date(launch.strategyKickoffDate);
      const kickoffTime = normalize(kickoffDate);
      const kickoffISO = kickoffDate.toISOString().split("T")[0];

      if (!timelineMap.has(kickoffTime)) {
        timelineMap.set(kickoffTime, {
          date: kickoffISO,
          timestamp: kickoffTime,
          displayDate: labelFor(kickoffDate),
          y: 1,
          events: [],
        });
      }

      const kickoffEntry = timelineMap.get(kickoffTime)!;
      kickoffEntry.events.push({
        region: launch.region,
        dateType: "Strategy Kickoff",
        fullDate: kickoffDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });

      // Launch date
      const launchDate = new Date(launch.year, launch.month - 1, launch.day);
      const launchTime = normalize(launchDate);
      const launchISO = launchDate.toISOString().split("T")[0];

      if (!timelineMap.has(launchTime)) {
        timelineMap.set(launchTime, {
          date: launchISO,
          timestamp: launchTime,
          displayDate: labelFor(launchDate),
          y: 1,
          events: [],
        });
      }

      const launchEntry = timelineMap.get(launchTime)!;
      launchEntry.events.push({
        region: launch.region,
        dateType: "Launch",
        fullDate: launchDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });

      // Market Readout date
      const readoutDate = new Date(launch.marketReadoutDate);
      const readoutTime = normalize(readoutDate);
      const readoutISO = readoutDate.toISOString().split("T")[0];

      if (!timelineMap.has(readoutTime)) {
        timelineMap.set(readoutTime, {
          date: readoutISO,
          timestamp: readoutTime,
        displayDate: labelFor(readoutDate),
          y: 1,
          events: [],
        });
      }

      const readoutEntry = timelineMap.get(readoutTime)!;
      readoutEntry.events.push({
        region: launch.region,
        dateType: "Market Readout",
        fullDate: readoutDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      });
    });

    // Sort by timestamp
    return Array.from(timelineMap.values())
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item, idx) => ({
        ...item,
        y: 1, // Keep all on the same Y level
      }));
  }, [sortedLaunches]);

  if (sortedLaunches.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No regional launches found for this product.</p>
      </div>
    );
  }

  return (
    <div className={styles.timelineWrapper}>
      {/* Timeline Visualization */}
      <div className={styles.chartContainer}>
        <h3>Product Timeline: All Key Dates Across Regions</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart
            data={chartData}
            margin={{ top: 30, right: 30, left: 30, bottom: 100 }}
            // use timestamp as numeric x axis for proportional spacing
            syncId="timeline"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false} />
            {/* hide axis, but still use a numeric scale underneath */}
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={["dataMin", "dataMax"]}
              hide={true}
              scale="time"
            />
            <YAxis hide={true} type="number" domain={[0, 2]} />
            <Tooltip content={CustomTooltip} cursor={{ strokeDasharray: '5 5' }} />
            <Line
              type="linear"
              dataKey="y"
              stroke="#000"            // single black baseline
              strokeWidth={2}
              dot={CustomDot}
              isAnimationActive={false}
              name=""
            />
          </LineChart>
        </ResponsiveContainer>
        <div className={styles.legendContainer}>
          <div className={styles.legendItem}>
            <div
              className={styles.legendDot}
              style={{ backgroundColor: dateTypeColors["Strategy Kickoff"] }}
            />
            <span>Strategy Kickoff</span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.legendDot}
              style={{ backgroundColor: dateTypeColors["Launch"] }}
            />
            <span>Launch</span>
          </div>
          <div className={styles.legendItem}>
            <div
              className={styles.legendDot}
              style={{ backgroundColor: dateTypeColors["Market Readout"] }}
            />
            <span>Market Readout</span>
          </div>
        </div>
        <p className={styles.chartDescription}>
          Timeline showing all key dates for each region. Hover over markers to see details.
        </p>
      </div>


    </div>
  );
}
