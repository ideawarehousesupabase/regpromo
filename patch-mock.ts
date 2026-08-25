import fs from 'fs';
import { campaigns as oldCampaigns, reports as oldReports, recentActivity as oldActivity } from './src/data/mock.ts';
import { runComplianceCheck } from './src/lib/compliance-engine.ts';

const newCampaigns = oldCampaigns.map(c => {
  const result = runComplianceCheck(c);
  return { ...c, score: result.score, risk: result.risk };
});

const newReports = oldReports.map(r => {
  const c = oldCampaigns.find(camp => camp.id === r.campaignId)!;
  const result = runComplianceCheck(c);
  return {
    ...r,
    score: result.score,
    risk: result.risk,
    breakdown: result.breakdown,
    issues: result.issues,
    recommendations: result.recommendations,
  };
});

// also fix recentActivity to reflect new scores
const newActivity = oldActivity.map(a => {
  if (a.id === 'a1') return { ...a, text: `Q3 High-Yield Savings Launch scored ${newCampaigns[0].score}% — ${newCampaigns[0].risk.toLowerCase()} risk` };
  if (a.id === 'a3') return { ...a, text: `Injury Claims Retargeting flagged as ${newCampaigns[2].risk.toLowerCase()} risk` };
  if (a.id === 'a4') return { ...a, text: `Compliance score updated for Weekend Free Spins Promo` };
  return a;
});

// now generate the source code to replace in mock.ts
let content = fs.readFileSync('./src/data/mock.ts', 'utf8');

// Replace campaigns
const campRegex = /export const campaigns: Campaign\[\] = \[[\s\S]*?\];/;
content = content.replace(campRegex, `export const campaigns: Campaign[] = ${JSON.stringify(newCampaigns, null, 2)};`);

// Replace reports
const repRegex = /export const reports: ComplianceReport\[\] = \[[\s\S]*?\];/;
content = content.replace(repRegex, `export const reports: ComplianceReport[] = ${JSON.stringify(newReports, null, 2)};`);

// Replace recentActivity
const actRegex = /export const recentActivity = \[[\s\S]*?\];/;
content = content.replace(actRegex, `export const recentActivity = ${JSON.stringify(newActivity, null, 2)};`);

// Fix double quotes in JSON to single quotes for some things, but actually JSON is fine in TS.
fs.writeFileSync('./src/data/mock.ts', content);

console.log('Successfully updated mock.ts with accurate engine scores!');
