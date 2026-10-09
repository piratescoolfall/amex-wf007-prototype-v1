import { displayData } from './presentation.js'
function ReportList({ items }) {
  return <ul className="report-list">{items.map((text, index) => <li key={index}>{text}</li>)}</ul>
}

export default function CaseAnalysisReport({ report: storedReport, mode }) {
  const report = displayData(storedReport)
  return <article className="case-report" aria-label="AI assessment report">
    <header className="report-heading"><div><p className="eyebrow">AI ASSESSMENT · RECOMMENDATION ONLY</p><h3>AI Assessment Complete</h3><p>{report.caseId} · case version {report.revision} · {mode === 'uncertain' ? 'Additional review required' : 'Ready for review'}</p></div><span className="tag">Human review required</span></header>
    {report.uncertainty && <div className="authority-note" role="alert"><strong>Uncertainty warning:</strong> {report.uncertainty}</div>}
    <section className="report-section"><h3>1. Customer Request Summary</h3><p>{report.customerRequestSummary}</p></section>
    <section className="report-section"><h3>2. Evidence and Known Facts</h3><div className="report-facts-grid">
      <div><h4>Provided facts · Case record</h4><ReportList items={report.evidenceAndKnownFacts.providedFacts} /></div>
      <div><h4>Review requirements</h4><ReportList items={report.evidenceAndKnownFacts.approvedSimulationKnowledge} /></div>
      <div><h4>Evidence-supported conclusions · Advisory</h4><ReportList items={report.evidenceAndKnownFacts.supportedConclusions} /></div>
      <div><h4>Assumptions</h4><ReportList items={report.evidenceAndKnownFacts.assumptions} /><h4>Unknowns</h4><ReportList items={report.evidenceAndKnownFacts.unknowns} /></div>
    </div></section>
    <section className="report-section"><h3>3. Missing Information</h3><ReportList items={report.missingInformation} /></section>
    <section className="report-section"><h3>4. Verification Status</h3><p>{report.verificationStatus.recorded ? `Recorded by human CSR using ${report.verificationStatus.method}, for case version ${report.verificationStatus.revision}.` : 'No current human verification recorded.'}</p><p>{report.verificationStatus.statement}</p></section>
    <section className="report-section"><h3>5. Request Classification</h3><p><strong>{report.requestClassification.category}</strong></p><p>{report.requestClassification.basis}</p></section>
    <section className="report-section"><h3>6. Risk and Review Indicators</h3><ReportList items={report.riskAndReviewIndicators} /></section>
    <section className="report-section"><h3>7. Recommended Next Steps and Escalation</h3><p className="report-label">Recommendations · Do not grant authority</p><ReportList items={report.recommendedNextSteps} /><div className="human-decisions"><h4>Recorded human decisions · Approval and action status</h4><ReportList items={Object.values(report.humanDecisions)} /><p className="disabled-note">Review the recorded decisions and current case status before proceeding.</p></div></section>
    <section className="report-section"><h3>8. Draft Customer Communication</h3><p className="report-label">{report.draftCustomerCommunication.label}</p><blockquote className="customer-draft">{report.draftCustomerCommunication.text}</blockquote></section>
    <section className="report-section"><h3>9. Human Authority Required</h3><ReportList items={report.humanAuthorityRequired} /></section>
  </article>
}
