import { campaigns } from './src/data/mock.ts';
import { runComplianceCheck } from './src/lib/compliance-engine.ts';

console.log('=== Compliance Engine vs Mock Data Consistency Check ===\n');

let mismatches = 0;

for (const campaign of campaigns) {
  const engineResult = runComplianceCheck({
    industry: campaign.industry,
    platform: campaign.platform,
    adCopy: campaign.adCopy,
    landingPageText: campaign.landingPageText,
    disclaimer: campaign.disclaimer,
  });

  const mockScore = campaign.score;
  const engineScore = engineResult.score;
  const mockRisk = campaign.risk;
  const engineRisk = engineResult.risk;

  const scoreMatch = mockScore === engineScore;
  const riskMatch = mockRisk === engineRisk;

  if (!scoreMatch || !riskMatch) {
    mismatches++;
    console.log(`MISMATCH: ${campaign.name} (${campaign.id})`);
    console.log(`   Mock:   score=${mockScore}, risk=${mockRisk}`);
    console.log(`   Engine: score=${engineScore}, risk=${engineRisk}`);
    console.log(`   Issues found by engine:`);
    for (const issue of engineResult.issues) {
      console.log(`     - ${issue.title} (${issue.severity}, -${issue.impact}pts) [matched: "${issue.matched || 'N/A'}"]`);
    }
    console.log();
  } else {
    console.log(`MATCH: ${campaign.name} — score=${engineScore}, risk=${engineRisk}`);
  }
}

console.log(`\n=== Summary: ${mismatches} mismatch(es) out of ${campaigns.length} campaigns ===`);
