import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentSuccess = () => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      const token = localStorage.getItem("lastInvoiceToken"); // stored at payment time
      if (!token) return;

      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/payment/invoice/${token}`);
        setInvoice(res.data);
      } catch (err) {
        console.error("Failed to fetch invoice", err);
      }
    };

    fetchInvoice();
  }, []);

  if (!invoice) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>✅ Payment Successful</h2>
      <p><strong>Email:</strong> {invoice.email}</p>
      <p><strong>Amount:</strong> {invoice.amount} DA</p>
      <p><strong>Status:</strong> {invoice.status}</p>

      {invoice.transactionHash ? (
        <p>
          ✅ Verified on Blockchain:{" "}
          <a
            href={`https://mumbai.polygonscan.com/tx/${invoice.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Transaction
          </a>
        </p>
      ) : (
        <p>⏳ Waiting for blockchain confirmation...</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
