import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { TrendingDown, Award, Lightbulb, RotateCcw, TreePine } from "lucide-react";
import type { CarbonResults } from "@/lib/carbon-calculations";

interface ResultsDashboardProps {
  results: CarbonResults;
  onReset: () => void;
}

const ratingColors: Record<string, string> = {
  Excellent: "text-primary",
  Good: "text-accent",
  Average: "text-chart-3",
  "Above Average": "text-chart-3",
  High: "text-destructive",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 text-sm">
      <p className="text-foreground font-medium">{payload[0].name || payload[0].payload.name}</p>
      <p className="text-primary">{payload[0].value.toLocaleString()} kg CO₂</p>
    </div>
  );
};

const ResultsDashboard = ({ results, onReset }: ResultsDashboardProps) => {
  const totalTons = (results.total / 1000).toFixed(1);
  const treesNeeded = Math.ceil(results.total / 22);

  const radarData = results.breakdown.map(b => ({
    subject: b.name,
    value: (b.value / results.total) * 100,
  }));

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Your Carbon Footprint
          </h2>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="inline-block"
          >
            <div className="glass glass-glow rounded-2xl px-8 py-6 inline-block">
              <p className="text-5xl md:text-7xl font-display font-bold text-gradient glow-text">
                {totalTons}
              </p>
              <p className="text-muted-foreground text-sm mt-1">tonnes CO₂e per year</p>
              <div className={`mt-2 flex items-center justify-center gap-2 ${ratingColors[results.rating]}`}>
                <Award className="w-5 h-5" />
                <span className="font-semibold">{results.rating}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass glass-glow rounded-2xl p-6"
          >
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-primary" />
              Emission Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={results.breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {results.breakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {results.breakdown.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted-foreground">{entry.name}</span>
                  <span className="font-medium text-foreground">{entry.value} kg</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Comparison Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass glass-glow rounded-2xl p-6"
          >
            <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-primary" />
              Global Comparison (tonnes)
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={results.comparison} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis type="category" dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
                  {results.comparison.map((entry, i) => (
                    <Cell key={i} fill={i === 0 ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.3)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass glass-glow rounded-2xl p-6"
          >
            <h3 className="text-lg font-display font-semibold mb-4">Impact Profile</h3>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Trees needed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass glass-glow rounded-2xl p-6 flex flex-col items-center justify-center text-center"
          >
            <TreePine className="w-12 h-12 text-primary mb-4" />
            <p className="text-4xl font-display font-bold text-gradient">{treesNeeded}</p>
            <p className="text-muted-foreground mt-2">trees needed per year to offset your emissions</p>
            <p className="text-xs text-muted-foreground mt-1">(≈22 kg CO₂ absorbed per tree annually)</p>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass glass-glow rounded-2xl p-6 md:p-8"
        >
          <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-chart-3" />
            Personalized Reduction Tips
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {results.tips.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="glass-subtle rounded-xl p-4 text-sm text-secondary-foreground leading-relaxed"
              >
                {tip}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Reset */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass-subtle text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Recalculate
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResultsDashboard;
