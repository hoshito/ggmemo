import styles from './page.module.css';

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>1. Data Collection and Storage</h2>
        <p>GGMemo is committed to protecting your privacy. We offer two modes of operation with different data handling approaches:</p>

        <h3 style={{ marginTop: "1.5rem" }}><strong>Basic Mode (No Sign-in)</strong></h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>All data is stored locally in your browser</li>
          <li>Text memos with titles (up to 100 characters)</li>
          <li>Record creation timestamps</li>
          <li>No data is transmitted to our servers</li>
          <li>Data can be exported in Markdown format</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}><strong>Session Mode (With Google Sign-in)</strong></h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Match results (Win/Lose)</li>
          <li>Performance ratings (1-5 stars)</li>
          <li>Session titles and detailed notes (up to 300 characters)</li>
          <li>Data is stored in Firebase and synced across your devices</li>
          <li>Google authentication information (email, display name, profile photo)</li>
          <li>Data can be exported in Markdown format</li>
        </ul>

        <p style={{ marginTop: "1rem" }}>When installed as a Progressive Web App (PWA), the app utilizes caching through Service Workers to enable offline functionality and enhance performance.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>2. Data Control</h2>
        <p>You have full control over your data:</p>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li><strong>Basic Mode:</strong> Delete data by clearing your browser&apos;s local storage or individual memos</li>
          <li><strong>Session Mode:</strong> Delete data by removing sessions or deleting your account entirely</li>
          <li>Export your data anytime in Markdown format for your records</li>
          <li>Request account deletion at any time (Session Mode)</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>We strongly recommend regularly exporting your data as a backup, especially before clearing browser data or deleting your account.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>3. Third-Party Services</h2>
        <h3 style={{ marginTop: "1.5rem" }}><strong>Current Services</strong></h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li><strong>Google Authentication:</strong> Used for Session Mode sign-in. We only store your authentication token, email, display name, and profile photo if available.</li>
          <li><strong>Firebase:</strong> Securely stores and syncs Session Mode data. Subject to <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase Privacy Policy</a>.</li>
          <li><strong>Google Analytics:</strong> Collects anonymous usage data to help us improve the service.</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}><strong>Google Analytics Data Collection</strong></h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Page views and navigation patterns</li>
          <li>Basic device information (browser type, operating system)</li>
          <li>Geographic location (country/region level only)</li>
          <li>Usage patterns (anonymized)</li>
          <li>No personally identifiable information is collected</li>
        </ul>

        <p style={{ marginTop: "1rem" }}>You can opt-out of Google Analytics tracking by:</p>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a></li>
          <li>Using your browser&apos;s Do Not Track feature</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}><strong>Planned Services</strong></h3>
        <p style={{ marginTop: "1rem" }}>We plan to implement Google Ads in the future. When implemented:</p>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Only relevant advertisements will be displayed</li>
          <li>Users will be notified before implementation</li>
          <li>Opt-out options will be provided where possible</li>
          <li>The privacy policy will be updated with specific details</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>4. Data Analysis and Export</h2>
        <p>Statistical features vary by mode:</p>

        <h3 style={{ marginTop: "1.5rem" }}><strong>Basic Mode</strong></h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Basic memo statistics</li>
          <li>Data analysis using local storage only</li>
          <li>Markdown export functionality</li>
        </ul>

        <h3 style={{ marginTop: "1.5rem" }}><strong>Session Mode</strong></h3>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li>Comprehensive statistics (wins, losses, win rate)</li>
          <li>Performance rating trends and analysis</li>
          <li>Per-session detailed statistics</li>
          <li>Markdown export functionality</li>
        </ul>

        <p style={{ marginTop: "1rem" }}>No data analysis is performed by our services - all analysis is done within the application locally.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>5. Data Security</h2>
        <p>We take the security of your data seriously, but there are important limitations to be aware of:</p>
        <ul style={{ marginTop: "1rem", marginLeft: "2rem" }}>
          <li><strong>Basic Mode:</strong> Data security depends on your browser&apos;s security features</li>
          <li><strong>Session Mode:</strong> Data is protected by Firebase security rules and Google Authentication</li>
          <li>All data transfers use secure HTTPS connections</li>
          <li>User authentication is handled through secure OAuth protocols</li>
        </ul>
        
        <div style={{ marginTop: "1.5rem", padding: "1rem", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "rgba(0, 0, 0, 0.03)" }}>
          <p style={{ fontWeight: "bold", fontSize: "1.1rem" }}><strong>Important Notice:</strong></p>
          <p>GGMemo is a personal project developed by an individual developer, not a large company with extensive security resources. While we implement reasonable security measures, we cannot guarantee absolute protection against all potential security incidents.</p>
          <p style={{ marginTop: "0.5rem" }}>In the event of a security breach or data loss, our ability to respond may be limited. We strongly encourage you to:</p>
          <ul style={{ marginTop: "0.5rem", marginLeft: "2rem" }}>
            <li>Regularly export your important data</li>
            <li>Avoid storing sensitive personal information in your memos</li>
            <li>Use strong passwords for your Google account</li>
          </ul>
          <p style={{ marginTop: "1rem" }}>By using GGMemo, you acknowledge and accept these limitations. We cannot accept liability for any damages resulting from data breaches, service disruptions, or other security incidents beyond our reasonable control.</p>
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>6. Updates to Privacy Policy</h2>
        <p>We may update this privacy policy from time to time. Any significant changes will be reflected on this page with an updated revision date.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>7. Contact</h2>
        <p>If you have any questions about this privacy policy or how we handle your data, please contact us at <a href="https://x.com/pokekoyomi" target="_blank" rel="noopener noreferrer">@pokekoyomi</a> on X (formerly Twitter).</p>
      </section>

      <p style={{ marginTop: "3rem", fontSize: "1rem", fontWeight: "bold", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>Last updated: April 15, 2025</p>
    </div>
  );
}
