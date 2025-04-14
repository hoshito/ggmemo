import styles from './page.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>1. Data Collection and Storage</h2>
        <p>GGMemo is committed to protecting your privacy. We offer two modes of operation with different data handling approaches:</p>

        <h3 style={{ marginTop: "1.5rem" }}>Basic Mode (No Sign-in)</h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>All data is stored locally in your browser</li>
          <li>Simple text memos with titles</li>
          <li>Record creation timestamps</li>
          <li>No data is transmitted to our servers</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}>Session Mode (With Google Sign-in)</h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Match results (Win/Lose)</li>
          <li>Performance ratings (1-5 stars)</li>
          <li>Session titles and notes</li>
          <li>Data is stored in Firebase and synced across your devices</li>
          <li>Google authentication information</li>
        </ul>

        <p style={{ marginTop: "1rem" }}>When installed as a Progressive Web App (PWA), the app utilizes caching through Service Workers to enable offline functionality.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>2. Data Control</h2>
        <p>You have full control over your data:</p>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Basic Mode: Delete data by clearing your browser&apos;s local storage</li>
          <li>Session Mode: Delete data by removing sessions or deleting your account</li>
          <li>Export your data anytime in Markdown format</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>We recommend regularly exporting your data as a backup.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>3. Third-Party Services</h2>
        <h3 style={{ marginTop: "1.5rem" }}>Current Services</h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Google Authentication: Used for Session Mode sign-in</li>
          <li>Firebase: Stores and syncs Session Mode data</li>
          <li>Google Analytics: Collects anonymous usage data</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}>Google Analytics Data Collection</h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Page views and navigation patterns</li>
          <li>Basic device information (browser type, operating system)</li>
          <li>Geographic location (country/region level only)</li>
          <li>Usage patterns (anonymized)</li>
        </ul>

        <p style={{ marginTop: "1rem" }}>You can opt-out of Google Analytics tracking by:</p>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
          <li>Using your browser&apos;s Do Not Track feature</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}>Planned Services</h3>
        <p style={{ marginTop: "1rem" }}>We plan to implement Google Ads in the future. When implemented:</p>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Only relevant advertisements will be displayed</li>
          <li>Users will be notified before implementation</li>
          <li>Opt-out options will be provided</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>4. Data Analysis and Export</h2>
        <p>Statistical features vary by mode:</p>

        <h3 style={{ marginTop: "1.5rem" }}>Basic Mode</h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Basic memo statistics</li>
          <li>Data analysis using local storage only</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}>Session Mode</h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Comprehensive statistics (wins, losses, win rate)</li>
          <li>Performance rating trends</li>
          <li>Per-session analysis</li>
        </ul>

        <p style={{ marginTop: "1rem" }}>Both modes support Markdown format export for data backup and portability.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>5. Updates to Privacy Policy</h2>
        <p>We may update this privacy policy from time to time. Any changes will be reflected on this page.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>6. Contact</h2>
        <p>If you have any questions about this privacy policy, please contact us at <a href="https://x.com/pokekoyomi" target="_blank" rel="noopener noreferrer">@pokekoyomi</a> on X (formerly Twitter).</p>
      </section>
    </div>
  );
}
