import styles from './page.module.css';

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <h1>Terms of Service</h1>

      <section style={{ marginTop: "2rem" }}>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using GGMemo (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>2. Description of Service</h2>
        <p>GGMemo is a web application that provides two distinct modes for recording and analyzing game match results:</p>
        <ul>
          <li style={{ margin: "0.5rem 0" }}><strong>Basic Mode (No Sign-in):</strong> Create and manage text memos with titles, store data locally in your browser.</li>
          <li style={{ margin: "0.5rem 0" }}><strong>Session Mode (With Google Sign-in):</strong> Record detailed match outcomes including win/loss results, performance ratings (1-5 scale), and notes organized in sessions.</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>GGMemo can be installed as a Progressive Web App (PWA) on supported devices and browsers, enabling offline access and enhanced performance.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>3. User Data</h2>
        <p>Data storage and handling varies by mode:</p>
        <ul>
          <li style={{ margin: "0.5rem 0" }}><strong>Basic Mode:</strong> All data is stored locally in your browser using Local Storage. No data is transmitted to our servers.</li>
          <li style={{ margin: "0.5rem 0" }}><strong>Session Mode:</strong> Data is stored in Firebase and synchronized across your devices when signed in with Google. Each user can create up to 20 battle sessions, with up to 50 memos per session. Each memo can contain up to 300 characters.</li>
        </ul>
        <p style={{ marginTop: "1rem" }}>In Basic Mode, clearing your browser data will permanently delete your records. In Session Mode, your data persists in the cloud but may be lost if you delete your account. We recommend regularly exporting your data to Markdown format as a backup. We are not responsible for any data loss or resulting damages.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>4. Use of Service</h2>
        <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
        <ul>
          <li style={{ margin: "0.5rem 0" }}>Use the Service in any way that violates any applicable laws or regulations</li>
          <li style={{ margin: "0.5rem 0" }}>Attempt to interfere with or disrupt the Service or servers</li>
          <li style={{ margin: "0.5rem 0" }}>Attempt to gain unauthorized access to any parts of the Service</li>
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>5. Changes to Service</h2>
        <p>We reserve the right to modify, update, or discontinue the Service at any time without prior notice. We may also update these Terms from time to time. Continued use of the Service after any changes indicates your acceptance of the modified Terms.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>6. Disclaimer</h2>
        <p>The Service is provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.</p>
        <p style={{ marginTop: "0.5rem" }}>In Basic Mode, all data is stored in your browser&apos;s Local Storage and clearing browser data will permanently delete your records. In Session Mode, while data is stored in Firebase, deleting your account or service discontinuation may result in data loss.</p>
        <p style={{ marginTop: "0.5rem" }}>We strongly recommend regularly exporting your data to Markdown format if you wish to preserve it. We are not responsible for any loss of data or any damages resulting from the use of the Service.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>7. Analytics and Future Services</h2>
        <p>We use Google Analytics to collect anonymous usage data to improve the Service. By using the Service, you consent to the collection and use of data by Google Analytics as described in our <a href="/privacy">Privacy Policy</a>.</p>
        <p style={{ marginTop: "1rem" }}>We plan to implement Google Ads in the future to provide relevant advertisements. We will notify users before implementing this service, and details will be updated in our Privacy Policy.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>8. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or other intangible losses, resulting from your use of or inability to use the Service.</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>9. Contact</h2>
        <p>For questions or concerns about these terms, please contact us at <a href="https://x.com/pokekoyomi" target="_blank" rel="noopener noreferrer">@pokekoyomi</a> on X (formerly Twitter).</p>
      </section>

      <p style={{ marginTop: "3rem", fontSize: "1rem", fontWeight: "bold", borderTop: "1px solid #ccc", paddingTop: "1rem" }}>Last updated: April 15, 2025</p>
    </div>
  );
}
