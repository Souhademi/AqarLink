import React from "react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Social Media Section */}
        <div style={styles.section}>
          <h3>Follow Us</h3>
          <div style={styles.socialLinks}>
            <a href="https://facebook.com/Aqar Link" target="_blank" rel="noopener noreferrer">Facebook</a>
            {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a> */}
            <a href="https://www.instagram.com/aqar.link/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>

        {/* Google Map Section */}
        <div style={styles.section}>
          <h3>Find Us</h3>
          <iframe
            title="Google Map"
            width="100%"
            height="200"
            style={{ border: 0, borderRadius: "10px" }}
            src="https://www.google.com/maps/embed/v1/place?q=Algeria&key=YOUR_GOOGLE_MAPS_API_KEY"
            allowFullScreen
          ></iframe>
        </div>

        {/* Contact Section */}
        <div style={styles.section}>
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:aqar@link.com">aqarlink6@gmail.com</a></p>
          <p>Phone: +213 555 123 456</p>
          <p>Address: 123 Aqar Link St, Batna, Algeria</p>
        </div>
      </div>

      {/* Copyright */}
      <div style={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} AQAR LINK ALL RIGHTS RESERVED.</p>
      </div>
    </footer>
  );
};

// Styles
const styles = {
  footer: {
    backgroundColor: "#6EC1D1",
    color: "#fff",
    padding: "20px 0",
    textAlign: "center",
    // marginTop: "20px",
  },
  container: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "start",
    flexWrap: "wrap",
    padding: "0 20px",
  },
  section: {
    flex: 1,
    minWidth: "250px",
    padding: "10px",
    textAlign: "left",
  },
  socialLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  copyright: {
    marginTop: "10px",
    borderTop: "1px solid #555",
    paddingTop: "10px",
  },
};

export default Footer;
