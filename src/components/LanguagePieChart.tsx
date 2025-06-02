import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type LanguageStat = {
  name: string;
  color: string;
  size: number;
};

type Props = {
  data: LanguageStat[];
};

const LanguagePieChart = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          dataKey="size"
          data={data}
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LanguagePieChart;
