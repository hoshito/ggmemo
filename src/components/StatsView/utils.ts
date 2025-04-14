import { Memo } from "@/types/memo";
import { ChartTooltipItem } from "./types";

interface Stats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: string;
  averageRating: string;
  ratingDistribution: number[];
}

export const calculateStats = (memos: Memo[]): Stats => {
  const totalGames = memos.length;
  const wins = memos.filter((memo) => memo.result === "WIN").length;
  const losses = memos.filter((memo) => memo.result === "LOSE").length;
  const winRate =
    totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0.0";

  const averageRating =
    totalGames > 0
      ? (
          memos.reduce((sum, memo) => sum + memo.rating, 0) / totalGames
        ).toFixed(1)
      : "0.0";

  const ratingDistribution = Array(5).fill(0);
  memos.forEach((memo) => {
    ratingDistribution[memo.rating - 1]++;
  });

  return {
    totalGames,
    wins,
    losses,
    winRate,
    averageRating,
    ratingDistribution,
  };
};

export const generateMarkdown = (
  memos: Memo[],
  stats: Stats,
  sessionTitle?: string,
  hideRating?: boolean
): string => {
  const statsMarkdown = `${
    sessionTitle ? `# ${sessionTitle}\n\n` : ""
  }# Battle Statistics

Total Games: ${stats.totalGames}
- Wins: ${stats.wins} (${((stats.wins / stats.totalGames) * 100).toFixed(1)}%)
- Losses: ${stats.losses} (${((stats.losses / stats.totalGames) * 100).toFixed(
    1
  )}%)
- Win Rate: ${stats.winRate}%${
    !hideRating ? `\n- Average Rating: ${stats.averageRating}★` : ""
  }

---

# Battle History

`;

  return (
    statsMarkdown +
    memos
      .map((memo, index) => {
        return (
          `### Game ${stats.totalGames - index}\n\n` +
          `**Result:** ${memo.result}\n\n` +
          `${!hideRating ? `**Rating:** ${memo.rating}\n\n` : ""}` +
          `${memo.memo}\n\n` +
          "---\n"
        );
      })
      .join("\n")
  );
};

export const chartColors = {
  win: {
    bg: "rgb(74, 222, 128, 0.9)",
    border: "var(--result-win)",
  },
  lose: {
    bg: "rgb(96, 165, 250, 0.9)",
    border: "var(--result-lose)",
  },
};

export const chartOptions = {
  pieOptions: {
    plugins: {
      legend: {
        position: "left" as const,
        display: true,
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 16,
          color: "#ffffff",
          font: {
            size: 14,
            weight: "bold" as const,
          },
          textAlign: "left" as const,
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: ChartTooltipItem) => {
            const value = tooltipItem.raw;
            const total = tooltipItem.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    layout: {
      padding: {
        bottom: 10,
      },
    },
  },
  barOptions: {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: "#ffffff",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "var(--modal-background)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        callbacks: {
          label: (tooltipItem: ChartTooltipItem) => {
            const value = tooltipItem.raw;
            const total = tooltipItem.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";
            return `${value} games (${percentage}%)`;
          },
        },
      },
    },
  },
};
