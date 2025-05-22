
import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatBot from "../ChatBot";

const BusinessInfo = () => {
  const [businesses, setBusinesses] = useState([]);
  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    years: "",
    employees: "",
    revenue: "",
    propertyType: "",
    propertyLocation: "",
    size: "",
    budgetMin: "",
    budgetMax: "",
    purpose: "",
    investmentAmount: "",
    returnModel: "",
    returnDetails: "",
    investmentDuration: "",
    businessPlan: "",
    fullName: "",
    email: "",
    phone: "",
  });

  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clientId = localStorage.getItem("clientId");
    if (!clientId) {
      alert("Client ID missing. Please log in again.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });
    data.append("clientId", clientId);

    try {
      const url = editing
        ? `${process.env.REACT_APP_BACKEND_URL}/api/auth/client/business/${editingId}`
        : "${process.env.REACT_APP_BACKEND_URL}/api/auth/client/business";
      const method = editing ? "put" : "post";

      const res = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert(editing ? "Business info updated!" : "Business info added!");
        setFormData({
          businessName: "",
          industry: "",
          years: "",
          employees: "",
          revenue: "",
          propertyType: "",
          propertyLocation: "",
          size: "",
          budgetMin: "",
          budgetMax: "",
          purpose: "",
          investmentAmount: "",
          returnModel: "",
          returnDetails: "",
          investmentDuration: "",
          businessPlan: null,
          fullName: "",
          email: "",
          phone: "",
        });
        setEditing(false);
        setEditingId(null);
        fetchBusinesses();
      } else {
        alert(res.data.message || "Error processing request");
      }
    } catch (err) {
      console.error("🔥 Server error:", err);
      alert("Server error");
    }
  };

  const fetchBusinesses = async () => {
    const clientId = localStorage.getItem("clientId");
    if (!clientId) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/businesses/${clientId}`);
      setBusinesses(response.data.businesses);
    } catch (error) {
      console.error("Failed to fetch businesses:", error);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleEdit = (business) => {
    setFormData({
      businessName: business.businessName || "",
      industry: business.industry || "",
      years: business.years || "",
      employees: business.employees || "",
      revenue: business.revenue || "",
      propertyType: business.propertyType || "",
      propertyLocation: business.propertyLocation || "",
      size: business.size || "",
      budgetMin: business.budgetMin || "",
      budgetMax: business.budgetMax || "",
      purpose: business.purpose || "",
      investmentAmount: business.investmentAmount || "",
      returnModel: business.returnModel || "",
      returnDetails: business.returnDetails || "",
      investmentDuration: business.investmentDuration || "",
      businessPlan: null,
      fullName: business.fullName || "",
      email: business.email || "",
      phone: business.phone || "",
    });

    setEditing(true);
    setEditingId(business._id);
  };

  const handleDelete = async (businessId) => {
    if (!window.confirm("Are you sure you want to delete this business?")) return;

    try {
      const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/business/${businessId}`);
      if (res.data.success) {
        alert("Business deleted");
        fetchBusinesses();
      } else {
        alert(res.data.message || "Failed to delete business");
      }
    } catch (err) {
      console.error("Error deleting business:", err);
      alert("Server error");
    }
  };

  const styles = {
    input: { margin: "10px", padding: "8px", width: "40%" },
    input1: { margin: "10px", padding: "8px", width: "41.7%" },
    textarea: { margin: "10px", padding: "8px", width: "83.5%", minHeight: "60px", resize: "none" },
    button: { backgroundColor: "#1C2529", color: "white", padding: "10px", cursor: "pointer", border: "none", margin: "10px", height: "40px", width: "150px" },
    row: { display: "flex", justifyContent: "space-between" },
    editButton: { backgroundColor: "#1E5470", color: "#fff", border: "none", padding: "10px 15px", margin: "5px", cursor: "pointer", borderRadius: "5px", width: "150px", height: "40px" },
    deleteButton: { backgroundColor: "#1E5470", color: "#fff", border: "none", padding: "10px 15px", margin: "5px", cursor: "pointer", borderRadius: "5px", width: "150px", height: "40px" },
  };

  return (
    <>
      <div style={{ padding: "10px" }}>
        <h2>{editing ? "Update Your Business Proposal" : "Publish New Business Proposal"}</h2>

        <ul>
          {businesses.map((b) => (
            <li key={b._id} style={{ margin: "10px 0", border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
              <p><strong>Business Name:</strong> {b.businessName}</p>
              <p><strong>Industry:</strong> {b.industry}</p>
              <p><strong>Years in Operation:</strong> {b.years}</p>
              <p><strong>Employees:</strong> {b.employees}</p>
              <p><strong>Revenue:</strong> {b.revenue} DA</p>
              <p><strong>Property Type:</strong> {b.propertyType}</p>
              <p><strong>Property Location:</strong> {b.propertyLocation}</p>
              <p><strong>Size:</strong> {b.size} m²</p>
              <p><strong>Budget Range:</strong> {b.budgetMin} - {b.budgetMax} DA</p>
              <p><strong>Purpose:</strong> {b.purpose}</p>
              <p><strong>Investment Amount:</strong> {b.investmentAmount} DA</p>
              <p><strong>Return Model:</strong> {b.returnModel}</p>
              <p><strong>Return Details:</strong> {b.returnDetails}</p>
              <p><strong>Investment Duration:</strong> {b.investmentDuration}</p>
              <p><strong>Full Name:</strong> {b.fullName}</p>
              <p><strong>Email:</strong> {b.email}</p>
              <p><strong>Phone:</strong> {b.phone}</p>
              {b.businessPlan && (
                <p>
                  <a
                    href={`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/business-plan/${localStorage.getItem("clientId")}/${b._id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ marginLeft: "10px", color: "#007bff" }}
                  >
                    📄 View Plan
                  </a>
                </p>
              )}
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button onClick={() => handleEdit(b)} style={styles.editButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#6EC1D1"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#1E5470"}>
                  Update
                </button>
                <button onClick={() => handleDelete(b._id)}
                  style={styles.deleteButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#1C2529"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#1E5470"}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
<form onSubmit={handleSubmit} encType="multipart/form-data">
  <h3>1. Business Information</h3>
  <input
    name="businessName"
    placeholder="Business Name"
    value={formData.businessName}
    onChange={handleChange}
    style={styles.input}
  />
  <select
    name="industry"
    value={formData.industry}
    onChange={handleChange}
    style={styles.input1}
  >
    <option value="">Industry Type</option>
    <option>Retail</option>
    <option>Tech</option>
    <option>Agriculture</option>
    <option>Manufacturing</option>
    <option>Real Estate</option>
    <option>Services</option>
    <option>Others</option>
  </select>
  <select
    name="years"
    value={formData.years}
    onChange={handleChange}
    style={styles.input1}
  >
    <option value="">Years in Operation</option>
    <option>&lt; 1 year</option>
    <option>1-3 years</option>
    <option>3-5 years</option>
    <option>5+ years</option>
  </select>
  <input
    name="employees"
    type="number"
    placeholder="Number of Employees"
    value={formData.employees}
    onChange={handleChange}
    style={styles.input}
  />
  <input
    name="revenue"
    type="number"
    placeholder="Annual Revenue (DA)"
    value={formData.revenue}
    onChange={handleChange}
    style={styles.input}
  />

  <h3>2. Property Investment Requirements</h3>
  <select
    name="propertyType"
    value={formData.propertyType}
    onChange={handleChange}
    style={styles.input1}
  >
    <option value="">Property Type Needed</option>
    <option>Apartment</option>
    <option>Villa</option>
    <option>Factory</option>
    <option>Multi-unit Building</option>
    <option>Garage</option>
    <option>Land</option>
  </select>
  <input
    name="propertyLocation"
    placeholder="Preferred Location"
    value={formData.propertyLocation}
    onChange={handleChange}
    style={styles.input}
  />
  <input
    name="size"
    type="number"
    placeholder="Size Requirement (m²)"
    value={formData.size}
    onChange={handleChange}
    style={styles.input}
  />
  <input
    name="budgetMin"
    type="number"
    placeholder="Budget Min (DA)"
    value={formData.budgetMin}
    onChange={handleChange}
    style={styles.input}
  />
  <input
    name="budgetMax"
    type="number"
    placeholder="Budget Max (DA)"
    value={formData.budgetMax}
    onChange={handleChange}
    style={styles.input}
  />
  <textarea
    name="purpose"
    placeholder="Purpose of Property"
    value={formData.purpose}
    onChange={handleChange}
    style={styles.textarea}
  />

  <h3>3. Investment Proposal</h3>
  <input
    name="investmentAmount"
    type="number"
    placeholder="Investment Amount Needed (DA)"
    value={formData.investmentAmount}
    onChange={handleChange}
    style={styles.input}
  />
  <select
    name="returnModel"
    value={formData.returnModel}
    onChange={handleChange}
    style={styles.input1}
  >
    <option value="">Proposed Return Model</option>
    <option>Fixed yearly rent</option>
    <option>Revenue share (%)</option>
    <option>Equity share</option>
    <option>Custom arrangement</option>
  </select>
  <textarea
    name="returnDetails"
    placeholder="Rental/Return Plan Details"
    value={formData.returnDetails}
    onChange={handleChange}
    style={styles.textarea}
  />
  <select
    name="investmentDuration"
    value={formData.investmentDuration}
    onChange={handleChange}
    style={styles.input1}
  >
    <option value="">Investment Duration</option>
    <option>1 year</option>
    <option>2 years</option>
    <option>3-5 years</option>
    <option>Indefinite</option>
  </select>

  <h3>4. Supporting Information</h3>
  <p style={{ paddingLeft: "10px" }}>Business Plan</p>
  <input
    key={formData.businessPlan ? formData.businessPlan.name : "reset"}
    type="file"
    name="businessPlan"
    onChange={handleChange}
    accept=".pdf,.jpg,.jpeg,.png"
    style={styles.input}
  />

  <h3>5. Client Contact Info</h3>
  <input
    name="fullName"
    placeholder="Full Name"
    value={formData.fullName}
    onChange={handleChange}
    style={styles.input}
  />
  <input
    name="email"
    type="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    style={styles.input}
  />
  <input
    name="phone"
    type="tel"
    placeholder="Phone Number"
    value={formData.phone}
    onChange={handleChange}
    style={styles.input}
  />

  <div style={styles.row}>
    <button
      type="submit"
      style={styles.button}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = "#6EC1D1";
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = "#1C2529";
      }}
    >
      {editing ? "Update Business" : "Publish Business"}
    </button>
  </div>
</form>

      </div>
    </>
  );
};

export default BusinessInfo;




// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import ChatBot from "../ChatBot";

// const BusinessInfo = () => {


//   const [businesses, setBusinesses] = useState([]);
//   const [formData, setFormData] = useState({
//     businessName: "",
//     industry: "",
//     years: "",
//     employees: "",
//     revenue: "",
//     propertyType: "",
//     propertyLocation: "",
//     size: "",
//     budgetMin: "",
//     budgetMax: "",
//     purpose: "",
//     investmentAmount: "",
//     returnModel: "",
//     returnDetails: "",
//     investmentDuration: "",
//     businessPlan: "",

//     fullName: "",
//     email: "",
//     phone: "",
//   });

//   const [editing, setEditing] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
//     if (type === "file") {
//       setFormData({ ...formData, [name]: files[0] });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const clientId = localStorage.getItem("clientId");
//     if (!clientId) {
//       alert("Client ID missing. Please log in again.");
//       return;
//     }

//     const data = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//       if (value !== null) data.append(key, value);
//     });
//     data.append("clientId", clientId);

//     try {
//       const url = editing
//         ? `${process.env.REACT_APP_BACKEND_URL}/api/auth/client/business/${editingId}`
//         : "${process.env.REACT_APP_BACKEND_URL}/api/auth/client/business";
//       const method = editing ? "put" : "post";

//       const res = await axios({
//         method,
//         url,
//         data,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (res.data.success) {
//         alert(editing ? "Business info updated!" : "Business info added!");
//         setFormData({
//           businessName: "",
//           industry: "",
//           years: "",
//           employees: "",
//           revenue: "",
//           propertyType: "",
//           propertyLocation: "",
//           size: "",
//           budgetMin: "",
//           budgetMax: "",
//           purpose: "",
//           investmentAmount: "",
//           returnModel: "",
//           returnDetails: "",
//           investmentDuration: "",
//           businessPlan: null,
//           fullName: "",
//           email: "",
//           phone: "",
//         });
//         setEditing(false);
//         setEditingId(null);
//         fetchBusinesses();
//       } else {
//         alert(res.data.message || "Error processing request");
//       }
//     } catch (err) {
//       console.error("🔥 Server error:", err);
//       alert("Server error");
//     }
//   };

//   const fetchBusinesses = async () => {
//     const clientId = localStorage.getItem("clientId");
//     if (!clientId) return;

//     try {
//       const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/businesses/${clientId}`);
//       setBusinesses(response.data.businesses);
//     } catch (error) {
//       console.error("Failed to fetch businesses:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBusinesses();
//   }, []);


  

//   const handleEdit = (business) => {
//     setFormData({
//       businessName: business.businessName || "",
//       industry: business.industry || "",
//       years: business.years || "",
//       employees: business.employees || "",
//       revenue: business.revenue || "",
//       propertyType: business.propertyType || "",
//       propertyLocation: business.propertyLocation || "",
//       size: business.size || "",
//       budgetMin: business.budgetMin || "",
//       budgetMax: business.budgetMax || "",
//       purpose: business.purpose || "",
//       investmentAmount: business.investmentAmount || "",
//       returnModel: business.returnModel || "",
//       returnDetails: business.returnDetails || "",
//       investmentDuration: business.investmentDuration || "",
//       businessPlan: null, // can't pre-fill file input
//       fullName: business.fullName || "",
//       email: business.email || "",
//       phone: business.phone || "",
//     });
  
//     setEditing(true);
//     setEditingId(business._id); // Set the current business ID for updating
//   };
//   const handleDelete = async (businessId) => {
//     if (!window.confirm("Are you sure you want to delete this business?")) return;
  
//     try {
//       const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/business/${businessId}`);
//       if (res.data.success) {
//         alert("Business deleted");
//         fetchBusinesses(); // Refresh the list
//       } else {
//         alert(res.data.message || "Failed to delete business");
//       }
//     } catch (err) {
//       console.error("Error deleting business:", err);
//       alert("Server error");
//     }
//   };
    

//   const styles = {
//     input: { margin: "10px", padding: "8px", width: "40%" },
//     input1: { margin: "10px", padding: "8px", width: "41.7%" },
//     textarea: { margin: "10px", padding: "8px", width: "83.5%", minHeight: "60px",resize: "none", },
//     button: { backgroundColor: "#1C2529", color: "white", padding: "10px", cursor: "pointer", border: "none", margin: "10px",height: "40px",width: "150px" },
//     row: { display: "flex", justifyContent: "space-between" },
//     editButton: {backgroundColor: "#1E5470",color: "#fff",order: "none",padding: "10px 15px",margin: "5px",cursor: "pointer",borderRadius: "5px",width: "150px",height: "40px",},
//     deleteButton: {backgroundColor: "#1E5470",color: "#fff",border: "none",padding: "10px 15px",margin: "5px",cursor: "pointer",borderRadius: "5px",width: "150px",height: "40px"},
//   };

//   return (
//     <>
//     <div style={{padding:"10px"}}>
//       {/* <h2>Business Investment Proposal</h2> */}
//       <h2>{editing ? "Update Your Business Proposal" : "Publish New Business Proposal"}</h2>



//       <ul>
//   {businesses.map((b) => (
//     <li key={b._id} style={{ margin: "10px 0", border: "1px solid #ccc", padding: "10px", borderRadius: "8px" }}>
//       <p><strong>Business Name:</strong> {b.businessName}</p>
//       <p><strong>Industry:</strong> {b.industry}</p>
//       <p><strong>Years in Operation:</strong> {b.years}</p>
//       <p><strong>Employees:</strong> {b.employees}</p>
//       <p><strong>Revenue:</strong> {b.revenue} DA</p>
//       <p><strong>Property Type:</strong> {b.propertyType}</p>
//       <p><strong>Property Location:</strong> {b.propertyLocation}</p>
//       <p><strong>Size:</strong> {b.size} m²</p>
//       <p><strong>Budget Range:</strong> {b.budgetMin} - {b.budgetMax} DA</p>
//       <p><strong>Purpose:</strong> {b.purpose}</p>
//       <p><strong>Investment Amount:</strong> {b.investmentAmount} DA</p>
//       <p><strong>Return Model:</strong> {b.returnModel}</p>
//       <p><strong>Return Details:</strong> {b.returnDetails}</p>
//       <p><strong>Investment Duration:</strong> {b.investmentDuration}</p>
//       <p><strong>Full Name:</strong> {b.fullName}</p>
//       <p><strong>Email:</strong> {b.email}</p>
//       <p><strong>Phone:</strong> {b.phone}</p>

//       {b.businessPlan && (
//         <p>
//               <a
//           href={`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/business-plan/${localStorage.getItem("clientId")}/${b._id}`}
//           target="_blank"
//           rel="noopener noreferrer"
//           style={{ marginLeft: "10px", color: "#007bff" }}
//         >
//         📄 View Plan
//       </a>

//               </p>
//             )}

//               <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
//               <button onClick={() => handleEdit(b)}style={styles.editButton}
//                  onMouseEnter={(e) => e.target.style.backgroundColor = "#6EC1D1"}
//                  onMouseLeave={(e) => e.target.style.backgroundColor = "#1E5470"}>
//                   Update
//                 </button>
//                 <button onClick={() => handleDelete(b._id)}
//                   style={styles.deleteButton}
//                   onMouseEnter={(e) => e.target.style.backgroundColor = "#1C2529"}
//                   onMouseLeave={(e) => e.target.style.backgroundColor = "#1E5470"}>
//                   Delete
//                 </button>
//               </div>
//           </li>
//         ))}
//       </ul>


//       <form onSubmit={handleSubmit} encType="multipart/form-data">
//         <h3>1. Business Information</h3>
//         <input name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} style={styles.input} required />
//         <select name="industry" value={formData.industry} onChange={handleChange} style={styles.input1} required>
//           <option value="">Industry Type</option>
//           <option>Retail</option><option>Tech</option><option>Agriculture</option><option>Manufacturing</option><option>Real Estate</option><option>Services</option><option>Others</option>
//         </select>
//         {/* <div style={styles.row}> */}
//           <select name="years" value={formData.years} onChange={handleChange} style={styles.input1} required>
//             <option value="">Years in Operation</option>
//             <option>&lt; 1 year</option><option>1-3 years</option><option>3-5 years</option><option>5+ years</option>
//           </select>
//           <input name="employees" type="number" placeholder="Number of Employees" value={formData.employees} onChange={handleChange} style={styles.input} required />
//         {/* </div> */}
//         <input name="revenue" type="number" placeholder="Annual Revenue (DA)" value={formData.revenue} onChange={handleChange} style={styles.input} required />

//         <h3>2. Property Investment Requirements</h3>
//         <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={styles.input1} required>
//           <option value="">Property Type Needed</option>
//           <option>Apartment</option><option>Villa</option><option>Factory</option><option>Multi-unit Building</option><option>Garage</option><option>Land</option>
//         </select>
//         <input name="propertyLocation" placeholder="Preferred Location" value={formData.propertyLocation} onChange={handleChange} style={styles.input} required />
//         {/* <div style={styles.row}> */}
//           <input name="size" type="number" placeholder="Size Requirement (m²)" value={formData.size} onChange={handleChange} style={styles.input} required />
//           <input name="budgetMin" type="number" placeholder="Budget Min (DA)" value={formData.budgetMin} onChange={handleChange} style={styles.input} required />
//           <input name="budgetMax" type="number" placeholder="Budget Max (DA)" value={formData.budgetMax} onChange={handleChange} style={styles.input} required />
//         {/* </div> */}
//         <textarea name="purpose" placeholder="Purpose of Property" value={formData.purpose} onChange={handleChange} style={styles.textarea} required />

//         <h3>3. Investment Proposal</h3>
//         <input name="investmentAmount" type="number" placeholder="Investment Amount Needed (DA)" value={formData.investmentAmount} onChange={handleChange} style={styles.input} required />
//         <select name="returnModel" value={formData.returnModel} onChange={handleChange} style={styles.input1} required>
//           <option value="">Proposed Return Model</option>
//           <option>Fixed yearly rent</option><option>Revenue share (%)</option><option>Equity share</option><option>Custom arrangement</option>
//         </select>
//         <textarea name="returnDetails" placeholder="Rental/Return Plan Details" value={formData.returnDetails} onChange={handleChange} style={styles.textarea} required />
//         <select name="investmentDuration" value={formData.investmentDuration} onChange={handleChange} style={styles.input1} required>
//           <option value="">Investment Duration</option>
//           <option>1 year</option><option>2 years</option><option>3-5 years</option><option>Indefinite</option>
//         </select>

//         <h3>4. Supporting Information</h3>
//         <p style={{paddingLeft:"10px"}}>Business Plan</p>

//         {/* <input type="file" name="businessPlan" onChange={handleChange} accept=".pdf,.jpg,.jpeg,.png" style={styles.input} required /> */}
//         <input
//         key={formData.businessPlan ? formData.businessPlan.name : "reset"} // force re-render on file clear
//         type="file"
//         name="businessPlan"
//         onChange={handleChange}
//         accept=".pdf,.jpg,.jpeg,.png"
//         style={styles.input}
//         required
//       />


//         <h3>5. Client Contact Info</h3>
//         <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} style={styles.input} required />
//         <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} style={styles.input} required />
//         <input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} style={styles.input} required />
// <div style={styles.row}>
      
//   <button type="submit" style={styles.button}
      

//           onMouseEnter={(e) => {
//             e.target.style.backgroundColor = "#6EC1D1"; // Change color on hover
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.backgroundColor = "#1C2529"; // Revert color when mouse leaves
//           }}>
//             {editing ? "Update Business" : "Publish Business"}
//         </button>
//     </div>
//       </form>






//       {/* <ChatBot /> */}
//       </div>
//     </>
//   );
// };

// export default BusinessInfo;
