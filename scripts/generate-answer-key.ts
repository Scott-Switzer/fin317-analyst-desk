import fs from 'fs/promises';
import path from 'path';
import {
  calculateBondMarketValue,
  calculatePreferredMarketValue,
  calculateEquityMarketValue,
  calculateCapitalWeights,
  calculateAfterTaxCostOfDebt,
  calculateCostOfPreferred,
  calculateCostOfEquityCAPM,
  calculateCostOfEquityDGM,
  calculateWACC,
  calculateNPV,
  calculateIRR,
  calculateMIRR,
  calculatePaybackPeriod,
  calculateDiscountedPaybackPeriod,
} from '@/lib/finance';

interface Scenario {
  missionId: string;
  title: string;
  capitalStructure: {
    debt: {
      bookValue: number;
      couponRate: number;
      ytm: number;
      yearsToMaturity: number;
      faceValue: number;
    };
    preferred: {
      dividendPerShare: number;
      requiredReturn: number;
      sharesOutstanding: number;
    };
    equity: {
      sharesOutstanding: number;
      pricePerShare: number;
      beta: number;
      riskFreeRate: number;
      marketRiskPremium: number;
      dividendPerShare: number;
      growthRate: number;
    };
  };
  projectCashFlows: {
    initialOutlay: number;
    annualFlows: number[];
    projectLife: number;
  };
  taxRate?: number;
}

async function main() {
  const scenarioPath = path.resolve(
    process.cwd(),
    'scenarios',
    'project-falcon.v1.json'
  );
  const scenarioData = await fs.readFile(scenarioPath, 'utf-8');
  const scenario: Scenario = JSON.parse(scenarioData);

  const taxRate = scenario.taxRate ?? 0.25;

  // --- Capital structure ---
  const debt = scenario.capitalStructure.debt;
  const preferred = scenario.capitalStructure.preferred;
  const equity = scenario.capitalStructure.equity;

  const mvDebt = calculateBondMarketValue(
    debt.faceValue,
    debt.couponRate,
    debt.ytm,
    debt.yearsToMaturity
  );

  const mvPreferred = calculatePreferredMarketValue(
    preferred.dividendPerShare,
    preferred.requiredReturn,
    preferred.sharesOutstanding
  );

  const mvEquity = calculateEquityMarketValue(
    equity.sharesOutstanding,
    equity.pricePerShare
  );

  const { wd, wp, ws } = calculateCapitalWeights(mvDebt, mvPreferred, mvEquity);

  const afterTaxCostOfDebt = calculateAfterTaxCostOfDebt(debt.ytm, taxRate);

  const preferredPricePerShare = preferred.dividendPerShare / preferred.requiredReturn;
  const costOfPreferred = calculateCostOfPreferred(
    preferred.dividendPerShare,
    preferredPricePerShare
  );

  const costOfEquityCAPM = calculateCostOfEquityCAPM(
    equity.riskFreeRate,
    equity.beta,
    equity.marketRiskPremium
  );

  const costOfEquityDGM = calculateCostOfEquityDGM(
    equity.dividendPerShare,
    equity.growthRate,
    equity.pricePerShare
  );

  const wacc = calculateWACC(
    wd,
    wp,
    ws,
    afterTaxCostOfDebt,
    costOfPreferred,
    costOfEquityCAPM
  );

  // --- Project metrics ---
  const { initialOutlay, annualFlows } = scenario.projectCashFlows;

  const npv = calculateNPV(wacc, initialOutlay, annualFlows);
  const irr = calculateIRR(initialOutlay, annualFlows);
  const mirr = calculateMIRR(initialOutlay, annualFlows, wacc, wacc);
  const payback = calculatePaybackPeriod(initialOutlay, annualFlows);
  const discountedPayback = calculateDiscountedPaybackPeriod(
    wacc,
    initialOutlay,
    annualFlows
  );

  const recommendedDecision = npv > 0 && irr > wacc ? 'Accept' : 'Reject';

  const answerKey = {
    missionId: scenario.missionId,
    generatedAt: new Date().toISOString(),
    capitalStructure: {
      marketValueOfDebt: mvDebt,
      marketValueOfPreferred: mvPreferred,
      marketValueOfEquity: mvEquity,
      totalCapital: mvDebt + mvPreferred + mvEquity,
      weights: {
        wd,
        wp,
        ws,
      },
    },
    costsOfCapital: {
      afterTaxCostOfDebt,
      costOfPreferred,
      costOfEquityCAPM,
      costOfEquityDGM,
      wacc,
    },
    projectMetrics: {
      npv,
      irr,
      mirr,
      paybackPeriod: payback,
      discountedPaybackPeriod: discountedPayback,
    },
    recommendation: {
      decision: recommendedDecision,
      rationale: `NPV is ${npv >= 0 ? 'positive' : 'negative'} (${npv.toFixed(2)}) and IRR (${(irr * 100).toFixed(2)}%) is ${irr > wacc ? 'greater than' : 'less than'} WACC (${(wacc * 100).toFixed(2)}%).`,
    },
  };

  const rubricsDir = path.resolve(process.cwd(), 'rubrics');
  await fs.mkdir(rubricsDir, { recursive: true });
  const answerKeyPath = path.resolve(
    rubricsDir,
    'project-falcon.answer-key.v1.json'
  );
  await fs.writeFile(answerKeyPath, JSON.stringify(answerKey, null, 2));
  console.log(`Answer key written to ${answerKeyPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
