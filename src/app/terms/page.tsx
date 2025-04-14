import styles from './page.module.css';

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <h1>Terms of Service</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using GGMemo (&quot;the Service&quot;), you agree to these Terms of Service.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>2. Description of Service</h2>
        <p>GGMemo is a web application that offers two modes for recording game match results:</p>
        <ul>
          <li style={{ margin: "0.5rem 0" }}>Basic Mode (No Sign-in): Create and manage text memos with titles.</li>
          <li style={{ margin: "0.5rem 0" }}>Session Mode (With Google Sign-in): Record detailed match outcomes including win/loss results, performance ratings (1-5 scale), and notes, organized in sessions.</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>GGMemo can be installed as a Progressive Web App (PWA) on supported devices and browsers, enabling offline access and enhanced performance.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>3. User Data</h2>
        <p>Data storage and handling varies by mode:</p>
        <ul>
          <li style={{ margin: "0.5rem 0" }}>Basic Mode: All data is stored locally in your browser using Local Storage. No data is transmitted to our servers.</li>
          <li style={{ margin: "0.5rem 0" }}>Session Mode: Data is stored in Firebase and synchronized across your devices when signed in with Google. Each user can create up to 20 battle sessions, with up to 50 memos per session. Each memo can contain up to 300 characters.</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>In Basic Mode, clearing your browser data will permanently delete your records. In Session Mode, your data persists in the cloud but may be lost if you delete your account. We recommend regularly exporting your data to Markdown format as a backup. We are not responsible for any data loss or resulting damages.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>4. Use of Service</h2>
        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>5. Changes to Service</h2>
        <p>We reserve the right to modify or discontinue the Service at any time without notice. We are not liable for any modifications, suspension, or discontinuation of the Service.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>6. Disclaimer</h2>
        <p>The Service is provided &quot;as is&quot; without warranties of any kind. In Basic Mode, all data is stored in your browser&apos;s Local Storage and clearing browser data will permanently delete your records. In Session Mode, while data is stored in Firebase, deleting your account or service discontinuation may result in data loss. We recommend regularly exporting your data to Markdown format if you wish to preserve it. We are not responsible for any loss of data or any damages resulting from the use of the Service.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>7. Analytics and Future Services</h2>
        <p>We use Google Analytics to collect anonymous usage data and improve the Service. By using the Service, you consent to the collection and use of data by Google Analytics as described in our Privacy Policy.</p>
        <p style={{ marginTop: "1rem" }}>We plan to implement Google Ads in the future to provide relevant advertisements. We will notify users before implementing this service, and details will be updated in our Privacy Policy.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>8. Contact</h2>
        <p>For questions or concerns about these terms, please contact us at <a href="https://x.com/pokekoyomi" target="_blank" rel="noopener noreferrer">@pokekoyomi</a> on X (formerly Twitter).</p>
      </section>
    </div>
  );
}
