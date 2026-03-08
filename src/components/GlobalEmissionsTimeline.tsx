import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { TrendingUp, Globe, Flame, Zap, Wind, Leaf } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-sm z-50 relative">
      <p className="text-foreground font-medium mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color || entry.stroke }}>
          {entry.name}: {entry.value} {entry.name === "Intensity" || entry.name === "Forecast" ? "gCO₂/kWh" : "%"}
        </p>
      ))}
    </div>
  );
};

const GlobalEmissionsTimeline = () => {
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [generationData, setGenerationData] = useState<any[]>([]);
  const [regionalData, setRegionalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealtimeData = async () => {
      try {
        setLoading(true);
        // Fetch 24-hour history
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const historyRes = await fetch(`https://api.carbonintensity.org.uk/intensity/${yesterday.toISOString()}/${now.toISOString()}`);
        const historyJson = await historyRes.json();

        // Format history nicely
        if (historyJson.data) {
          const formattedHistory = historyJson.data.map((d: any) => ({
            time: new Date(d.from).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            Intensity: d.intensity.actual,
            Forecast: d.intensity.forecast,
          }));
          setHistoryData(formattedHistory);
        }

        // Fetch generation mix
        const mixRes = await fetch("https://api.carbonintensity.org.uk/generation");
        const mixJson = await mixRes.json();
        if (mixJson.data?.generationmix) {
          const sortedMix = [...mixJson.data.generationmix].sort((a, b) => b.perc - a.perc);
          setGenerationData(sortedMix);
        }

        // Fetch regional intensities
        const regRes = await fetch("https://api.carbonintensity.org.uk/regional");
        const regJson = await regRes.json();
        if (regJson.data?.[0]?.regions) {
          // Sort regions by intensity high to low
          const sortedReg = [...regJson.data[0].regions].sort((a, b) => b.intensity.forecast - a.intensity.forecast);
          setRegionalData(sortedReg);
        }
      } catch (error) {
        console.error("Failed to fetch API data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealtimeData();
    const interval = setInterval(fetchRealtimeData, 5 * 60 * 1000); // refresh 5m
    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const currentIntensity = historyData[historyData.length - 1]?.Intensity || 0;
  const maxIntensity = Math.max(...historyData.map(d => d.Intensity || 0), 0) || 0;
  const windGen = generationData.find(d => d.fuel === "wind")?.perc || 0;
  const cleanestRegion = [...regionalData].sort((a, b) => a.intensity.forecast - b.intensity.forecast)[0]?.shortname || "Unknown";

  const fuelColors: Record<string, string> = {
    gas: "hsl(var(--chart-5))",
    coal: "hsl(var(--destructive))",
    biomass: "hsl(var(--chart-3))",
    nuclear: "hsl(var(--primary))",
    wind: "hsl(var(--chart-1))",
    solar: "hsl(var(--chart-2))",
    hydro: "hsl(var(--chart-1))",
    imports: "hsl(var(--muted-foreground))",
    other: "hsl(var(--muted))"
  };

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 glass-subtle rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-accent animate-pulse-slow" />
            <span className="text-sm text-muted-foreground font-medium">Live API · Real-Time Grid Data</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            <span className="text-foreground">Real-Time </span>
            <span className="text-gradient glow-text">Grid Emissions</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Live emissions data fetched directly from local energy grid APIs. See exactly what is powering the grid right now across regions.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Stat counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Current Intensity", value: `${currentIntensity}g`, icon: Flame, accent: "text-chart-4" },
                { label: "24-Hour Peak", value: `${maxIntensity}g`, icon: TrendingUp, accent: "text-chart-5" },
                { label: "Wind Generation", value: `${windGen}%`, icon: Wind, accent: "text-primary" },
                { label: "Cleanest Region", value: cleanestRegion, icon: Leaf, accent: "text-accent" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="glass glass-glow rounded-2xl p-5 text-center"
                >
                  <stat.icon className={`w-6 h-6 ${stat.accent} mx-auto mb-2`} />
                  <p className="text-xl md:text-2xl font-display font-bold text-foreground truncate">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Main area chart — 24 Hour Intensity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass glass-glow rounded-2xl p-6"
            >
              <h3 className="text-lg font-display font-semibold mb-1 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                24-Hour Carbon Intensity History (gCO₂/kWh)
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Direct from National API</p>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="intensityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={11} minTickGap={30} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Intensity" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#intensityGrad)" />
                  <Area type="monotone" dataKey="Forecast" stroke="hsl(var(--chart-3))" strokeDasharray="5 5" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Two-column: Gen Mix + Regional */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Generation Mix Bar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass glass-glow rounded-2xl p-6"
              >
                <h3 className="text-lg font-display font-semibold mb-1 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-chart-3" />
                  Current Generation Mix
                </h3>
                <p className="text-xs text-muted-foreground mb-4">% of total grid power by fuel source</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={generationData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis type="category" dataKey="fuel" stroke="hsl(var(--muted-foreground))" fontSize={11} width={60} style={{ textTransform: 'capitalize' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="perc" name="Share" radius={[0, 4, 4, 0]}>
                      {generationData.map((entry, i) => (
                        <Cell key={`cell-${i}`} fill={fuelColors[entry.fuel] || "hsl(var(--primary))"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Regional intensities */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="glass glass-glow rounded-2xl p-6"
              >
                <h3 className="text-lg font-display font-semibold mb-1 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-chart-4" />
                  Grid Intensity By Region
                </h3>
                <p className="text-xs text-muted-foreground mb-4">gCO₂/kWh across districts (Live)</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalData.slice(0, 10)} layout="vertical" margin={{ left: 5 }}>
                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis type="category" dataKey="shortname" stroke="hsl(var(--muted-foreground))" fontSize={10} width={85} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="intensity.forecast" name="Intensity" radius={[0, 4, 4, 0]}>
                      {regionalData.slice(0, 10).map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            entry.intensity.index === "very low" || entry.intensity.index === "low"
                              ? "hsl(var(--primary))"
                              : entry.intensity.index === "moderate"
                                ? "hsl(var(--chart-3))"
                                : "hsl(var(--destructive))"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Cleanest regions highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass glass-glow rounded-2xl p-6"
            >
              <h3 className="text-lg font-display font-semibold mb-1 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Live Cleanest Regions
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Lowest carbon intensity currently</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {[...regionalData].sort((a, b) => a.intensity.forecast - b.intensity.forecast).slice(0, 5).map((item, i) => (
                  <motion.div
                    key={item.shortname}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    className="flex flex-col items-center"
                  >
                    <div
                      className="rounded-full flex items-center justify-center font-display font-bold text-background border-4 border-background"
                      style={{
                        width: Math.max(70, 100 - (item.intensity.forecast / 2)),
                        height: Math.max(70, 100 - (item.intensity.forecast / 2)),
                        backgroundColor: "hsl(var(--primary))",
                      }}
                    >
                      <span className="text-sm">{item.intensity.forecast}g</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 font-medium break-words text-center max-w-[80px]">
                      {item.shortname}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </>
        )}
      </div>
    </section>
  );
};

export default GlobalEmissionsTimeline;
