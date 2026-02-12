import { Job, AnalysisResult } from '../types';

export const sendDiscordNotification = async (
  webhookUrl: string,
  job: Job,
  analysis: AnalysisResult
): Promise<boolean> => {
  if (!webhookUrl) return false;

  const payload = {
    embeds: [
      {
        title: `🔥 High Match Job Found: ${job.title}`,
        description: `**Company:** ${job.company}\n**Location:** ${job.location}\n**Match Rating:** ${analysis.rating}/10\n\n${analysis.reasoning}`,
        color: 5763719, // Greenish
        fields: [
          { name: "Salary", value: job.salary || "Not specified", inline: true },
          { name: "Job ID", value: job.id, inline: true }
        ],
        footer: {
          text: "Job Market Monitor AI"
        }
      }
    ]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error("Discord Webhook failed:", error);
    // Likely CORS error if run from browser, but we log it
    return false;
  }
};
