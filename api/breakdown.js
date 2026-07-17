// Vercel serverless function: POST /api/breakdown
// Stub implementation — returns hardcoded mock data matching the target
// response schema so the frontend can be built against a stable contract
// before the real LLM call is wired up (see engineering_spec.md).

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { problem_text, current_energy } = req.body ?? {};

  if (typeof problem_text !== 'string' || typeof current_energy !== 'number') {
    res.status(400).json({ error: 'problem_text (string) and current_energy (number) are required' });
    return;
  }

  const mockResponse = {
    missions: [
      {
        title: 'Open the syllabus',
        action_text: 'Just open the file. Don\'t read it yet.',
        drafted_content: null,
      },
      {
        title: 'Reply to the one email that\'s actually urgent',
        action_text: 'Send a two-line reply, nothing fancy.',
        drafted_content: "Hi — got your message, will have this to you by Friday. Thanks for your patience!",
      },
    ],
    panda_dialogue: "Okay. Two things. That's it for now.",
    energy_cost: 30,
    refusal: false,
  };

  res.status(200).json(mockResponse);
}
